const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const CustomerController = require('../controllers/CustomerController');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the folder where uploaded files will be stored
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Generate a unique filename
    },
  });
  
  const upload = multer({ storage });
  
// Define routes for appointments
router.post('/customers',upload.single('profilePhoto'), CustomerController.CreateCustomer);
router.put('/customers/:id', CustomerController.UpdateCustomer);
router.get('/customers', CustomerController.ReadCustomer);


module.exports = router;
