const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');



const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://0.0.0.0:27017/Salon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});


//Appointments posting and fetching//
const appointmentSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone:String,
    discount: String,
    date: String,
    fromTiming: String,
    toTiming: String,
    advance: String,
    notes: String,
    selectedServices: [String]
  });
  
  // const Appointment = mongoose.model('Appointment', appointmentSchema);
  
  // app.post('/NewAppointment', async (req, res) => {
  //   const appointmentData = req.body;
  
  //   try {
  //     const newAppointment = new Appointment(appointmentData);
  //     await newAppointment.save();
  //     res.status(200).json({ message: 'Property created successfully.' });
  //   } catch (error) {
  //     console.error('Error creating appointment:', error);
  //     res.status(500).json({ error: 'Internal server error.' });
  //   }
  // });
  
  // app.post('/api/customers/:customerId/appointments', async (req, res) => {
  //   const { customerId } = req.params;
  //   const appointmentData = req.body;
  
  //   try {
  //     const customer = await Customer.findOne({ customerId });
  //     if (!customer) {
  //       return res.status(404).json({ error: 'Customer not found.' });
  //     }
  
  //     // Add the new appointment to the customer's appointments array
  //     customer.appointments.push(appointmentData);
  
  //     // Save the updated customer document
  //     await customer.save();
  
  //     res.status(201).json(appointmentData);
  //   } catch (error) {
  //     console.error('Error saving appointment data:', error);
  //     res.status(500).json({ error: 'Error saving appointment data.' });
  //   }
  // });
  const billingSchema = new mongoose.Schema({
    // Define your schema fields here based on BillingForm data
    billNumber: String,
    date: String,
    customer: String,
    services: [Object], // An array of service objects
    items: [Object], // An array of item objects
    discountPercent: Number,
    discountAmount: Number,
    totalAmount: Number,
  });
  


  const customerSchema = new mongoose.Schema({
  customerId: String,
  name: String,
  dob: String,
  email: String,
  address: String,
  phone: String,
  discount: String,
  appointments: [appointmentSchema],
  billing: [billingSchema], 
});

customerSchema.pre('save', async function (next) {
  try {
    if (!this.customerId) {
      // Find the maximum customerId in the database
      const maxCustomerId = await Customer.findOne({}, { customerId: 1 })
        .sort({ customerId: -1 })
        .exec();

      // Increment the number part of the customerId
      const lastNumber = maxCustomerId ? parseInt(maxCustomerId.customerId?.substring(3)) || 0 : 0;
      const newNumber = lastNumber + 1;

      // Generate the new customerId with SAL prefix and 4 zeros followed by the incremented number
      this.customerId = `SAL${String(newNumber).padStart(4, '0')}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Customer = mongoose.model('Customer', customerSchema);

app.post('/api/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error saving customer data:', error);
    res.status(500).json({ error: 'Error saving customer data' });
  }
});

app.post('/api/customers/:_id/appointments', async (req, res) => {
  const { _id } = req.params; // Use "_id" as the parameter name
  const appointmentData = req.body;

  try {
    const customer = await Customer.findOne({ _id }); // Use "_id" to find the customer
    if (!customer) {
      console.log('Customer not found for _id:', _id);
      return res.status(404).json({ error: 'Customer not found.' });
    }

    // Add the new appointment to the customer's appointments array
    customer.appointments.push(appointmentData);

    // Save the updated customer document
    await customer.save();

    console.log('Appointment data saved successfully:', appointmentData);

    res.status(201).json(appointmentData);
  } catch (error) {
    console.error('Error saving appointment data:', error.message);
    console.log('_id:', _id);
    res.status(500).json({ error: 'Error saving appointment data.' });
  }
});


app.post('/api/customers/:_id/billing', async (req, res) => {
  const { _id } = req.params; // Use "_id" as the parameter name
  const billingData = req.body;

  try {
    const customer = await Customer.findOne({ _id }); // Use "_id" to find the customer
    if (!customer) {
      console.log('Customer not found for _id:', _id);
      return res.status(404).json({ error: 'Customer not found.' });
    }

    // Add the new appointment to the customer's appointments array
    customer.billing.push(billingData);

    // Save the updated customer document
    await customer.save();

    for (const item of billingData.items) {
      const product = await Product.findOne({ itemName: item.itemName });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Subtract the quantity sold from the stock
      product.stock -= item.quantity;

      // Save the updated product document
      await product.save();
    }

    res.status(201).json('Billing data saved successfully for the customer');
  } catch (error) {
    console.error('Error saving billing data:', error.message);
    console.log('_id:', _id);
    res.status(500).json({ error: 'Error saving billing data.' });
  }
});




// app.post('/api/customers/:Id/appointments', async (req, res) => {
//     const { Id } = req.params;
//     const appointmentData = req.body;

//     try {
//         const customer = await Customer.findOne({ Id });
//         if (!customer) {
//             console.log('Customer not found for customerId:', Id);
//             return res.status(404).json({ error: 'Customer not found.' });
//         }

//         // Add the new appointment to the customer's appointments array
//         customer.appointments.push(appointmentData);

//         // Save the updated customer document
//         await customer.save();

//         console.log('Appointment data saved successfully:', appointmentData);

//         res.status(201).json(appointmentData);
//     } catch (error) {
//         console.error('Error saving appointment data:', error.message); // Log MongoDB error message
//         console.log('customerId:', Id); // Log the customerId for debugging
//         res.status(500).json({ error: 'Error saving appointment data.' });
//     }
// });

  
  // app.get('/Appointments', async (req, res) => {
  //     try {
  //       const properties = await Appointment.find();
  //       res.status(200).json(properties);
  //     } catch (error) {
  //       console.error('Error fetching properties:', error);
  //       res.status(500).json({ error: 'Internal server error.' });
  //     }
  //   });
  
    
      // app.delete('/Appointments/:id', async (req, res) => {
      //   const appointmentId = req.params.id;
      
      //   try {
      //     const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
      
      //     if (!deletedAppointment) {
      //       // If the appointment with the given ID was not found
      //       return res.status(404).json({ error: 'Appointment not found' });
      //     }
      
      //     // If the appointment was successfully deleted
      //     res.status(204).send();
      //   } catch (error) {
      //     console.error('Error deleting appointment:', error);
      //     res.status(500).json({ error: 'Internal server error' });
      //   }
      // });


      // app.delete('/api/customers/:customerId/appointments/:appointmentId', async (req, res) => {
      //   const customerId = req.params.customerId;
      //   const appointmentId = req.params.appointmentId;
      //   console.log('Received customerId:', customerId);
      //   console.log('Received appointmentId:', appointmentId);
      //   try {
      //     // Find the customer by ID
      //     const customer = await Customer.findById(customerId);
      
      //     if (!customer) {
      //       // If the customer with the given ID was not found
      //       return res.status(404).json({ error: 'Customer not found' });
      //     }
      
      //     // Find the appointment within the customer's appointments
      //     const appointment = customer.appointments.find((appt) => appt._id === appointmentId);
      
      //     if (!appointment) {
      //       // If the appointment with the given ID was not found within the customer's appointments
      //       return res.status(404).json({ error: 'Appointment not found' });
      //     }
      
      //     // Remove the appointment from the customer's appointments
      //     customer.appointments = customer.appointments.filter((appt) => appt._id !== appointmentId);
      
      //     // Save the updated customer data
      //     await customer.save();
      
      //     // If the appointment was successfully deleted
      //     res.status(204).send();
      //   } catch (error) {
      //     console.error('Error deleting appointment:', error);
      //     res.status(500).json({ error: 'Internal server error' });
      //   }
      // });
      

    //   app.put('/api/customers/:customerId/appointments/:appointmentId', async (req, res) => {
    //     const customerId = req.params.customerId;
    //     const appointmentId = req.params.appointmentId;

    //    console.log('_id in updatedAppointmentData:', appointmentId);
    // console.log('_id in customer Id:', customerId);
    //     try {
    //       // Find the customer by ID
    //       const customer = await Customer.findById(customerId);
      
    //       if (!customer) {
    //         // If the customer with the given ID was not found
    //         return res.status(404).json({ error: 'Customer not found' });
    //       }
      
    //       // Find the appointment within the customer's appointments
    //       const appointmentIndex = customer.appointments.findIndex(
    //         (appt) => appt._id.toString() === appointmentId
    //       );
      
    //       if (appointmentIndex === -1) {
    //         // If the appointment with the given ID was not found within the customer's appointments
    //         return res.status(404).json({ error: 'Appointment not found' });
    //       }
      
    //       console.log('Appointment:', customer.appointments[appointmentIndex]);
    //       // Update the appointment data with the request body data
    //        const updatedAppointmentData = req.body;
      
    //        if (!mongoose.Types.ObjectId.isValid(updatedAppointmentData._id)) {
    //         return res.status(400).json({ error: 'Invalid _id in updatedAppointmentData' });
    //     }
          
    //       // Assign the updated data to the appointment
    //       customer.appointments[appointmentIndex] = updatedAppointmentData;
      
    //       // Save the updated customer data
    //       await customer.save();
      
    //       // If the appointment was successfully updated
    //       res.status(200).json(updatedAppointmentData);
    //     } catch (error) {
    //       console.error('Error updating appointment:', error);
    //       res.status(500).json({ error: 'Internal server error' });
    //     }
    //   });
      

      app.delete('/api/customers/:customerId/appointments/:appointmentId', async (req, res) => {
        const customerId = req.params.customerId;
        const appointmentId = req.params.appointmentId;
      
        try {
          // Find the customer by ID
          const customer = await Customer.findById(customerId);
      
          if (!customer) {
            // If the customer with the given ID was not found
            return res.status(404).json({ error: 'Customer not found' });
          }
      
          // Find the appointment within the customer's appointments
          const appointmentIndex = customer.appointments.findIndex((appt) => appt._id.toString() === appointmentId);
      
          if (appointmentIndex === -1) {
            // If the appointment with the given ID was not found within the customer's appointments
            return res.status(404).json({ error: 'Appointment not found' });
          }
      
          // Remove the appointment from the customer's appointments array
          customer.appointments.splice(appointmentIndex, 1);
      
          // Save the updated customer data
          await customer.save();
      
          // If the appointment was successfully deleted
          res.status(204).send();
        } catch (error) {
          console.error('Error deleting appointment:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      
    app.put('/Appointments/:id', async (req, res) => {
      const propertyId = req.params.id;
      const updatedData = req.body;
    
      try {

        console.log('propertyId:', propertyId);
          console.log('updatedData:', updatedData);

        const updatedProperty = await Customer.findByIdAndUpdate(
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
    });


    app.put('/api/Customer/Billing/:id', async (req, res) => {
      const propertyId = req.params.id;
      const updatedData = req.body;
    
      try {

        console.log('propertyId:', propertyId);
          console.log('updatedData:', updatedData);

        const updatedProperty = await Customer.findByIdAndUpdate(
          propertyId,
          updatedData,
          { new: true }
        );
    
        if (!updatedProperty) {
          return res.status(404).json({ error: 'Customer not found.' });
        }
    
        res.status(200).json({ message: 'Customer updated successfully.' });
      } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    });








//Inventory Task//
//product posting and fetching//

const productSchema = new mongoose.Schema({
       itemName: String,
        manufacturer: String,
        price: Number,
        stock: Number,


});

const Product = mongoose.model('Product', productSchema);

app.post('/AddProduct', async (req, res) => {
  const productData = req.body;

  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(200).json({ message: 'Property created successfully.' });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.get('/ProductList', async (req, res) => {
  try {
    const properties = await Product.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.put('/Mc/:id', async (req, res) => {
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
});

const purchaseProductSchema = new mongoose.Schema({
  purchaseDate: String,
  billNumber: String,
  supplier: String,
  purchaseType: String,
  NoOfProducts: String,
  
  tableData: [{
    product: String,
    quantity: String,
    cp: String
  }]
    


});

const PurchaseProduct = mongoose.model('PurchaseProduct', purchaseProductSchema);

// app.post('/PurchaseProduct', async (req, res) => {
// const productData = req.body;


//   console.log('Received data:', productData);
// try {
// const newPurchaseProduct = new PurchaseProduct(productData);
// await newPurchaseProduct.save();
// res.status(200).json({ message: 'Property created successfully.' });
// } catch (error) {
// console.error('Error creating appointment:', error);
// res.status(500).json({ error: 'Internal server error.' });
// }
// });


app.post('/PurchaseProduct', async (req, res) => {
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
});


app.get('/PurchaseProductList', async (req, res) => {
  try {
    const properties = await PurchaseProduct.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



const supplierSchema = new mongoose.Schema({
  supplier: String,
  contact: String,
   address: String,
   


});

const Supplier = mongoose.model('Supplier', supplierSchema);

app.post('/AddSupplier', async (req, res) => {
const supplierData = req.body;

try {
const newProduct = new Supplier(supplierData);
await newProduct.save();
res.status(200).json({ message: 'Property created successfully.' });
} catch (error) {
console.error('Error creating appointment:', error);
res.status(500).json({ error: 'Internal server error.' });
}
});


app.get('/SuppliersList', async (req, res) => {
try {
const properties = await Supplier.find();
res.status(200).json(properties);
} catch (error) {
console.error('Error fetching properties:', error);
res.status(500).json({ error: 'Internal server error.' });
}
});


app.put('/Sp/:id', async (req, res) => {
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
});

const registerSchema = new mongoose.Schema({
  username :{
      type : String,
      required : true,
  },
  email :{
      type : String,
      required : true,
      unique : true,
  },
  password :{
      type : String,
      required:true,
  },
  confirmpassword : {
      type : String,
      required : true,
  }
})

const Register = mongoose.model('Register', registerSchema);

app.post('/register',async (req, res) =>{
  try{
      const {username,email,password,confirmpassword} = req.body;
      let exist = await Register.findOne({email})
      if(exist){
          return res.status(400).send('User Already Exist')
      }
      if(password !== confirmpassword){
          return res.status(400).send('Passwords are not matching');
      }
      let newUser = new Register({
          username,
          email,
          password,
          confirmpassword
      })
      await newUser.save();
      res.status(200).send('Registered Successfully')

  }
  catch(err){
      console.log(err)
      return res.status(500).send('Internel Server Error')
  }
})


app.post('/login',async (req, res) => {
  try{
      const {email,password} = req.body;
      let exist = await Register.findOne({email});
      if(!exist) {
        return res.status(400).json({ error: 'User Not Found' });

      }
      if(exist.password !== password) {
        return res.status(400).json({ error: 'Invalid Credentials' });

      }
      let payload = {
          user:{
              id : exist.id
          }
      }
      jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
        (err,token) =>{
            if (err) throw err;
            return res.json({token})
        }  
          )

  }
  catch(err){
      console.log(err);
      return res.status(500).send('Server Error')
  }
})






//Services posting ,fetching,editing and deleting //

const Service = mongoose.model('Service', {
  serviceName: String,
  category: String,
  price: Number,  
  durationTime: String,
});


// Create a new service
app.post('/api/services', async (req, res) => {
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
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch services.' });
  }
});

// Update a service
app.put('/api/services/:id', async (req, res) => {
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
});

// Delete a service
app.delete('/api/services/:id', async (req, res) => {
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
});

//Billing Posting ,Fetching,Editing and Deleting//

// const customerSchema = new mongoose.Schema({
//   customerId: String,
//   name: String,
//   dob: String,
//   email: String,
//   address: String,
//   phone: String,
//   discount: String,
//   appointments: [appointmentSchema]
// });

// customerSchema.pre('save', async function (next) {
//   try {
//     if (!this.customerId) {
//       // Find the maximum customerId in the database
//       const maxCustomerId = await Customer.findOne({}, { customerId: 1 })
//         .sort({ customerId: -1 })
//         .exec();

//       // Increment the number part of the customerId
//       const lastNumber = maxCustomerId ? parseInt(maxCustomerId.customerId?.substring(3)) || 0 : 0;
//       const newNumber = lastNumber + 1;

//       // Generate the new customerId with SAL prefix and 4 zeros followed by the incremented number
//       this.customerId = `SAL${String(newNumber).padStart(4, '0')}`;
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// const Customer = mongoose.model('Customer', customerSchema);

// app.post('/api/customers', async (req, res) => {
//   try {
//     const newCustomer = new Customer(req.body);
//     await newCustomer.save();
//     res.status(201).json(newCustomer);
//   } catch (error) {
//     console.error('Error saving customer data:', error);
//     res.status(500).json({ error: 'Error saving customer data' });
//   }
// });



// API endpoint to get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

// Define a pre-save middleware to generate the custom ID





app.put('/api/customers/:email', async(req,res)=>{
  const {email} = req.params;
  const updatedCustomerData = req.body;

  try{
    const updatedCustomer = await Customer.findOneAndUpdate(
      {email},
      updatedCustomerData,
      {new: true}
    );
    if(!updatedCustomer){
      return res.status(404).json({error: 'Customer not found'});
    }
    res.status(200).json({message:'customer updated successfully',customer: updatedCustomer});
  }catch (error){
    console.log("error",error);
   res.status(500).json({error: 'An error occured while updating the customer'}) 
  }
})

// Start the server


// const serviceSchema = new mongoose.Schema({
//   serviceName: String,
//   price: Number,
// });

// const Service = mongoose.model('Service', serviceSchema);
// // API endpoint to get all services
// app.get('/api/services', async (req, res) => {
//   try {
//     const services = await Service.find();
//     res.json(services);
//   } catch (error) {
//     console.error('Error fetching services:', error);
//     res.status(500).json({ error: 'Error fetching services' });
//   }
// });


// Define an Item Schema and Model
const itemSchema = new mongoose.Schema({
  itemName: String,
  price: Number,
});

const Item = mongoose.model('Item', itemSchema);
// API endpoint to get all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// API endpoint to create a new item
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error saving item data:', error);
    res.status(500).json({ error: 'Error saving item data' });
  }
});

// Define an Employee Schema and Model


app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

// const billingSchema = new mongoose.Schema({
//   // Define your schema fields here based on BillingForm data
//   billNumber: String,
//   date: String,
//   customer: String,
//   services: [Object], // An array of service objects
//   items: [Object], // An array of item objects
//   discountPercent: Number,
//   discountAmount: Number,
//   totalAmount: Number,
// });

const Billing = mongoose.model('Billing', billingSchema);

// Create a route to handle the POST request for saving BillingForm data
// app.post('/api/billing', (req, res) => {
//   const billingData = req.body;

//   const newBilling = new Billing(billingData);

//   newBilling
//     .save()
//     .then(() => {
//       res.status(201).json('Billing data saved successfully');
//     })
//     .catch((error) => {
//       res.status(500).json(`Error saving billing data: ${error}`);
//     });
// });


app.post('/api/billing', async (req, res) => {
  const billingData = req.body;

  try {
    const newBilling = new Billing(billingData);

    // Update stock quantity in Product collection for each item sold
    for (const item of newBilling.items) {
      const product = await Product.findOne({ itemName: item.itemName });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Subtract the quantity sold from the stock
      product.stock -= item.quantity;

      // Save the updated product document
      await product.save();
    }

    await newBilling.save();
    res.status(201).json('Billing data saved successfully');
  } catch (error) {
    console.error('Error saving billing data:', error);
    res.status(500).json(`Error saving billing data: ${error}`);
  }
});



app.get('/api/billing', async (req, res) => {
  try {
    const billing = await Billing.find();
    res.json(billing);
  } catch (error) {
    console.error('Error fetching billing:', error);
    res.status(500).json({ error: 'Error fetching billing' });
  }
});
const lastbillingSchema = new mongoose.Schema({
  billNumber: String,
  // other billing fields
});

const LastBilling = mongoose.model('LastBilling', billingSchema);

// Endpoint to get the last bill number
app.get('/api/billing/lastBillNumber', async (req, res) => {
  try {
    // Find the last bill number by sorting in descending order and taking the first one
    const lastBill = await LastBilling.findOne().sort({ billNumber: -1 }).exec();

    if (lastBill) {
      res.status(200).json({ billNumber: lastBill.billNumber });
    } else {
      // If no bills are found, you can return a default starting bill number
      res.status(200).json({ billNumber: 'BILL NO-001' });
    }
  } catch (error) {
    console.error('Error fetching last bill number:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// app.post('/stock-selfuse', async (req, res) => {
//   const stockSelfData = req.body;

//   console.log('Received data from frontend:', stockSelfData);

//   try {
//     // Create a new SelfUseStock document with the received data
//     const newSelfUseStock = new SelfUseStock({ items: stockSelfData });

//     // Save the new document to the database
//     await newSelfUseStock.save();

//     console.log('Data saved successfully');
//     res.status(201).json('Stock-selfuse data saved successfully');
//   } catch (error) {
//     console.error('Error saving stock-selfuse data:', error);
//     res.status(500).json(`Error saving stock-selfuse data: ${error}`);
//   }
// });



const selfUseStockSchema = new mongoose.Schema({
  items: [
    {
      product: String,
      quantity: String,
    },
  ],
});

const SelfUseStock = mongoose.model('SelfUseStock', selfUseStockSchema);

app.post('/stock-selfuse', async (req, res) => {
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
});


// Define a schema and model for the employee data
// let lastAssignedId=0;
// const employeeSchema = new mongoose.Schema({
//   employeeId: {
//     type: String,
//     default: () => {
//       return generateEmployeeId(); // Define your logic for generating employeeId here
//     },
//     required: true,
//   },
//   employeeName: String,
//   username: String,
//   password: String,
//   phoneNumber: String,
//   email: String,
//   address: String,
// });

// const Employee = mongoose.model('Employee', employeeSchema);

// // Create a new employee
// // app.post('/api/employees', async (req, res) => {
// //   try {
// //     const employee = new Employee(req.body);
// //     await employee.save();
// //     res.status(201).json(employee);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'An error occurred while creating the employee.' });
// //   }
// // });




// app.post('/api/employees', async (req, res) => {
//   try {
//     lastAssignedId++;
    
//     // Convert lastAssignedId to string before using padStart
//     const formattedEmployeeNumber = lastAssignedId.toString().padStart(4, '0');

//     const employeeData = {
//       employeeId: `EMP${formattedEmployeeNumber}`,
//       employeeName: req.body.employeeName,
//       username: req.body.username,
//       password: req.body.password,
//       phoneNumber: req.body.phoneNumber,
//       email: req.body.email,
//       address: req.body.address,
//     };

//     const employee = new Employee(employeeData);
//     await employee.save();
//     res.status(201).json(employee);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'An error occurred while creating the employee.' });
//   }
// });

const employeeSchema = new mongoose.Schema({
  employeeId: String, // Remove the default function
  employeeName: String,
  username: String,
  password: String,
  phoneNumber: String,
  email: String,
  address: String,
});
const Employee = mongoose.model('Employee', employeeSchema);

const EmployeeIDCounter = mongoose.model('EmployeeIDCounter', new mongoose.Schema({
  lastAssignedId: Number,
}));

// ... other Mongoose model and route setup

// Modify your /api/employees POST route
app.post('/api/employees', async (req, res) => {
  try {
    // Find and update the counter atomically
    const counter = await EmployeeIDCounter.findOneAndUpdate({}, { $inc: { lastAssignedId: 1 } }, { upsert: true, new: true });
    
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
    };

    const employee = new Employee(employeeData);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the employee.' });
  }
});


// Fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching employees.' });
  }
});

// Update an employee
app.put('/api/employees/:id', async (req, res) => {
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
  });
  
 // Delete an employee
 app.delete('/api/employees/:id', async (req, res) => {
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
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});












