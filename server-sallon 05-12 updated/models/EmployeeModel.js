const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: String, // Remove the default function
    employeeName: String,
    username: String,
    password: String,
    phoneNumber: String,
    email: String,
    address: String,
    dob:String,
    age:Number,
    aadharNo: String,
    panNumber: String,
    filePath: String,
    fileData: Buffer,
  });

  module.exports  = mongoose.model('Employee', employeeSchema);
  
  