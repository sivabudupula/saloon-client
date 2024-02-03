const Customer = require('../models/CustomerModel');
const path = require('path');
exports.CreateCustomer= async (req, res) => {
    try {
      const { name, dob,email, phone, address } = req.body;
      const newCustomer = new Customer({
        name,
        dob,
        email,
        phone,
        address,
        profilePhoto: req.file ? req.file.path : null,
    });
      await newCustomer.save();
      res.status(201).json(newCustomer);
    } catch (error) {
      console.error('Error saving customer data:', error);
      res.status(500).json({ error: 'Error saving customer data' });
    }
  };
  
  exports.ReadCustomer= async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Error fetching customers' });
    }
  };

  exports.UpdateCustomer= async(req,res)=>{
    const id = req.params.id;
    const updatedCustomerData = req.body;
  
    try{
      const updatedCustomer = await Customer.findByIdAndUpdate(
        id,
        updatedCustomerData,
        {new: true}
      );
      if(!updatedCustomer){
        return res.status(404).json({error: 'Customer not found'});
      }
      res.status(200).json({message:'customer updated successfully',customer: updatedCustomer});
    }catch (error){
      console.log("error",error);
     res.status(500).json({error: 'An error occured while updating the customer'}) 
    }
  }
  
  