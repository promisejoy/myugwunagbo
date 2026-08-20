const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Dynamically require User model after connection
    const User = require('../src/models/User');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`📧 Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    const admin = new User({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: 'admin@ugwunagbo.gov.ng',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      fullName: 'Administrator',
      role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log(`👤 Username: ${admin.username}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();