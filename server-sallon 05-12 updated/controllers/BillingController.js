const Customer = require('../models/CustomerModel');
const Product = require('../models/ProductModel');

exports.CreateBill= async (req, res) => {
    const customerId = req.params.id; // Use "_id" as the parameter name
    const billingData = req.body;
    console.log(req.params.id);
    
    try {
      const customer = await Customer.findOne({ _id:customerId}); // Use "_id" to find the customer
      if (!customer) {
        console.log('Customer not found for _id:', customerId);
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      // Add the new appointment to the customer's appointments array
      customer.billing.push(billingData);
  
      // Save the updated customer document
      await customer.save();
  
      for (const item of billingData.items) {
        const product = await Product.findOne({ itemName: item.itemName });
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
  
        // Subtract the quantity sold from the stock
        product.stock -= item.quantity;
  
        // Save the updated product document
        await product.save();
      }
  
      res.status(201).json('Billing data saved successfully for the customer');
    } catch (error) {
      console.error('Error saving billing data:', error.message);
      console.log('_id:', customerId);
      res.status(500).json({ error: 'Error saving billing data.' });
    }
  };
  
  exports.UpdateBill= async (req, res) => {
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
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      res.status(200).json({ message: 'Customer updated successfully.' });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };



