/**
 * Spam Detection Middleware
 * Multi-layer approach to detect and reject fake/spam civic reports.
 */
export const detectSpam = (req, res, next) => {
  // Layer 1: Honeypot field — if a hidden 'website' field is filled, it's a bot
  if (req.body.website) {
    // Silent reject — return 200 to avoid revealing detection to bot
    return res.status(200).json({ success: true, message: 'Report submitted successfully.' });
  }

  // Layer 2: Description quality check
  const desc = (req.body.description || '').trim();
  if (desc.length < 20) {
    return res.status(400).json({
      success: false,
      message: 'Description must be at least 20 characters long for proper triage.',
    });
  }

  // Layer 3: GPS bounds check — coordinates must be within Jharkhand
  const lat = parseFloat(req.body.latitude);
  const lng = parseFloat(req.body.longitude);
  if (lat && lng) {
    // Jharkhand approximate bounding box: 21.5°N-25.5°N, 83.0°E-88.0°E
    const inJharkhand = lat >= 21.5 && lat <= 25.5 && lng >= 83.0 && lng <= 88.0;
    if (!inJharkhand) {
      return res.status(400).json({
        success: false,
        message: 'Location must be within Jharkhand state boundaries.',
      });
    }
  }

  // Layer 4: Image MIME type validation
  if (req.file && !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPEG, PNG, WebP) are accepted as evidence.',
    });
  }

  next();
};
