/**
 * Spam Detection Middleware
 * Multi-layer approach to detect and reject fake/spam civic reports.
 */
export const detectSpam = (req, res, next) => {
  // Layer 1: Dedicated bot trap field check (non-standard name to avoid browser autofill collisions)
  if (req.body._gov_bot_trap || req.body.antispam_hp) {
    console.warn('[Spam Defense] Bot detected via honeypot trap field.');
    return res.status(400).json({
      success: false,
      message: 'Automated submission rejected.',
    });
  }

  // Layer 2: Form Interaction Velocity Check
  // If client provides a formTimestamp, ensure user spent at least 1.2 seconds before submitting
  if (req.body.formTimestamp) {
    const elapsedMs = Date.now() - parseInt(req.body.formTimestamp, 10);
    if (!isNaN(elapsedMs) && elapsedMs < 1200) {
      console.warn(`[Spam Defense] Sub-second submission detected (${elapsedMs}ms). Rejecting bot.`);
      return res.status(400).json({
        success: false,
        message: 'Submission was too fast. Please take time to verify your grievance details.',
      });
    }
  }

  // Layer 3: Description quality check (minimum length)
  const desc = (req.body.description || '').trim();
  if (desc.length < 20) {
    return res.status(400).json({
      success: false,
      message: 'Description must be at least 20 characters long for proper triage.',
    });
  }

  // Layer 4: GPS bounds check — coordinates must be within Jharkhand region
  const lat = parseFloat(req.body.latitude);
  const lng = parseFloat(req.body.longitude);
  if (lat && lng) {
    // Jharkhand state bounding box: 21.5°N-25.5°N, 83.0°E-88.0°E
    const inJharkhand = lat >= 21.5 && lat <= 25.5 && lng >= 83.0 && lng <= 88.0;
    if (!inJharkhand) {
      return res.status(400).json({
        success: false,
        message: 'Location must be within Jharkhand state boundaries.',
      });
    }
  }

  // Layer 5: Image MIME type validation
  if (req.file && !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPEG, PNG, WebP) are accepted as evidence.',
    });
  }

  next();
};

