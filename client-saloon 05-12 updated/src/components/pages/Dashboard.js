import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import Vector5 from "../images/Vector5.png";
import calendar from "../images/calendar.jpeg";
import Group from "../images/Group.png";
import Vector4 from "../images/Vector4.png";
import Vector from "../images/Vector.png";
import Vector1 from "../images/Vector1.png";
import { toast, ToastContainer } from "react-toastify";
import Vector3 from "../images/Vector3.png";
import Inventory from "../images/Inventory.jpeg";
import good from "../images/good.jpeg";
import Chart1 from "../images/Chart1.png";
import settings1 from "../images/settings1.png";
import axios from "axios";
import Calendar from "./Calendar.jsx";
import AddEmployee from "./AddEmployee.js";
import NewAppointment from "./newappointment.js";
import EditProfile from "./EditProfile.js";
import Register from "./Register.js";
import Appointments from "./appointments.js";
import InventoryList from "./InventoryList.js";
import total from "../images/total.jpeg";
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
import Salonlogo from "../images/Salonlogo.png";


function Dashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // const [selectedButton, setSelectedButton] = useState('');
  const [selectedButton, setSelectedButton] = useState("");

  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const [appointments, setAppointments] = useState(false);
  // const [bills, setBills] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [alertShown, setAlertShown] = useState(false);
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
          <img src={Salonlogo}  alt="Salonlogo" className="logo-salon"/>
          <div className="logostyle23">
            <p className="logo-sizing23" />
            <div class="logostyle23">
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="0"
                viewBox="0 0 24 24"
                class="logo-sizing23"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                  fill="currentColor"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
                  fill="currentColor"
                ></path>
              </svg>
              <div class="tooltip-dropdown">
                <div class="dropdown-item-salon23">Log out</div>
                <div class="dropdown-item-salon23">Register</div>
                <div class="dropdown-item-salon23">Edit profile</div>
              </div>
            </div>
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
              <img src={calendar} alt="" className="calenadr"></img>{" "}
            </div>
            <div className="name234">Calendar</div>
          </button>
          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Billing")}
          >
            <div className="icon-center23 ">
              {/* <FaMoneyBillWaveAlt /> */}
              <img src={Vector5} alt=""></img>
            </div>
            <div className="name234">Billing</div>
          </button>
          <button
            className="dashboard-button-salon23"
            onClick={() => handleButtonClick("Appointments")}
          >
            <div className="icon-center23 ">
              {/* <FaUsers /> */}
              <img src={Group} alt=""></img>
            </div>
            <div className="name234">Appoinments</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => handleButtonClick("Customers")}
          >
            {" "}
            <div className="icon-center23 ">{/* <AiFillDatabase /> */}</div>
            <img src={Vector4} alt="" className="setting"></img>
            <div className="name234">Customers</div>
          </button>

          <button
            className="dashboard-button-salon23 "
            onClick={() => handleButtonClick("Inventory")}
          >
            <div className="icon-center23 ">
              {/* <BsGraphUpArrow /> */}
              <img src={Vector3} alt=""></img>
            </div>
            <div className="name234">Inventory</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Services")}
          >
            <div className="icon-center23 ">
              {/* <MdOutlineHomeRepairService /> */}
            </div>
            <img src={settings1} alt="" className="setting"></img>
            <div className="name234">Services</div>{" "}
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Employees")}
          >
            <div className="icon-center23 ">
              {/* <AiOutlineMenu /> */}
              <img src={Vector1} alt=""></img>
            </div>
            <div className="name234">Employees</div>{" "}
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Reports")}
          >
            <div className="icon-center23 ">{/* <TbReportAnalytics /> */}</div>
            <img src={Vector} className="setting"></img>
            <div className="name234">Reports</div>
          </button>

          {/* <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Messages")}
          >
            <div className="icon-center23 ">
              <img src={message} alt=""></img>
            </div>
            <div className="name234">Messages</div>{" "}
          </button> */}
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
        <div className="cards-container23">
          <h5 className="heading234">Financial Statistics</h5>
          <div className="cards-flex23">
            <div className=" all-small-cards23456">
              <div className="">
                <div className="mii">
                  <p className="amounts">Services Amount</p>
                  <img src={Chart1} alt="" className="Inventoryd"></img>
                </div>
                <div className="flextochange789">
                  {/* <BsFillCartCheckFill className="icon-center234 " /> */}
                  <p className="amount-fetch234">
                    ₹ {totalServiceAmount.toFixed(0) || 0}
                  </p>{" "}
                </div>
              </div>
            </div>
            <div className=" all-small-cards23456">
              <div className="mii">
                <p className="amounts">Inventory Amount</p>
                <img src={Inventory} alt="" className=" Inventory"></img>
              </div>
              <div className="flextochange789">
                {/* <BsCurrencyRupee className="icon-center234 " /> */}
                <p className="amount-fetch23">
                  ₹{totalInventoryAmount.toFixed(0) || 0}
                </p>{" "}
              </div>
            </div>
            <div className=" all-small-cards23456">
              <div className="mii">
                <p className="amounts">Bills Generated</p>
                <img src={good} alt="" className=" Inventory"></img>
              </div>

              <div className="flextochange789">
                {/* <AiOutlineBarChart className="icon-center234 " /> */}
                <p className="amount-fetch23">{totalNumberOfBills || 0}</p>{" "}
              </div>
            </div>
            <div className=" all-small-cards23456">
              <div className="mii">
                <p className="amounts"> Appoinments </p>
                <img src={total} alt="" className=" Inventory"></img>
              </div>

              <div className="flextochange789">
                {/* <FiUsers className="icon-center234 " /> */}
                <p className="amount-fetch23">
                  {" "}
                  {totalNumberOfAppointments || 0}
                </p>{" "}
              </div>
            </div>
          </div>
        </div>
        {selectedButton === "Edit profile" && <EditProfile />}

        {selectedButton === "Register" && <Register />}

        {selectedButton === "Calendar" && (
          <Calendar onNewBillClick={() => handleButtonClick("Billing")} />
        )}

        {selectedButton === "Employees" && userRole === "admin" && (
          <Employees
            onNewEmployeeClick={() => handleButtonClick("Add Employee")}
          />
        )}

        {selectedButton === "Employees" &&
          userRole !== "admin" &&
          !alertShown &&
          // Display an alert if userRole is not admin and the alert has not been shown
          (() => {
            setAlertShown(true); // Set alertShown to true to prevent repeated alerts
            toast.error(
              "You must be logged in as an admin to access this page."
            );
          })()}

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
      <ToastContainer />

      {/* </div> */}
    </div>
  );
}

export default Dashboard;
