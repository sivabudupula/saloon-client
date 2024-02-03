const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');

// Define routes for appointments
router.post('/services', ServiceController.CreateService);
router.put('/services/:id', ServiceController.UpdateService);
router.get('/services', ServiceController.ReadService);
router.delete('/services/:id', ServiceController.DeleteService);

module.exports = router;
