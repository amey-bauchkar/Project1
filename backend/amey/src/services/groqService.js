import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Allowed categories and severities per specification
const ALLOWED_CATEGORIES = ['Roads', 'Water', 'Sanitation', 'Electricity', 'Other'];
const ALLOWED_SEVERITIES = ['High', 'Medium', 'Low'];
const DEPARTMENTS = {
  Roads: 'Roads & Infrastructure',
  Water: 'Water Supply',
  Sanitation: 'Sanitation & Waste',
  Electricity: 'Electricity Board',
  Other: 'General Services',
};

/**
 * Fallback classification heuristic if Groq API is unavailable or rate limited
 */
const getFallbackTriage = (description = '') => {
  const text = description.toLowerCase();
  let category = 'Other';
  let severity = 'Medium';

  if (text.includes('pothole') || text.includes('road') || text.includes('traffic') || text.includes('bridge') || text.includes('crack')) {
    category = 'Roads';
    severity = 'High';
  } else if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drain') || text.includes('tap')) {
    category = 'Water';
    severity = text.includes('flood') || text.includes('burst') ? 'High' : 'Medium';
  } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('sewage') || text.includes('smell')) {
    category = 'Sanitation';
    severity = text.includes('overflow') || text.includes('severe') ? 'High' : 'Medium';
  } else if (text.includes('electric') || text.includes('light') || text.includes('wire') || text.includes('power') || text.includes('pole')) {
    category = 'Electricity';
    severity = text.includes('spark') || text.includes('danger') || text.includes('live wire') ? 'High' : 'Medium';
  }

  return {
    category,
    severity,
    summary: `Citizen-reported ${category.toLowerCase()} issue requiring municipal attention.`,
    department: DEPARTMENTS[category] || 'General Services',
    confidence: 0.3,
  };
};

/**
 * AI Civic Issue Triage using Groq Vision (Multimodal)
 * Uses qwen/qwen3.6-27b with proper multimodal content array.
 * @param {string} imageUrl - Public Cloudinary URL
 * @param {string} description - User provided text description
 * @returns {Promise<{ category: string, severity: string, summary: string, department: string, confidence: number }>}
 */
export const triageIssueWithVision = async (imageUrl, description) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'gsk_placeholder_key' || apiKey.startsWith('your_')) {
    console.warn('[Groq Triage] No valid GROQ_API_KEY detected. Using heuristic fallback.');
    return getFallbackTriage(description);
  }

  try {
    const groq = new Groq({ apiKey });

    // Build proper multimodal content array
    const userContent = [
      {
        type: 'text',
        text: `You are a municipal civic issue analyst for the Government of Jharkhand, India.

Analyze the image of a reported civic infrastructure problem along with the citizen's description.

Citizen description: "${description || 'Civic issue reported'}"

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "category": "Roads" | "Water" | "Sanitation" | "Electricity" | "Other",
  "severity": "High" | "Medium" | "Low",
  "summary": "One professional sentence summarizing the issue",
  "department": "Roads & Infrastructure" | "Water Supply" | "Sanitation & Waste" | "Electricity Board" | "General Services",
  "confidence": 0.0 to 1.0
}`,
      },
    ];

    // Add image only if valid HTTP URL exists
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: imageUrl,
        },
      });
    }

    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3.6-27b',
      messages: [
        {
          role: 'user',
          content: userContent,
        },
      ],
      temperature: 0.1,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty response from Groq Vision model');
    }

    // Clean JSON response if model added markdown wrappers
    let cleanJsonStr = content;
    if (cleanJsonStr.startsWith('```json')) {
      cleanJsonStr = cleanJsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanJsonStr);

    const category = ALLOWED_CATEGORIES.includes(parsed.category) ? parsed.category : 'Other';
    const severity = ALLOWED_SEVERITIES.includes(parsed.severity) ? parsed.severity : 'Medium';

    return {
      category,
      severity,
      summary: parsed.summary || `${category} issue reported by citizen.`,
      department: DEPARTMENTS[category] || parsed.department || 'General Services',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
    };
  } catch (error) {
    console.error('[Groq Triage Error]:', error.message);
    console.warn('[Groq Triage] Falling back to text heuristic classification.');
    return getFallbackTriage(description);
  }
};

export default { triageIssueWithVision };
