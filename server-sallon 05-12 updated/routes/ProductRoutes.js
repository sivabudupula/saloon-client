const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Define routes for appointments
router.post('/Products', ProductController.CreateProduct);
router.put('/Products/:id', ProductController.UpdateProduct);
router.get('/Products', ProductController.ReadProduct);
router.delete('/Products/:id', ProductController.DeleteProduct)
module.exports = router;
