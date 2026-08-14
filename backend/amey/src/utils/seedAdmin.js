import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();


const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jharkhand_civic';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database.');

    const adminEmail = 'admin@jharkhand.gov';
    const adminPassword = 'password123';

    // Remove existing admin if any
    await User.deleteOne({ email: adminEmail });

    const adminUser = await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('--------------------------------------------');
    console.log('✅ Admin User Successfully Seeded!');
    console.log(`   Email:    ${adminUser.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role:     ${adminUser.role}`);
    console.log('--------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Admin Error]:', error.message);
    process.exit(1);
  }
};

seedAdmin();
