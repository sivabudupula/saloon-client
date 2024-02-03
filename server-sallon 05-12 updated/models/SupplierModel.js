const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplier: String,
    contact: String,
    email: String,
    address: String,
     
  
  
  });
  
  module.exports = mongoose.model('Supplier', supplierSchema);