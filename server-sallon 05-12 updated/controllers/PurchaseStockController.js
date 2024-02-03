const PurchaseProduct = require('../models/PurchaseStockModel');
const Product = require('../models/ProductModel');

exports.CreateStock= async (req, res) => {
    const purchaseData = req.body;
  
    try {
      const newPurchaseProduct = new PurchaseProduct(purchaseData);
  
      // Update stock quantity in Product collection for each product purchased
      for (const purchaseItem of newPurchaseProduct.tableData) {
        const product = await Product.findOne({ itemName: purchaseItem.product });
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
  
        // Add the purchased quantity to the stock
        product.stock += parseInt(purchaseItem.quantity, 10);
  
        // Save the updated product document
        await product.save();
      }
  
      await newPurchaseProduct.save();
      res.status(200).json({ message: 'Purchase data recorded successfully.' });
    } catch (error) {
      console.error('Error recording purchase data:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  
  exports.ReadStock= async (req, res) => {
    try {
      const properties = await PurchaseProduct.find();
      res.status(200).json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  
  