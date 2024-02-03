const Product = require('../models/ProductModel');

exports.CreateProduct= async (req, res) => {
    const productData = req.body;
  
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      res.status(200).json({ message: 'Property created successfully.' });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  
  exports.ReadProduct= async (req, res) => {
    try {
      const properties = await Product.find();
      res.status(200).json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  exports.UpdateProduct= async (req, res) => {
    const propertyId = req.params.id;
    const updatedData = req.body;
  
    try {
      const updatedProperty = await Product.findByIdAndUpdate(
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

  exports.DeleteProduct = async(req, res) => {
    const propertyId = req.params.id;
    try {
      const deletedProperty = await Product.findByIdAndDelete(propertyId);
      if(!deletedProperty){
        return res.status(404).json({message:'No property with that id'})
        }
        res.status(200).json({message:"property has been removed"})
        }catch (err) {
          console.log("Couldn't delete the property", err);
          res.status(500).send('Failed to delete property');
          }
  }