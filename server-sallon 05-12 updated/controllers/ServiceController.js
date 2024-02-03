const Service = require('../models/ServiceModel');

exports.CreateService= async (req, res) => {
    try {
      const { serviceName, category, price, durationTime } = req.body;
      const newService = new Service({
        serviceName,
        category,
        price,
        durationTime,
      });
      await newService.save();
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create service.' });
    }
  };
  
  // Get all services
  exports.ReadService= async (req, res) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch services.' });
    }
  };
  
  // Update a service
  exports.UpdateService= async (req, res) => {
    try {
      const { id } = req.params;
      const { serviceName, category, price, durationTime } = req.body;
  
      const updatedService = await Service.findByIdAndUpdate(
        id,
        { serviceName, category, price, durationTime },
        { new: true }
      );
  
      if (!updatedService) {
        return res.status(404).json({ error: 'Service not found.' });
      }
  
      res.json(updatedService);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update service.' });
    }
  };
  
  // Delete a service
  exports.DeleteService= async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedService = await Service.findByIdAndRemove(id);
  
      if (!deletedService) {
        return res.status(404).json({ error: 'Service not found.' });
      }
  
      res.json(deletedService);
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete service.' });
    }
  };
  