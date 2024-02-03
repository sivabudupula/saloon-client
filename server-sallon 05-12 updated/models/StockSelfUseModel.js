const mongoose = require('mongoose');
const selfUseStockSchema = new mongoose.Schema({
    items: [
      {
        product: String,
        quantity: String,
      },
    ],
  });
  
  module.exports = mongoose.model('SelfUseStock', selfUseStockSchema);
  