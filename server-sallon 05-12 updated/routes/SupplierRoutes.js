const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/SupplierController');

// Define routes for appointments
router.post('/suppliers', SupplierController.CreateSupplier);
router.put('/suppliers/:id', SupplierController.UpdateSupplier);
router.get('/suppliers', SupplierController.ReadSupplier);
router.delete('/suppliers/:id', SupplierController.DeleteSupplier)

module.exports = router;
