import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an in-memory buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {String} originalName
 * @returns {Promise<string>} Secure URL of uploaded image
 */
export const uploadToCloudinary = (fileBuffer, originalName = 'issue_image') => {
  return new Promise((resolve, reject) => {
    // If running in development without valid Cloudinary credentials, return a fallback placeholder
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo' ||
      !process.env.CLOUDINARY_API_KEY
    ) {
      console.warn('[Cloudinary] Valid credentials not configured. Using data URI/placeholder image.');
      const base64 = fileBuffer.toString('base64');
      return resolve(`data:image/jpeg;base64,${base64}`);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'jharkhand_civic_issues',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
