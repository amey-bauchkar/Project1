import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

// Ensure public DNS resolution on Windows networks for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if unable to override DNS servers
}

// Disable command buffering so queries fail immediately without hanging when DB is disconnected
mongoose.set('bufferCommands', false);

/**
 * Connect to MongoDB database with retry and status event listeners
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jharkhand_civic';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: Could not connect to database (${error.message}). Please verify MONGO_URI and network access.`);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB Event]: Database connection disconnected.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB Event]: Database reconnected successfully.');
  });
};

