const Customer = require('../models/CustomerModel');

// exports.CreateAppointment= async (req, res) => {
//   const { _id } = req.params; // Use "_id" as the parameter name
//   const appointmentData = req.body;

//   try {
//     const customer = await Customer.findOne({ _id }); // Use "_id" to find the customer
//     if (!customer) {
//       console.log('Customer not found for _id:', _id);
//       return res.status(404).json({ error: 'Customer not found.' });
//     }

//     // Add the new appointment to the customer's appointments array
//     customer.appointments.push(appointmentData);

//     // Save the updated customer document
//     await customer.save();

//     console.log('Appointment data saved successfully:', appointmentData);

//     res.status(201).json(appointmentData);
//   } catch (error) {
//     console.error('Error saving appointment data:', error.message);
//     console.log('_id:', _id);
//     res.status(500).json({ error: 'Error saving appointment data.' });
//   }
// };

exports.CreateAppointment = async (req, res) => {
  const customerId = req.params.id; // Correctly access customerId
  const appointmentData = req.body;
 console.log(req.params.id);
  try {
    const customer = await Customer.findOne({ _id: customerId }); // Use "_id" to find the customer
    if (!customer) {
      console.log('Customer not found for _id:', customerId);
      return res.status(404).json({ error: 'Customer not found.' });
    }

    // Add the new appointment to the customer's appointments array
    customer.appointments.push(appointmentData);

    // Save the updated customer document
    await customer.save();

    console.log('Appointment data saved successfully:', appointmentData);

    res.status(201).json(appointmentData);
  } catch (error) {
    console.error('Error saving appointment data:', error.message);
    console.log('customerId:', customerId);
    res.status(500).json({ error: 'Error saving appointment data.' });
  }
};

  exports.UpdateAppointment= async (req, res) => {
    const propertyId = req.params.id;
    const updatedData = req.body;
  
    try {

      console.log('propertyId:', propertyId);
        console.log('updatedData:', updatedData);

      const updatedProperty = await Customer.findByIdAndUpdate(
        propertyId,
        updatedData,
        { new: true }
      );
  
      if (!updatedProperty) {
        return res.status(404).json({ error: 'Property not found.' });
      }
  
      res.status(200).json({ message: 'Property updated successfully.' });
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };


  exports.DeleteAppointment= async (req, res) => {
    const customerId = req.params.customerId;
    const appointmentId = req.params.appointmentId;
  
    try {
      // Find the customer by ID
      const customer = await Customer.findById(customerId);
  
      if (!customer) {
        // If the customer with the given ID was not found
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      // Find the appointment within the customer's appointments
      const appointmentIndex = customer.appointments.findIndex((appt) => appt._id.toString() === appointmentId);
  
      if (appointmentIndex === -1) {
        // If the appointment with the given ID was not found within the customer's appointments
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      // Remove the appointment from the customer's appointments array
      customer.appointments.splice(appointmentIndex, 1);
  
      // Save the updated customer data
      await customer.save();
  
      // If the appointment was successfully deleted
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  