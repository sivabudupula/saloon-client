const Employee = require('../models/EmployeeModel');
const EmployeeIDCounter = require('../models/EmployeeIdModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


exports.CreateEmployee = [
  upload.single('file'), // 'file' should match the name attribute in your form input

  async (req, res) => {
    try {
      // Find and update the counter atomically
      const counter = await EmployeeIDCounter.findOneAndUpdate({}, { $inc: { lastAssignedId: 1 } }, { upsert: true, new: true });

      const fileData = req.file ? await fs.readFile(req.file.path) : null;

      // Generate the formatted employee number
      const formattedEmployeeNumber = counter.lastAssignedId.toString().padStart(3, '0');

      const employeeData = {
        employeeId: `EMP${formattedEmployeeNumber}`,
        employeeName: req.body.employeeName,
        username: req.body.username,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address,
        dob: req.body.dob,
        age: Number.isNaN(Number(req.body.age)) ? null : Number(req.body.age), // Ensure age is a valid number
        aadharNo: req.body.aadharNo,
        panNumber: req.body.panNumber,
        filePath: req.file ? req.file.path : null,
        fileData: fileData,
      };

      const employee = new Employee(employeeData);
      await employee.validate(); // Validate the document before saving
      await employee.save();
      res.status(201).json(employee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while creating the employee.' });
    }
  },
];

  
  
  // Fetch all employees
  exports.ReadEmployee= async (req, res) => {
    try {
      const employees = await Employee.find();
      res.json(employees);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching employees.' });
    }
  };
  
  // Update an employee
  exports.UpdateEmployee= async (req, res) => {
      const { id } = req.params;
      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedEmployee) {
          return res.status(404).json({ error: 'Employee not found.' });
        }
        res.json(updatedEmployee);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the employee.' });
      }
    };
    
   // Delete an employee
   exports.DeleteEmployee= async (req, res) => {
    const { id } = req.params;
    try {
      const deletedEmployee = await Employee.findByIdAndRemove(id);
      if (!deletedEmployee) {
        return res.status(404).json({ error: 'Employee not found.' });
      }
      res.json({ message: 'Employee deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the employee.' });
    }
  };
  
  