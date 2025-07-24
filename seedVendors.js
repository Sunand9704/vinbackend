require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Vendor = require("./models/Vendor");

const vendors = [
  {
    name: "Vendor One",
    email: "hosannarocker6594@gmail.com",
    password: "password123",
  },
  {
    name: "Vendor Two",
    email: "bambooartandcraft@gmail.com",
    password: "94075#@Bamboo",
  },
];

async function seedVendors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Hash passwords
    for (let vendor of vendors) {
      const salt = await bcrypt.genSalt(10);
      vendor.password = await bcrypt.hash(vendor.password, salt);
    }

    // Remove existing vendors
    await Vendor.deleteMany({});
    // Insert new vendors
    await Vendor.insertMany(vendors);
    console.log("Vendors seeded successfully");
  } catch (error) {
    console.error("Error seeding vendors:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedVendors();
