import mongoose from 'mongoose';
import dns from 'dns';

// Ensure public DNS resolution on Windows networks for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if unable to override DNS servers
}

// Disable command buffering so queries fail immediately without delay when DB is disconnected
mongoose.set('bufferCommands', false);

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jharkhand_civic';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to Atlas (${error.message}). Using resilient in-memory storage for civic issues.`);
  }
};

