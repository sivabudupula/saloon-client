const Product = require('../models/ProductModel');
const SelfUseStock = require('../models/StockSelfUseModel');

exports.CreateSelfUseStock= async (req, res) => {
    const stockSelfData = req.body;
  
    console.log('Received data from frontend:', stockSelfData);
  
    try {
      // Loop through the items in stockSelfData and update product stock
      for (const item of stockSelfData) {
        // Find the product by itemName
        const product = await Product.findOne({ itemName: item.product });
  
        if (!product) {
          // Handle the case where the product is not found
          console.error(`Product '${item.product}' not found`);
          continue; // Continue with the next item
        }
  
        // Subtract the quantity used for self-use from product stock
        const quantityUsed = parseInt(item.quantity, 10);
        product.stock -= quantityUsed;
  
        // Save the updated product data
        await product.save();
      }
  
      // Create a new SelfUseStock document with the received data
      const newSelfUseStock = new SelfUseStock({ items: stockSelfData });
  
      // Save the new document to the database
      await newSelfUseStock.save();
  
      console.log('Data saved successfully');
      res.status(201).json('Stock-selfuse data saved successfully');
    } catch (error) {
      console.error('Error saving stock-selfuse data:', error);
      res.status(500).json(`Error saving stock-selfuse data: ${error}`);
    }
  };
  
  