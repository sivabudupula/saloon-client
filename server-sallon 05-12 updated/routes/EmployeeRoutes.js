const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');

// Define routes for appointments
router.post('/employees', EmployeeController.CreateEmployee);
 router.put('/employees/:id', EmployeeController.UpdateEmployee);
router.get('/employees', EmployeeController.ReadEmployee);
router.delete('/employees/:id', EmployeeController.DeleteEmployee);

module.exports = router;

