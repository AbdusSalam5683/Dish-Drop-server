// dish-drop-server/src/seedAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@dishdrop.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@dishdrop.com',
      password: hashedPassword,
      role: 'admin',
      image: 'https://ui-avatars.com/api/?name=Admin&background=D85A30&color=fff&size=128'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@dishdrop.com');
    console.log('🔑 Password: Admin@123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedAdmin();