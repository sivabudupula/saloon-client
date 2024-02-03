
import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Billing.css';
import axios from 'axios';
import { BASE_URL } from '../Helper/helper';






const EditBill = ({ data, index,onSave, onCancel }) => {

  // const [editedData, setEditedData] = useState(data.billing && data.billing.length > 0
  //   ? { ...data.billing[index] }
  //   : { /* Provide a default value if necessary */ });
  const [editedData, setEditedData] = useState({
    billNumber:data.billing && data.billing.length > 0 ? data.billing[index].billNumber : '',
    date: data.billing && data.billing.length > 0 ? data.billing[index].date : '',
    customer: data.billing && data.billing.length > 0 ? data.billing[index].customer : '',
    services: data.billing && data.billing.length > 0 ? [...data.billing[index].services] : [],
    items: data.billing && data.billing.length > 0 ? [...data.billing[index].items] : [],
    discountPercent: data.billing && data.billing.length > 0 ? data.billing[index].discountPercent : 0,
    discountAmount: data.billing && data.billing.length > 0 ? data.billing[index].discountAmount : 0,
    gstPercent: data.billing && data.billing.length > 0 ? data.billing[index].gstPercent : 0,
    totalAmount: data.billing && data.billing.length > 0 ? data.billing[index].totalAmount : 0,
    // Other properties of editedData
  });
  




  const [billNumber, ] = useState(editedData.billNumber);
  const [date, setDate] = useState(editedData.date);
  const [customer, setCustomer] = useState(editedData.customer);
//  const [services, setServices] = useState([]);
  
  // const [items, setItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(editedData.discountPercent);
  const [discountAmount, setDiscountAmount] = useState(editedData.discountAmount);
  const [gstPercent, setGstPercent] = useState(editedData.gstPercent || 0);
  
  const [availableServices, setAvailableServices] = useState([]);
  // const [deletedServices, setDeletedServices] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [showEmployeeField, setShowEmployeeField] = useState(true);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [totalAmount, setTotalAmount] = useState(editedData.totalAmount);
  
  

  

  const [customerData, setCustomerData] = useState(data);
  

  // const [editedData, setEditedData] = useState(data.billing && data.billing.length > 0
  //   ? { ...data.billing[index] }
  //   : { /* Provide a default value if necessary */ });
  

    const [services, setServices] = useState(data.billing && data.billing.length > 0
      ? [...data.billing[index].services]
      : [/* Provide a default empty service object here */]);
  
      const [items, setItems] = useState(data.billing && data.billing.length > 0
        ? [...data.billing[index].items]
        : [/* Provide a default empty service object here */]);
    

  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/services`); // Replace with your backend API endpoint
      if (response.status === 200) {
        setAvailableServices(response.data);
      } else {
        // Handle error here
        console.error('Error fetching services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  
  // const handleDeleteService = (id) => {
  //   const updatedServices = services.filter((service) => service.id !== id);
  //   setServices(updatedServices);
  //   setDeletedServices([...deletedServices, id]);
  // };
  const handleDeleteService = (id) => {
    const updatedServices = [...services];
    const indexToDelete = updatedServices.findIndex((service) => service.id === id);
  
    if (indexToDelete !== -1) {
      updatedServices.splice(indexToDelete, 1); // Remove the service at the found index
      setServices(updatedServices);
    }
  };
 
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), itemName: '', price: 0, quantity: 1 }]);
  };
  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };
  

  useEffect(() => {
    fetchItems();
  }, []);
  
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products`); // Replace with your backend API endpoint
      if (response.status === 200) {
        setAvailableItems(response.data);
      } else {
        // Handle error here
        console.error('Error fetching items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  const handleAddService = () => {
    setServices([...services, { serviceName: '', price: 0, employee: '' }]);
    setShowEmployeeField(true); // Show the employee field when adding a service
  };
  useEffect(() => {
    fetchAvailableEmployees();
  }, []);

  const fetchAvailableEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employees`); // Replace with your backend API endpoint
      if (response.status === 200) {
        const employees = response.data;
        setAvailableEmployees(employees);
      } else {
        // Handle error here
        console.error('Error fetching employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  
  const calculateTotalAmount = useCallback(() => {
    const serviceTotal = services.reduce((total, service) => {
      return total + service.price;
    }, 0);

    const itemTotal = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const subtotal = serviceTotal + itemTotal;
    const discount = (subtotal * discountPercent) / 100 + parseFloat(discountAmount);

    const totalBeforeGST = subtotal - discount;
    const gstAmount = (totalBeforeGST * gstPercent) / 100;
    const totalAmount = totalBeforeGST + gstAmount;

    return totalAmount;
  },[services, items, discountPercent, discountAmount,gstPercent]);

  // Example: Updating total amount when services change
// useEffect(() => {
//   const newTotalAmount = calculateTotalAmount();
//   setTotalAmount(newTotalAmount);
//   setEditedData({
//     ...editedData,
//     totalAmount: newTotalAmount,
//   });
// }, [services, discountPercent, discountAmount]);


useEffect(() => {
  const newTotalAmount = calculateTotalAmount();
  setTotalAmount(newTotalAmount);
  setEditedData(prevEditedData => ({
    ...prevEditedData,
    totalAmount: newTotalAmount,
  }));
}, [services, discountPercent, discountAmount, calculateTotalAmount, setEditedData]);


// Example: Updating total amount when items change
useEffect(() => {
  const newTotalAmount = calculateTotalAmount();
  setTotalAmount(newTotalAmount);
  setEditedData({
    ...editedData,
    totalAmount: newTotalAmount,
  });
}, [items, discountPercent, discountAmount,calculateTotalAmount,editedData]);

useEffect(() => {
  setEditedData((prevEditedData) => ({
    ...prevEditedData,
    totalAmount: calculateTotalAmount(),
  }));
}, [items, discountPercent, discountAmount, calculateTotalAmount, setEditedData]);





const handleSave = () => {
  const updatedBills = [...customerData.billing,customerData.billing[index]=editedData]; // Make a copy of existing appointments
  updatedBills[index] = editedData; // Update the specific appointment

  // Update the customerData state with the updated appointments
  setCustomerData({
    ...customerData,
    billing: updatedBills,
  });

  onSave(customerData); // Optionally, you can pass the updated customerData to onSave
};
















  return (
    <div className="billing-form-sk142s">
      <p className='heading678'>Edit Bill</p>
      <div className='small-container678'>
      <div className='bnsk142s'>
        <div className="form-groupsk142s">
          <div className='lable-width567'>
      <label className='bill-no123'>Bill Number :</label>
      </div>
        <input className='bnsk142sinput89' type="text" value={billNumber} readOnly />
      </div>
      <div className="form-groupsk142s">
        <label className='bill-no123'>Date:</label>
        <input  className='date1234'
         type="date" 
         value={date} 
         onChange={(e) => {
          const newDate = e.target.value;
          setEditedData({
            ...editedData,
            date: newDate,
          });
          setDate(newDate);
        }}

        //  onChange={(e) => setDate(e.target.value)}
         />
      </div>
      </div>



      <div className="form-groupsk142s">
      <div className='lable-width567'>
        <label  className='bill-no123'>Customer :</label>
        </div> 
       
        <input
  className='bnsk142sinput89'
  value={customer}
  onChange={(e) => {
    const newCustomer = e.target.value;
    setEditedData({
      ...editedData,
      customer: newCustomer,
    });
    setCustomer(newCustomer);
  }}
  // onChange={(e) => setCustomer(e.target.value)}
>
  
</input>

        
      </div> 







      <div className="servicesk142s">
      <div className='lable-width567'>    
  <label  className='bill-no123'>Services :</label>
  </div>
  <div  className='columns456'>  
    {services.map((service, index) => (
    <div key={index} className="service-row">
      <select className='changesize567'
        value={service.serviceName}
        onChange={(e) => {
          const selectedServiceName = e.target.value;
          const updatedServices = [...services];
          const selectedService = availableServices.find(
            (availableService) => availableService.serviceName === selectedServiceName
          );

          if (selectedService) {
            // Set the selected service's name and price
            updatedServices[index] = {
              ...updatedServices[index],
              serviceName: selectedServiceName,
              price: selectedService.price,
            };
          } else {
            // If the selected service is not found, reset the price to 0
            updatedServices[index] = {
              ...updatedServices[index],
              serviceName: selectedServiceName,
              price: 0,
            };
          }

          setServices(updatedServices);
          setEditedData({
            ...editedData,
            services: updatedServices,
          });
        }}
      >
        <option  className='optionselect7899' value="">Select a service</option>
        {availableServices.map((availableService) => (
          <option
          className='optionselect7899'
            key={availableService._id}
            value={availableService.serviceName}
          >
            {availableService.serviceName}&nbsp;&nbsp;({availableService.category})
          </option>
        ))}
      </select>
      <input
      className='input-change789'
        type="number"
        placeholder="Price"
        value={service.price}
        onChange={(e) => {
          const updatedServices = [...services];
          updatedServices[index] = {
            ...updatedServices[index],
            price: parseFloat(e.target.value),
          };
          setServices(updatedServices);
          setEditedData({
            ...editedData,
            services: updatedServices,
          });
        }}
      />
        {showEmployeeField && (
              <select
              className='optionselect789'
                value={service.employee}
                onChange={(e) => {
                  const selectedEmployee = e.target.value;
                  const updatedServices = [...services];
                  updatedServices[index] = {
                    ...updatedServices[index],
                    employee: selectedEmployee,
                  };
                  setServices(updatedServices);
                  setEditedData({
                    ...editedData,
                    services: updatedServices,
                  });
                }}
              >
                <option value="">Select an employee</option>
                {availableEmployees.map((employee) => (
                  <option key={employee._id} value={employee.employeeName}>
                    {employee.employeeName}
                  </option>
                ))}
              </select>
            )}
      <button
        className="delete-buttonsk142s"
        onClick={() => handleDeleteService(service.id)}
      >
        Delete
      </button>
    </div>
  ))}
  <button className='addnewsk142s' onClick={handleAddService}><span className='plusk142s'>+</span>Add Service</button>
</div>
</div>

<div className="itemsk142s">
<div className='lable-width567'> 
  <label className='bill-no123' >Items :</label>
  </div>
  <div className='columns456'>
  {items.map((item, index) => (
    
    <div key={item.id} className="item-row-select67">
      <select className='options678'
        value={item.itemName}
        onChange={(e) => {
          const selectedItemName = e.target.value;
          const updatedItems = [...items];
          const selectedItem = availableItems.find((availableItem) => availableItem.itemName === selectedItemName);

          if (selectedItem) {
            // Set the selected item's name and price
            updatedItems[index] = {
              ...updatedItems[index],
              itemName: selectedItemName,
              price: selectedItem.price,
            };
          } else {
            // If the selected item is not found, reset the price to 0
            updatedItems[index] = {
              ...updatedItems[index],
              itemName: selectedItemName,
              price: 0,
            };
          }

          setItems(updatedItems);
          setEditedData({
            ...editedData,
            items: updatedItems,
          });
        }}
      >
        <option value="">Select an item</option>
        {availableItems.map((availableItem) => (
          <option key={availableItem.id} value={availableItem.itemName}>
            {availableItem.itemName} 
          </option>
        ))}
      </select>
      
      <input
      className='input-change789'
        type="number"
        placeholder="Price"
        value={item.price}
        onChange={(e) => {
          const updatedItems = [...items];
          updatedItems[index] = {
            ...updatedItems[index],
            price: parseFloat(e.target.value),
          };
          setItems(updatedItems); setEditedData({
            ...editedData,
            items: updatedItems,
          });

        }}
      />
      <input
      className='input-change789'
        type="number"
        placeholder="Quantity"
        value={item.quantity}
        onChange={(e) => {
          const updatedItems = [...items];
          updatedItems[index] = {
            ...updatedItems[index],
            quantity: parseInt(e.target.value),
          };
          setItems(updatedItems);
          setEditedData({
            ...editedData,
            items: updatedItems,
          });
        }}
      />
      <input
      className='input-change789'
        type="number"
        placeholder="Total Price"
        value={(item.price * item.quantity).toFixed(2)}
        readOnly
      />
      <button
        className="delete-buttonsk1445"
        onClick={() => handleDeleteItem(item.id)}
      >
        Delete
      </button>
    </div>
   
  ))}
  <button className='addnewsk142s' onClick={handleAddItem}><span className='plusk142s'>+</span>Add Item</button>
   </div>
   </div>
  


      <div className="form-group-label234">
      <div className='lable-width567'> 
        <label  className='bill-no123'>Discount (%)</label>
        </div>
        <input
        className='totalbillsk142s'
          type="number"
          value={discountPercent}
          // onChange={(e) => setDiscountPercent(e.target.value)}
          onChange={(e) => {
            const newDiscountPercent = e.target.value;
            setDiscountPercent(newDiscountPercent);
            setEditedData({
              ...editedData,
              discountPercent: newDiscountPercent,
            });
          }}
        />
      </div>
      <div className="form-group-label234">
      <div className='lable-width567'> 
        <label  className='bill-no123'>Discount (RS)</label>
        </div>
        <input
        className='dis-sk142s'
          type="number" 
          value={discountAmount}
          // onChange={(e) => setDiscountAmount(e.target.value)}
          onChange={(e) => {
            const newDiscountAmount = e.target.value;
            setDiscountAmount(newDiscountAmount);
            setEditedData({
              ...editedData,
              discountAmount: newDiscountAmount,
            });
          }}
        />
      </div>
      <div className="form-group-label234">
        <div className='lable-width567'> 
          <label className='bill-no123'>GST (%)</label>
        </div>
        <input
          className='totalbillsk142s'
          type="number"
          value={gstPercent}
          onChange={(e) => {
            const newGstPercent =e.target.value;
            setGstPercent(newGstPercent);
            setEditedData({
              ...editedData,
              gstPercent: newGstPercent,
            });

          }}
        
        />
      </div>



      <div className="form-group-label234">
      <div className='lable-width567'> 
  <label  className='bill-no123'>Total Amount:</label>
  </div>
  {/* <input className='totalbillsk142s' type="text" value={totalAmount.toFixed(2)} readOnly /> */}
  <input className='totalbillsk142s' type="text" value={totalAmount ? totalAmount.toFixed(2) : ''} readOnly />

</div>
<div className='save-btn456'>
      <button className='addnewsk1445' type="submit" onClick={handleSave}>Save</button>
      <button className='cancelnewsk1445' onClick={onCancel}>Cancel</button>
      </div>


    

      
    </div>
    </div>
  );
};

export default EditBill;





