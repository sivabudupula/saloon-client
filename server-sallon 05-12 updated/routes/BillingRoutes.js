const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/BillingController');

// Define routes for appointments
router.post('/customers/:id/billing', BillingController.CreateBill);
router.put('/customers/billing/:id', BillingController.UpdateBill);


module.exports = router;
