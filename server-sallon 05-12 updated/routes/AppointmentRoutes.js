const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

// Define routes for appointments
router.post('/customers/:id/appointments', AppointmentController.CreateAppointment);
router.put('/appointments/:id', AppointmentController.UpdateAppointment);

router.delete('/customers/:customerId/appointments/:appointmentId', AppointmentController.DeleteAppointment);


module.exports = router;
