const mongoose = require('mongoose');
const Service = mongoose.model('Service', {
    serviceName: String,
    category: String,
    price: Number,  
    durationTime: String,
  });
  module.exports = Service;