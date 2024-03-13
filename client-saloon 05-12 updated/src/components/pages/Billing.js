import React, { useState, useEffect, useCallback } from "react";
import "../styles/Billing.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BillingForm = () => {
  const [billNumber, setBillNumber] = useState(0);
  const [date, setDate] = useState(getCurrentDate());

  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [customerNames, setCustomerNames] = useState([]);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  // const [deletedServices, setDeletedServices] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [showEmployeeField, setShowEmployeeField] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [/*customers*/, setCustomers] = useState([]);
  const [gstNumber, setGstNumber] = useState("");
  // const [billingData, setBillingData] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCustomerSaloonId, setSelectedCustomerSaloonId] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  // const [couponCode,] = useState('');
  const [couponDiscount] = useState(0);
  const [serviceIdCounter, setServiceIdCounter] = useState(1);
  const [/*selectedMobileNumber*/, setSelectedMobileNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [isSaved, setIsSaved] = useState(false);
  const [gstPercent, setGstPercent] = useState(0);
  const [token] = useState(localStorage.getItem('token'));
  const userRole = localStorage.getItem("userRole");

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    dob: "",
    email: "",
    address: "",
    phone: "",
    discount: "",
  });

  useEffect(() => {
    fetchCustomerNames();
  }, []);

  const fetchCustomerNames = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/customers`);
      if (response.status === 200) {
        const customer = response.data;
        setCustomers(customer);
        setCustomerNames(customer);
      } else {
        // Handle error here
        console.error("Error fetching customer names");
      }
    } catch (error) {
      console.error("Error fetching customer names:", error);
    }
  };

  const handleCustomerFormOpen = () => {
    setIsCustomerFormOpen(true);
  };

  const handleCustomerFormClose = () => {
    setIsCustomerFormOpen(false);
  };

  const handleGstNumberChange = (e) => {
    setGstNumber(e.target.value);
  };

  const handleSaveCustomer = async () => {
    try {
      // Make a POST request to save the new customer data
      const response = await axios.post(
        `${BASE_URL}/api/customers`,
        newCustomer
      ); // Replace with your backend API endpoint
      if (response.status === 201) {
        // Customer data saved successfully, update the customer names
        fetchCustomerNames();
        handleCustomerFormClose();
        toast.success("Saved successfully!", {
          position: "top-right",
          autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Handle error here
        console.error("Error saving customer data");
      }
    } catch (error) {
      console.error("Error saving customer data:", error);
    }
  };

  // };
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
        console.error("Error fetching services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleDeleteService = (id) => {
    const updatedServices = [...services];
    const indexToDelete = updatedServices.findIndex(
      (service) => service.id === id
    );

    if (indexToDelete !== -1) {
      updatedServices.splice(indexToDelete, 1); // Remove the service at the found index
      setServices(updatedServices); // Update the state with the modified services array
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), itemName: "", price: 0, quantity: 1 },
    ]);
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
        console.error("Error fetching items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddService = () => {
    const newService = {
      id: serviceIdCounter,
      serviceName: "",
      price: 0,
      employee: "",
    };
    setServices([...services, newService]);
    setServiceIdCounter(serviceIdCounter + 1); // Increment the serviceIdCounter
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
        console.error("Error fetching employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
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
    const discount =
      (subtotal * discountPercent) / 100 + parseFloat(discountAmount);

    const totalBeforeGST = subtotal - discount;
    const gstAmount = (totalBeforeGST * gstPercent) / 100;
    const totalAmount = totalBeforeGST + gstAmount;

    return totalAmount;
  }, [services, items, discountPercent, discountAmount, gstPercent]);

  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [
    services,
    items,
    discountPercent,
    discountAmount,
    gstPercent,
    calculateTotalAmount,
  ]);

  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [services, discountPercent, discountAmount, calculateTotalAmount]);

  // Example: Updating total amount when items change
  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [items, discountPercent, discountAmount, calculateTotalAmount]);

  useEffect(() => {
    const fetchMaxBillNumber = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/customers`); // Replace with your endpoint
        if (response.status === 200) {
          const customers = response.data;

          // Find the maximum bill number across all customers
          let maxBillNumber = 0;

          customers.forEach((customer) => {
            if (customer.billing && customer.billing.length > 0) {
              customer.billing.forEach((bill) => {
                const billNumber = parseInt(bill.billNumber, 10); // Parse as an integer
                if (!isNaN(billNumber) && billNumber > maxBillNumber) {
                  maxBillNumber = billNumber;
                }
              });
            }
          });

          // Calculate the new bill number by incrementing the maximum
          const newBillNumber = maxBillNumber + 1;
          setBillNumber(newBillNumber);
        } else {
          // Handle error
          console.error("Error fetching customer data");
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchMaxBillNumber();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      toast.warn("Please select a customer.");
      return;
    }

    if (services.length === 0 && items.length === 0) {
      toast.warn("Please select at least one service or one item.");
      return;
    }
    // Find the selected customer based on the selectedCustomerId
    const selectedCustomer = customerNames.find(
      (customer) => customer._id === selectedCustomerId
    );

    if (!selectedCustomer) {
      toast.warn("Selected customer not found.");
      return;
    }

    try {
      const formData = {
        billNumber: billNumber,
        date,
        customer: selectedCustomer.name,
        services,
        items,
        discountPercent,
        discountAmount,
        gstPercent,
        gstNumber,
        paymentMethod: paymentMethod,
        totalAmount,
        createdByModel: userRole === 'admin' ? 'Register' : 'Employee',
      };

      const response = await axios.post(
        `${BASE_URL}/api/customers/${selectedCustomerId}/billing`,
        formData,
        {
          headers: {
            'x-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        toast.success("Billing data saved successfully!", {
          position: "top-right",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const printContent = generatePrintContent(selectedCustomer);
        openPrintWindow(printContent);

        setBillNumber(billNumber + 1);
        // setDate('');
        setSearchQuery('');
        setSelectedCustomerName('');
        setSelectedCustomerId(""); // Reset the selected customer
        setServices([]);
        setItems([]);
        setDiscountPercent(0);
        setDiscountAmount(0);
        setGstPercent(0);
        setGstNumber("");
        setPaymentMethod("");
        setTotalAmount(0);
      } else {
        toast.error("Error saving billing data");
      }
    } catch (error) {
      console.error("Error saving billing data:", error);
    }
  };
  const generatePrintContent = (selectedCustomer) => {
    const printContent = `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .invoice-container {
           
            
           
            border-radius: 10px;
            
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .th89{
            background-color: rgb(218, 213, 213);
            border: 1px solid #ccc;
            padding: 5px;
            text-align: center;
          }
          .invoice-name{
            width: 100px;
            margin-top: 0px;
          }
          .invoice-flex{
            display: flex;
          }
          .td89{
            background-color: white;
            border: 1px solid #ccc;
            padding: 5px;
            font-weight: normal;
            text-align: center;
          }
          .td88{
            text-align: left !important;
          }
          // .items-table, .items-table  {
          //   border: 1px solid #ccc;
          //   padding: 10px;
          //   text-align: left;
          // }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h2>Customer Invoice Details</h2>
          </div>
          <div class="invoice-details">
          <div class="invoice-flex">  <p class="invoice-name">Date</p>:&nbsp;&nbsp; ${date}</div>
            <div>Bill Number &nbsp;:&nbsp; ${billNumber}</div>
          </div>

          <div class="customer-details">
           
          <div class="invoice-flex"><p class="invoice-name">Customer ID</p>:&nbsp;&nbsp; ${
            selectedCustomer.customerId
          }</div>
          <div class="invoice-flex"><p class="invoice-name">Name</p>:&nbsp;&nbsp; ${
            selectedCustomer.name
          }</div>
            
          </div>
          <table class="items-table">
          <thead>
            <tr>
            <th style="background-color: rgb(218, 213, 213);width: 35%; border: 1px solid black; padding: 5px; text-align: center;">Employee name</th>
            <th style="background-color: rgb(218, 213, 213);width: 35%; border: 1px solid black; padding: 5px; text-align: center;">Service Name</th>
            <th style="background-color: rgb(218, 213, 213);width: 35%; border: 1px solid black ; padding: 5px; text-align: center;">Service Price (RS)</th>
            
            </tr>
          </thead>
          <tbody>
            ${services
              .map(
                (service) => `
                  <tr>
                  <td style="background-color: white; border: 1px solid black; padding: 5px; font-weight: normal;text-align: left;">${service.employee}</td>
                  <td style="background-color: white; border: 1px solid black; padding: 5px; font-weight: normal;text-align: left;">${service.serviceName}</td>
                  <td style="background-color: white; border: 1px solid black; padding: 5px; font-weight: normal;text-align: center;">${service.price}</td>
                    
                   
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
          <table class="items-table">
            <thead>
              <tr>
                <th style="background-color: rgb(218, 213, 213);width: 35%; border: 1px solid black; padding: 5px; text-align: center;">Item Name</th>
                <th style="background-color: rgb(218, 213, 213);width: 35%; border: 1px solid black; padding: 5px; text-align: center;">Quantity</th>
                <th style="background-color: rgb(218, 213, 213);width: 35%; border: 1px solid black; padding: 5px; text-align: center;"> Item Price (RS)</th>
                
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                    <tr>
                      <td style="background-color: white; border: 1px solid black; padding: 5px; font-weight: normal;text-align: left;">${item.itemName}</td>
                      <td style="background-color: white; border: 1px solid black; padding: 5px; font-weight: normal;text-align: center;">${item.quantity}</td>
                      <td style="background-color: white; border: 1px solid black; padding: 5px; font-weight: normal;text-align: center;">${item.price}</td>
                      
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="total-amount">
          <div class="invoice-flex"><p style="width:115px;margin-top: 0px;">Discount in %</p>: &nbsp; &nbsp;${discountPercent}%</div>
            <div>GST &nbsp;:  &nbsp; &nbsp;${gstPercent} %</div>
            <div>GST No &nbsp;:  &nbsp; &nbsp;${gstNumber} </div>
            <h3>Total Amount in RS &nbsp;:&nbsp; ${totalAmount.toFixed(
              2
            )} /-</h3>
          </div>
        </div>
      </body>
    </html>
  `;

    return printContent;
  };

  const openPrintWindow = (printContent) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Error opening print window. Please allow pop-ups.");
      return;
    }

    // Open print window, write content, and initiate print
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    // Close print window after printing
    printWindow.onafterprint = function () {
      printWindow.close();
    };
  };

  
  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount - (newTotalAmount * couponDiscount) / 100);
  }, [
    services,
    items,
    discountPercent,
    discountAmount,
    couponDiscount,
    calculateTotalAmount,
  ]);

  // useEffect(() => {
  //   if (selectedMobileNumber) {
  //     // Make an API call to fetch customer data based on mobile number
  //     // Update the state with the fetched customer's ID and name
  //     fetchCustomerData(selectedMobileNumber);
  //   }
  // }, [selectedMobileNumber]);

  // Modify the fetchCustomerData function to update selectedCustomerId and selectedCustomerName
  // const fetchCustomerData = async (mobileNumber) => {
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}/api/customers?mobileNumber=${mobileNumber}`
  //     );
  //     if (response.status === 200) {
  //       const customerData = response.data;
  //       if (customerData.length > 0) {
  //         // const selectedCustomer = customerData[0]; // Retrieve the first record (or the specific record you need)
  //          //setSelectedCustomerId(selectedCustomer.customerId); // Assuming customerId is a property in your API response
  //          //setSelectedCustomerName(selectedCustomer.name); // Assuming name is a property in your API response
  //       } else {
  //         // Handle case when no customer is found for the provided mobile number
  //         toast.warn("Customer not found for the provided mobile number.");
  //       }
  //     } else {
  //       // Handle error here
  //       console.error("Error fetching customer data");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching customer data:", error);
  //   }
  // };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Reset the selected customer and customer ID when the input field is empty
    if (query === "") {
      setSelectedCustomerId("");
      setSelectedCustomerName("");
      setSelectedMobileNumber("");
      
      // setCustomerNames(billingData); // Assuming billingData contains the original customer names data
      return;
    }

    const selectedCustomer = customerNames.find(
      (customer) => customer.phone && customer.phone.includes(query) && query.length === 10
    );

    if (selectedCustomer) {
      // If a customer with the entered phone number is found, set the selected customer and customer ID in the state
      setSelectedCustomerId(selectedCustomer._id);
      setSelectedCustomerSaloonId(selectedCustomer.customerId);
      setSelectedCustomerName(selectedCustomer.name);
      setSelectedMobileNumber(selectedCustomer.phone);
    } else {
      // If no matching customer is found, reset the selected customer and customer ID in the state
      setSelectedCustomerId("");
      setSelectedCustomerName();
      setSelectedMobileNumber("");
    }

    // Filter the customer data based on the search query (phone or ID)
    const filteredCustomers = customerNames.filter((customer) => {
      return customer.phone && customer.phone.includes(query);
    });

    // Update the customer names list with filtered results
    setCustomerNames(filteredCustomers);
  };

  return (
    <div className="billing-form-sk142s">
      <p className="heading678">Generate Bill</p>
      <div className="small-container678">
        <div className="bnsk142s">
          <div className="form-groupsk142s">
            <div className="lable-width567">
              <label className="bill-no123">Bill Number :</label>
            </div>
            <input
              className="bnsk142sinput89"
              type="text"
              value={billNumber}
              readOnly
            />
          </div>
          <div className="form-groupsk142s">
            <label className="bill-no12345">Date:</label>
            <input
              className="bnsk142sinput89"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-groupsk14210s">
          <div className="flex1100">
            <div className="lable-width567">
              <label className="bill-no123"> Mobile Number:</label>
            </div>
            <input
              className="bnsk142sinput89"
              type="tel"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Enter Phone Number"
              maxLength={10}
            />
          </div>
          {/* <div className="lable-width567"> */}
          <div className="flex1100">
            <label className="bill-no12345 width8901">Customer:</label>
            {/* </div> */}
            <input
              className="bnsk142sinput89"
              value={`${selectedCustomerName || ''}${selectedCustomerId ? ` (${selectedCustomerSaloonId})` : ''}`}
              readOnly
              // onChange={(e) => setSelectedCustomerName(e.target.value)}
              // required
            >
              {/* <option value="">select a Customer</option>
              {customerNames.map((customer, index) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}&nbsp;({customer.customerId})
                </option>
              ))} */}
            </input>

            <button className="addnewsk142s" onClick={handleCustomerFormOpen}>
              <span className="plusk142s">+</span>Add New
            </button>
          </div>
        </div>
        <div className="servicesk142s">
          <div className="lable-width567">
            <label className="bill-no123">Services :</label>
          </div>
          <div className="columns456">
            {services.map((service, index) => (
              <div key={service.id} className="service-row">
                <select
                  className="changesize567"
                  value={service.id} // Use service ID as the value for the dropdown
                  onChange={(e) => {
                    const selectedServiceId = e.target.value;
                    const selectedService = availableServices.find(
                      (availableService) =>
                        availableService._id === selectedServiceId
                    );

                    const updatedServices = services.map((s, idx) => {
                      if (idx === index) {
                        return {
                          ...s,
                          id: selectedServiceId,
                          serviceName: selectedService
                            ? selectedService.serviceName
                            : "",
                          price: selectedService ? selectedService.price : 0,
                        };
                      }
                      return s;
                    });

                    setServices(updatedServices);
                  }}
                >
                  <option className="optionselect7899" value="">
                    Select a service
                  </option>
                  {availableServices.map((availableService) => (
                    <option
                      key={availableService._id}
                      value={availableService._id} // Use service ID as the value for each option
                    >
                      {availableService.serviceName}&nbsp;&nbsp;(
                      {availableService.category})
                    </option>
                  ))}
                </select>
                <input
                  className="input-change789"
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
                  }}
                />
                {showEmployeeField && (
                  <select
                    className="optionselect789"
                    value={service.employee}
                    onChange={(e) => {
                      const selectedEmployee = e.target.value;
                      const updatedServices = [...services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        employee: selectedEmployee,
                      };
                      setServices(updatedServices);
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
            <div>
            <button className="addnewsk142sd" onClick={handleAddService}>
              <span className="plusk142s">+</span>Add Service
            </button>
            </div>
          </div>
        </div>

        <div className="itemsk142s">
          <div className="lable-width567">
            <label className="bill-no123">Items :</label>
          </div>
          <div className="columns456">
            {items.map((item, index) => (
              <div key={item.id} className="item-row-select67">
                <select
                  className="options678"
                  value={item.itemName}
                  onChange={(e) => {
                    const selectedItemName = e.target.value;
                    const updatedItems = [...items];
                    const selectedItem = availableItems.find(
                      (availableItem) =>
                        availableItem.itemName === selectedItemName
                    );

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
                  }}
                >
                  <option value="">Select an item</option>
                  {availableItems.map((availableItem) => (
                    <option
                      key={availableItem.id}
                      value={availableItem.itemName}
                    >
                      {availableItem.itemName}
                    </option>
                  ))}
                </select>

                <input
                  className="input-change789"
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => {
                    const updatedItems = [...items];
                    updatedItems[index] = {
                      ...updatedItems[index],
                      price: parseFloat(e.target.value),
                    };
                    setItems(updatedItems);
                  }}
                />
                <input
                  className="input-change789"
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
                  }}
                />
                <input
                  className="input-change789"
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
            <button className="addnewsk142s" onClick={handleAddItem}>
              <span className="plusk142s">+</span>Add Item
            </button>
          </div>
        </div>
        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Discount (%)</label>
          </div>
          <input
            className="totalbillsk142s"
            type="number"
            value={discountPercent}
            onChange={(e) => {
              const inputDiscount = parseInt(e.target.value, 10);
              if (!isNaN(inputDiscount) && inputDiscount >= 0) {
                setDiscountPercent(inputDiscount);
              }
            }}
          />
        </div>

        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Mode Of Payment:</label>
          </div>
          <select
            className="bnsk142sinput89"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Payment Method</option>
            <option value="online">Online</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">GST (%)</label>
          </div>
          <input
            className="totalbillsk142s"
            type="number"
            value={gstPercent}
            onChange={(e) => {
              const newGSTPercent = parseInt(e.target.value, 10);
              if (!isNaN(newGSTPercent) && newGSTPercent >= 0) {
                setGstPercent(newGSTPercent);
              } else {
              }
            }}
          />
        </div>

        {/* Add GST Number input field */}
        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">GST Number:</label>
          </div>
          <input
            className="totalbillsk142s"
            type="text"
            value={gstNumber}
            onChange={handleGstNumberChange}
            placeholder="Enter GST Number"
          />
        </div>

        {/* <p>GST Amount: {calculateGstAmount().toFixed(2)} RS</p> */}

        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Total Amount:</label>
          </div>
          <input
            className="totalbillsk142s"
            type="text"
            value={totalAmount.toFixed(2)}
            readOnly
          />
        </div>
        <div className="save-btn456">
          <button
            className="addnewsk1445"
            type="submit"
            onClick={handleFormSubmit}
          >
            Save
          </button>
          {/* <button className='addnewsk1445' onClick={handlePrint}>Print</button> */}
        </div>

        {isCustomerFormOpen && (
          <div className="customer-popup">
            <div className="cross-btn890">
              <h3 className="heading3">Add New Customer</h3>
              <button className="button45678" onClick={handleCustomerFormClose}>
                X
              </button>
            </div>
            <form onSubmit={handleSaveCustomer}>
              <div className="form-group-popup89">
                <div className="labelchange5678">
                  <label className="lable90">Name:</label>
                </div>
                <input
                  className="input-popup678"
                  type="text"
                  placeholder="Enter Name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group-popup89">
                <div className="labelchange5678">
                  <label className="lable90">Date of Birth:</label>
                </div>
                <input
                  className="input-popup-date45"
                  type="date"
                  value={newCustomer.dob}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, dob: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group-popup89">
                <div className="labelchange5678">
                  <label className="lable90">Email:</label>
                </div>
                <input
                  className="input-popup678"
                  type="email"
                  placeholder="Email Id"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group-popup89">
                <div className="labelchange5678">
                  <label className="lable90">Address:</label>
                </div>
                <textarea
                  type="text"
                  className="input-popup6789"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group-popup89">
                <div className="labelchange5678">
                  <label className="lable90">Phone:</label>
                </div>
                <input
                  className="input-popup678"
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  required
                />
              </div>
    
              <div className="btn-change234">
                <button className="save-btn2345" type="submit">
                  Add
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default BillingForm;
