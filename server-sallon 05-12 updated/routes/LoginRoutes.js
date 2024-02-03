const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

// Define routes for appointments
router.post('/login', LoginController.CreateLogin);
// router.put('/employees/:id', EmployeeController.UpdateCustomer);
// router.get('/employees', EmployeeController.ReadCustomer);
// router.delete('/employees/:id', EmployeeController.DeleteCustomer);

module.exports = router;
