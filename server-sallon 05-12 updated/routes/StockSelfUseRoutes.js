const express = require('express');
const router = express.Router();
const SelfUseStockController = require('../controllers/StockSelfUseController');

// Define routes for appointments
router.post('/stock-selfuse', SelfUseStockController.CreateSelfUseStock);

module.exports = router;

