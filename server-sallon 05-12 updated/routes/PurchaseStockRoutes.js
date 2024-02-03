const express = require('express');
const router = express.Router();
const StockController = require('../controllers/PurchaseStockController');

// Define routes for appointments
router.post('/Stock', StockController.CreateStock);
router.get('/Stock', StockController.ReadStock);


module.exports = router;
