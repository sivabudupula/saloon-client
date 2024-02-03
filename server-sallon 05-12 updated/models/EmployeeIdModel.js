const mongoose = require('mongoose');

const EmployeeIDCounter = mongoose.model('EmployeeIDCounter', new mongoose.Schema({
    lastAssignedId: Number,
  }));

   module.exports = EmployeeIDCounter;