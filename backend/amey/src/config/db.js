import mongoose from 'mongoose';
import dns from 'dns';

// Ensure public DNS resolution on Windows networks for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if unable to override DNS servers
}

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jharkhand_civic');
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

