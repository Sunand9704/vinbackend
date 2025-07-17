const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name, description, price, category, stock,
      length, width, height, discount, isDiscountActive,
      discountStartDate, discountEndDate, offerPrice,
      offerStartDate, offerEndDate, isOfferActive
    } = req.body;

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });

        fs.unlinkSync(file.path); // Delete temp local file
      }
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      length,
      width,
      height,
      images: uploadedImages,
      discount,
      isDiscountActive,
      discountStartDate,
      discountEndDate,
      offerPrice,
      offerStartDate,
      offerEndDate,
      isOfferActive
    });

    await product.save();
    res.status(201).json(product);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
// Update product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = { ...req.body };
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log(req.files)

  
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
// ...existing code...
// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      try {
        await cloudinary.uploader.destroy(image.public_id);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products by category' });
  }
};
