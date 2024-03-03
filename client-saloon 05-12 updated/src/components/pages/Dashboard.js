import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { PiOfficeChairBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { BiCalendar } from "react-icons/bi";
import { MdOutlineHomeRepairService } from "react-icons/md";
import { AiFillDatabase } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import  billing from '../images/billing.jpeg';
import appo from'../images/appo.jpeg';
import customers from'../images/customers.jpeg';
import add from'../images/add.jpeg';
import message from'../images/message.jpeg';
import inven from '../images/inven.jpeg'

import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineMessage } from "react-icons/ai";
import { BsFillCartCheckFill } from "react-icons/bs";
import { BsCurrencyRupee } from "react-icons/bs";
import { AiOutlineBarChart } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import axios from "axios";
import Calendar from "./Calendar.jsx";
import AddEmployee from "./AddEmployee.js";
import NewAppointment from "./newappointment.js";
import EditProfile from "./EditProfile.js";
import Register from "./Register.js";
import Appointments from "./appointments.js";
import InventoryList from "./InventoryList.js";

import ProductList from "./ProductList.js";
import Suppliers from "./Suppliers.js";
import ServiceForm from "./Service.js";
import { useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct.js";
import AddCustomer from "./AddCustomer.js";
import PurchaseProduct from "./PurchaseProduct.js";
import BillingForm from "./Billing.js";
import AddService from "./AddService.js";
import CustomerTable from "./CustomerTable.js";
import AddSupplier from "./AddSupplier.js";
import StockSelfUse from "./StockSelfUse.js";
import Messages from "./Messages.js";
import BillingTable from "./Reports.js";
import CustomerDetails from "./CustomerDetails.js";
import Employees from "./Employees.js";
import { BASE_URL } from "../Helper/helper.js";

function Dashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // const [selectedButton, setSelectedButton] = useState('');
  const [selectedButton, setSelectedButton] = useState("");
  const [alertShown, setAlertShown] = useState(false);


  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const [appointments, setAppointments] = useState(false);
  // const [bills, setBills] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  // const [token,setToken] = useContext(store);

  const [totalInventoryAmount, setTotalInventoryAmount] = useState(0); // Declare totalInventoryAmount
  const [totalServiceAmount, setTotalServiceAmount] = useState(0); // Declare totalServiceAmount
  const [totalNumberOfBills, setTotalNumberOfBills] = useState(0);
  const [totalNumberOfAppointments, setTotalNumberOfAppointments] = useState(0);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    navigate("/");
  }

  

  useEffect(() => {
    // Check if there is a previously selected component in localStorage
    const storedSelectedButton = localStorage.getItem("selectedButton");
    if (storedSelectedButton) {
      setSelectedButton(storedSelectedButton);
    }

    // Your existing code for fetching data...
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedButton", selectedButton);
  }, [selectedButton]);

  const handleButtonClick = (buttonName, customerData) => {
    // Save the selected component to localStorage
    //  localStorage.removeItem('selectedButton', buttonName);
    setSelectedButton(buttonName);
    setCustomer(customerData);
    setSelectedCustomer(customerData);
  };

  useEffect(() => {
    // Fetch customer data from your API
    axios
      .get(`${BASE_URL}/api/customers`) // Replace with the appropriate API endpoint
      .then((response) => {
        const customerData = response.data;
        setCustomerData(response.data);

        const today = new Date(); // Replace this with your method of getting today's date

        const totalServiceToday = customerData.reduce((acc, customer) => {
          const customerTotalServiceToday = customer.billing.reduce(
            (total, bill) => {
              // Check if the appointment date is today
              const appointmentDate = new Date(bill.date);
              if (appointmentDate.toDateString() === today.toDateString()) {
                return (
                  total +
                  bill.services.reduce(
                    (subtotal, service) => subtotal + service.price,
                    0
                  )
                );
              }
              return total;
            },
            0
          );
          return acc + customerTotalServiceToday;
        }, 0);

        const totalInventoryToday = customerData.reduce((acc, customer) => {
          const customerTotalInventoryToday = customer.billing.reduce(
            (total, bill) => {
              // Check if the bill date is today
              const billDate = new Date(bill.date);
              if (billDate.toDateString() === today.toDateString()) {
                return (
                  total +
                  bill.items.reduce(
                    (subtotal, item) => subtotal + item.price * item.quantity,
                    0
                  )
                );
              }
              return total;
            },
            0
          );
          return acc + customerTotalInventoryToday;
        }, 0);

        const totalBillsToday = customerData.reduce((acc, customer) => {
          const customerBillsToday = customer.billing.filter((bill) => {
            // Check if the bill date is today
            const billDate = new Date(bill.date);
            return billDate.toDateString() === today.toDateString();
          });
          return acc + customerBillsToday.length;
        }, 0);

        // Assuming you have a date object representing today's date
        // Replace this with your method of getting today's date

        const totalAppointmentsToday = customerData.reduce((acc, customer) => {
          const customerAppointmentsToday = customer.appointments.filter(
            (appointment) => {
              // Check if the appointment date is today
              const appointmentDate = new Date(appointment.date);
              return appointmentDate.toDateString() === today.toDateString();
            }
          );
          return acc + customerAppointmentsToday.length;
        }, 0);

        setTotalServiceAmount(totalServiceToday);
        setTotalInventoryAmount(totalInventoryToday);
        setTotalNumberOfBills(totalBillsToday);
        setTotalNumberOfAppointments(totalAppointmentsToday);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, [customerData]);

  const handleLogout = () => {
    // Clear the token

    localStorage.removeItem("token");
    localStorage.setItem("selectedButton", "Calendar");
    // Redirect to the login page
    navigate("/");
  };

  const renderRegisterButton = () => {
    if (userRole === "admin") {
      return (
        <div
          className="dropdown-item-salon23"
          onClick={() => setSelectedButton("Register")}
        >
          Register
        </div>
      );
    }
    return null; // Return null if the user is authenticated or doesn't meet the specific username condition
  };
  useEffect(() => {
    // Use token here or fetch data
  }, [token]);

  return (
    <div className="master-container-salon">
      {/* <div className='second-container23'> */}
      <div className="fixed-container678">
        <div className="dashboard-salon2390">
         
          {/* <h4 className="welcome23">Saloon</h4> */}
          <div><img src="https://tse4.mm.bing.net/th?id=OIP.894njvBoCKbBgo32zsTvJQHaFM&pid=Api&P=0&h=180" className="matrical-logo"/></div>
         
          <div className="logostyle23">
            <CgProfile className="logo-sizing23" />
            <div className="tooltip-dropdown">
              <div className="dropdown-item-salon23" onClick={handleLogout}>
                Log out
              </div>
              {renderRegisterButton()}
              {/* <div className='dropdown-item-salon23' onClick={() => setSelectedButton('Register')}>
      Register
    </div> */}
              <div
                className="dropdown-item-salon23"
                onClick={() => setSelectedButton("Edit profile")}
              >
                Edit profile
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-salon23">
          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Calendar")}
          >
            <div className="icon-center23 ">
              <BiCalendar />{" "}
            </div>
            <div className="name234">Calendar</div>
          </button>
          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Billing")}
          >
            <div className="icon-center23 ">
              {/* <FaMoneyBillWaveAlt /> */}
              <img src={billing} alt=""></img>
            </div>
            <div className="name234">Billing</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => handleButtonClick("Appointments")}
          >
            <div className="icon-center23 ">
              {/* <FaUsers /> */}
              <img src={appo} alt=""></img>
            </div> 
            <div className="name234">Appoinments</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => handleButtonClick("Customers")}
          >
            {" "}
            <div className="icon-center23 ">
              {/* <AiFillDatabase /> */}
              <img src={customers}></img>
            </div>
            <div className="name234">Customers</div>
          </button>

          <button
            className="dashboard-button-salon23 "
            onClick={() => handleButtonClick("Inventory")}
          >
            <div className="icon-center23 ">
              {/* <BsGraphUpArrow /> */}
              <img src={inven}alt=""></img>
            </div>
            <div className="name234">Inventory</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Services")}
          >
            <div className="icon-center23 ">
              {/* <MdOutlineHomeRepairService /> */}
              <img src={add} alt=""></img>
            </div>
            <div className="name234">Services</div>{" "}
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Employees")}
          >
            <div className="icon-center23 ">
              <AiOutlineMenu />
            </div>
            <div className="name234">Employees</div>{" "}
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Reports")}
          >
            <div className="icon-center23 ">
              <TbReportAnalytics />
            </div>
            <div className="name234">Reports</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Messages")}
          >
            <div className="icon-center23 ">
              {/* <AiOutlineMessage /> */}
              <img src={message} alt=""></img>
            </div>
            <div className="name234">Messages</div>{" "}
          </button>
        </div>

        
      </div>

      <div className="white-bg23">
        <div className="cards-container23">
          <h5 className="heading234">Financial Statistics</h5>
          <div className="cards-flex23">
            <div className="small-cards2 all-small-cards2345">
              <div className="flextochange789">
                <BsFillCartCheckFill className="icon-center234 " />
                <p className="amount-fetch23">
                  {totalServiceAmount.toFixed(0) || 0}
                </p>{" "}
              </div>
              Services amount
            </div>
            <div className="small-cards23 all-small-cards2345">
              <div className="flextochange789">
                <BsCurrencyRupee className="icon-center234 " />
                <p className="amount-fetch23">
                  {totalInventoryAmount.toFixed(0) || 0}
                </p>{" "}
              </div>
              Inventory amount
            </div>
            <div className="small-cards234 all-small-cards2345">
              <div className="flextochange789">
                <AiOutlineBarChart className="icon-center234 " />
                <p className="amount-fetch23">{totalNumberOfBills || 0}</p>{" "}
              </div>
              Bills Generated
            </div>
            <div className="small-cards2345 all-small-cards2345">
              <div className="flextochange789">
                <FiUsers className="icon-center234 " />
                <p className="amount-fetch23">
                  {" "}
                  {totalNumberOfAppointments || 0}
                </p>{" "}
              </div>
              Appoinments
            </div>
          </div>
        </div>
        <div className="button-indicators23">
          {selectedButton}
          {/* {selectedButton === 'Appointments' && (
            <button className='sub-button23'  onClick={() => setSelectedButton('NewAppointment')}>New Customer / Appointment</button>
          )} */}

          {selectedButton === "Customers" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("New Customer")}
            >
              New Customer
            </button>
          )}

          {selectedButton === "Add Employee" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Employees")}
            >
              Employees
            </button>
          )}

          {selectedButton === "Inventory" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Manage Products")}
            >
              {" "}
              Manage Products
            </button>
          )}

          {selectedButton === "Manage Products" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Inventory")}
            >
              Inventory
            </button>
          )}
          {selectedButton === "Manage Products" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Suppliers")}
            >
              Suppliers
            </button>
          )}

          {selectedButton === "Manage Products" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Stock Self-Use")}
            >
              Stock Self-Use
            </button>
          )}

          {selectedButton === "Inventory" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Suppliers")}
            >
              Suppliers
            </button>
          )}
          {selectedButton === "Suppliers" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Inventory")}
            >
              Inventory
            </button>
          )}

          {selectedButton === "Suppliers" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Manage Products")}
            >
              Manage Products
            </button>
          )}
          {selectedButton === "Suppliers" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Stock Self-Use")}
            >
              Stock Self-Use
            </button>
          )}

          {selectedButton === "Inventory" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Stock Self-Use")}
            >
              Stock Self-Use
            </button>
          )}

          {selectedButton === "Stock Self-Use" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Inventory")}
            >
              Inventory
            </button>
          )}
          {selectedButton === "Stock Self-Use" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Manage Products")}
            >
              Manage Products
            </button>
          )}
          {selectedButton === "Stock Self-Use" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Suppliers")}
            >
              Suppliers
            </button>
          )}

          {selectedButton === "AddSupplier" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Suppliers")}
            >
              Suppliers
            </button>
          )}

          {selectedButton === "PurchaseProduct" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Inventory")}
            >
              Inventory
            </button>
          )}

          {selectedButton === "NewProduct" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Manage Products")}
            >
              Manage Products
            </button>
          )}

          {selectedButton === "AddService" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Services")}
            >
              Services
            </button>
          )}

          {selectedButton === "New Customer" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Customers")}
            >
              Customers
            </button>
          )}

          {selectedButton === "CustomerDetails" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Customers")}
            >
              Customers
            </button>
          )}

          {selectedButton === "NewAppointment" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Appointments")}
            >
              Appointments
            </button>
          )}
        </div>
      </div>

      <div className="white-bg23">
        {/* <div className="cards-container23">
          <h5 className="heading234">Financial Statistics</h5>
          <div className="cards-flex23">
            <div className=" all-small-cards23456">
              <div className="flextochange789">
                <BsFillCartCheckFill className="icon-center234 " />
                <p className="amount-fetch23">
                  {totalServiceAmount.toFixed(0) || 0}
                </p>{" "}
              </div>
              Services Amount
            </div>
            <div className=" all-small-cards23456">
              <div className="flextochange789">
                <BsCurrencyRupee className="icon-center234 " />
                <p className="amount-fetch23">
                  {totalInventoryAmount.toFixed(0) || 0}
                </p>{" "}
              </div>
              Inventory Amount
            </div>
            <div className=" all-small-cards23456">
              <div className="flextochange789">
                <AiOutlineBarChart className="icon-center234 " />
                <p className="amount-fetch23">{totalNumberOfBills || 0}</p>{" "}
              </div>
              Bills Generated
            </div>
            <div className=" all-small-cards23456">
              <div className="flextochange789">
                <FiUsers className="icon-center234 " />
                <p className="amount-fetch23">
                  {" "}
                  {totalNumberOfAppointments || 0}
                </p>{" "}
              </div>
              Appoinments
            </div>
          </div>
        </div> */}
        {selectedButton === "Edit profile" && <EditProfile />}

        {selectedButton === "Register" && <Register />}

        {selectedButton === "Calendar" && (
          <Calendar onNewBillClick={() => handleButtonClick("Billing")} />
        )}

        {selectedButton === "Employees" &&  userRole === "admin" && (
          <Employees
            onNewEmployeeClick={() => handleButtonClick("Add Employee")}
          />
        )}

{selectedButton === "Employees" && userRole !== "admin" && !alertShown && (
    // Display an alert if userRole is not admin and the alert has not been shown
    (() => {
        setAlertShown(true); // Set alertShown to true to prevent repeated alerts
        window.alert("You must be logged in as an admin to access this page.");
    })()
)}


        {/* {selectedButton === 'Appointments' && (
            <Appointments  onNewAppointmentClick={() => handleButtonClick('NewAppointment')}/>
          )}   */}

        {selectedButton === "Add Employee" && <AddEmployee />}

        {selectedButton === "Appointments" && (
          <Appointments
            onNewAppointmentClick={(customerData) =>
              handleButtonClick("NewAppointment", customerData)
            }
          />
        )}

        {selectedButton === "NewAppointment" && (
          <NewAppointment customer={customer} />
        )}

        {selectedButton === "New Customer" && <AddCustomer />}

        {selectedButton === "Inventory" && (
          <InventoryList
            onNewPurchaseClick={() => handleButtonClick("PurchaseProduct")}
          />
        )}
        {selectedButton === "PurchaseProduct" && (
          <PurchaseProduct
            onNewSupplierClick={() => handleButtonClick("AddSupplier")}
          />
        )}

        {selectedButton === "Manage Products" && (
          <ProductList
            onNewProductClick={() => handleButtonClick("NewProduct")}
          />
        )}

        {selectedButton === "NewProduct" && <AddProduct />}
        {selectedButton === "Suppliers" && (
          <Suppliers
            onNewSupplierClick={() => handleButtonClick("AddSupplier")}
          />
        )}

        {selectedButton === "AddSupplier" && <AddSupplier />}

        {selectedButton === "Services" && (
          <ServiceForm
            onNewServiceClick={() => handleButtonClick("AddService")}
          />
        )}
        {selectedButton === "AddService" && <AddService />}

        {selectedButton === "Billing" && <BillingForm />}
        {selectedButton === "Customers" && (
          <CustomerTable
            onCustomerDetailsClick={(selectedCustomer) =>
              handleButtonClick("CustomerDetails", selectedCustomer)
            }
          />
        )}

        {selectedButton === "CustomerDetails" && (
          <CustomerDetails selectedCustomer={selectedCustomer} />
        )}

        {selectedButton === "Stock Self-Use" && <StockSelfUse />}
        {selectedButton === "Reports" && <BillingTable />}

        {selectedButton === "Messages" && <Messages />}

        {!selectedButton && (
          <Calendar onNewBillClick={() => handleButtonClick("Billing")} />
        )}
      </div>

      {/* </div> */}
    </div>
  );
}

export default Dashboard;
