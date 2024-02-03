const Supplier = require('../models/SupplierModel');

exports.CreateSupplier= async (req, res) => {
    const supplierData = req.body;
    
    try {
    const newProduct = new Supplier(supplierData);
    await newProduct.save();
    res.status(200).json({ message: 'Property created successfully.' });
    } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error.' });
    }
    };
    
    
    exports.ReadSupplier= async (req, res) => {
    try {
    const properties = await Supplier.find();
    res.status(200).json(properties);
    } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error.' });
    }
    };
    
    
    exports.UpdateSupplier= async (req, res) => {
      const propertyId = req.params.id;
      const updatedData = req.body;
    
      try {
        const updatedProperty = await Supplier.findByIdAndUpdate(
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
    
    exports.DeleteSupplier = async (req, res) => {
      const supplierId = req.params.id;
    
      try {
        const deletedSupplier = await Supplier.findByIdAndRemove(supplierId);
        if (!deletedSupplier) {
          return res.status(404).json({ error: 'Supplier not found.' });
        }
        res.status(200).json({ message: 'Supplier deleted successfully.' });
      } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    };