import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Allowed categories and severities per specification
const ALLOWED_CATEGORIES = ['Roads', 'Water', 'Sanitation', 'Electricity', 'Other'];
const ALLOWED_SEVERITIES = ['High', 'Medium', 'Low'];

/**
 * Fallback classification heuristic if Groq API is unavailable or rate limited
 */
const getFallbackTriage = (description = '') => {
  const text = description.toLowerCase();
  let category = 'Other';
  let severity = 'Medium';

  if (text.includes('pothole') || text.includes('road') || text.includes('traffic') || text.includes('bridge')) {
    category = 'Roads';
    severity = 'High';
  } else if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drain')) {
    category = 'Water';
    severity = text.includes('flood') || text.includes('burst') ? 'High' : 'Medium';
  } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('sewage') || text.includes('smell')) {
    category = 'Sanitation';
    severity = text.includes('overflow') || text.includes('severe') ? 'High' : 'Medium';
  } else if (text.includes('electric') || text.includes('light') || text.includes('wire') || text.includes('power') || text.includes('pole')) {
    category = 'Electricity';
    severity = text.includes('spark') || text.includes('danger') || text.includes('live wire') ? 'High' : 'Medium';
  }

  return { category, severity };
};

/**
 * AI Civic Issue Triage using Groq Vision
 * @param {string} imageUrl - Public Cloudinary URL or Data URL
 * @param {string} description - User provided text description
 * @returns {Promise<{ category: string, severity: string }>}
 */
export const triageIssueWithVision = async (imageUrl, description) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'gsk_placeholder_key' || apiKey.startsWith('your_')) {
    console.warn('[Groq Triage] No valid GROQ_API_KEY detected. Using intelligent heuristic fallback.');
    return getFallbackTriage(description);
  }

  try {
    const groq = new Groq({ apiKey });

    const systemPrompt = `You are an AI civic issue triage assistant. Analyze the image and the user's description. Determine the category from: [Roads, Water, Sanitation, Electricity, Other]. Determine the severity from: [High, Medium, Low]. Output STRICTLY valid JSON with 'category' and 'severity' keys. Do not include markdown blocks or any other text.`;

    const userContent = [
      {
        type: 'text',
        text: `Citizen description: "${description || 'Civic issue reported'}"`,
      },
    ];

    // Add image URL if valid HTTP/HTTPS URL
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: imageUrl,
        },
      });
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Image URL: ${imageUrl || 'None'}\nCitizen description: "${description || 'Civic issue reported'}"`,
        },
      ],
      temperature: 0.1,
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

    return { category, severity };
  } catch (error) {
    console.error('[Groq Triage Error]:', error.message);
    console.warn('[Groq Triage] Falling back to text heuristic classification.');
    return getFallbackTriage(description);
  }
};

export default { triageIssueWithVision };
