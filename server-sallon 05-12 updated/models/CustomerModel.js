const mongoose = require('mongoose');

  const customerSchema = new mongoose.Schema({
  customerId: String,
  name: String,
  dob: String,
  email: String,
  address: String,
  phone: String,
  profilePhoto: String,
    
    
  
  appointments: [{
    name: String,
    address: String,
    phone:String,
    discount: String,
    date: String,
    fromTiming: String,
    toTiming: String,
    advance: String,
    notes: String,
    selectedServices: [String]
  }],
  billing: [{
    billNumber: String,
    date: String,
    customer: String,
    services: [Object], // An array of service objects
    items: [Object], // An array of item objects
    discountPercent: Number,
    discountAmount: Number,
    paymentMethod:String,
    gstPercent:String,
    totalAmount: Number,
  }], 
});

customerSchema.pre('save', async function (next) {
  try {
    if (!this.customerId) {
      // Find the maximum customerId in the database
      const maxCustomerId = await Customer.findOne({}, { customerId: 1 })
        .sort({ customerId: -1 })
        .exec();

      // Increment the number part of the customerId
      const lastNumber = maxCustomerId ? parseInt(maxCustomerId.customerId?.substring(3)) || 0 : 0;
      const newNumber = lastNumber + 1;

      // Generate the new customerId with SAL prefix and 4 zeros followed by the incremented number
      this.customerId = `SAL${String(newNumber).padStart(4, '0')}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;