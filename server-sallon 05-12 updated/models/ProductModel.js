const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    itemName: String,
     manufacturer: String,
     supplier:String,
     price: Number,
     stock: Number,


});

module.exports = mongoose.model('Product', productSchema);
