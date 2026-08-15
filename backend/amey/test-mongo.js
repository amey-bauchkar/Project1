import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('❌ MONGO_URI is not set in environment variables.');
  process.exit(1);
}

console.log('Testing connection to MongoDB Atlas...');
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function run() {
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    await client.close();
  } catch (err) {
    console.error('❌ Connection error details:', err.message);
  }
}

run();

