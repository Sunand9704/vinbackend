const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect("mongodb+srv://aravind:aravind143@cluster0.f5vzeqf.mongodb.net/vin2grow?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initializeSoldCount = async () => {
  try {
    console.log("Starting soldCount initialization...");

    // Find all products that don't have soldCount field or have soldCount as 0
    const products = await Product.find({
      $or: [{ soldCount: { $exists: false } }, { soldCount: 0 }],
    });

    console.log(`Found ${products.length} products to initialize`);

    // Initialize soldCount with random values for demonstration
    // In a real scenario, you might want to calculate this from order history
    for (const product of products) {
      const randomSoldCount = Math.floor(Math.random() * 150) + 10; // Random between 10-160

      await Product.findByIdAndUpdate(product._id, {
        soldCount: randomSoldCount,
      });

      console.log(`Updated ${product.name} with soldCount: ${randomSoldCount}`);
    }

    console.log("Sold count initialization completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing sold count:", error);
    process.exit(1);
  }
};

// Run the script
initializeSoldCount();
