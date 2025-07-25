const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
// TODO: Implement vendor authentication middleware
// const { authenticateVendor } = require('../middleware/vendorAuth');

// Vendor login
router.post("/login", vendorController.login);

// Vendor update password (should be protected)
// router.post('/update-password', authenticateVendor, vendorController.updatePassword);
router.post("/update-password", vendorController.updatePassword); // Unprotected for now
router.post("/forgot-password", vendorController.forgotPassword);
router.post("/reset-password", vendorController.resetPassword);
router.post("/send-otp", vendorController.sendOtp);
router.post("/verify-otp", vendorController.verifyOtp);

// Create a new vendor (admin)
router.post('/', vendorController.createVendor);

// Get all vendors (admin)
router.get('/admin/all', vendorController.getAllVendors);

// Delete a vendor by ID (admin)
router.delete('/:id', vendorController.deleteVendor);

module.exports = router;
