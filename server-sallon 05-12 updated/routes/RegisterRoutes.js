const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');
const Middleware = require('../controllers/Middleware'); // Import your middleware here

// Define routes for appointments
router.post('/register', RegisterController.CreateRegister);
router.get('/register', Middleware,RegisterController.ReadRegister);
router.put('/register/:id', RegisterController.UpdateRegister);
module.exports = router;
