import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://bauchkaramey1306_db_user:project1@project1.xxhxofo.mongodb.net/?appName=PROJECT1';

console.log('Testing connection to MongoDB...');
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function run() {
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    await client.close();
  } catch (err) {
    console.error('❌ Connection error details:', err);
  }
}

run();
