require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const admin = {
  name: 'Admin',
  email: 'admin@example.com', // Change as needed
  password: 'admin123',       // Change as needed
  phone: '1234567890',
  role: 'admin',
};

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);

    // Remove existing admin(s) with same email
    await User.deleteMany({ email: admin.email, role: 'admin' });
    // Insert new admin
    await User.create(admin);
    console.log('Admin seeded successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedAdmin(); 