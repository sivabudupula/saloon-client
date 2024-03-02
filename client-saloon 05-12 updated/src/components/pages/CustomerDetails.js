import React, { useState } from "react";

import Axios from "axios";

import "../styles/CustomerDetails.css";
// import image from "./customer.jpg";
import CustomerDetailsPopup from "./CustomerDetailsEdit";
import EditBill from "./EditBill";
import EditAppointments from "./EditAppointments";
import { FaUserCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const CustomerDetails = ({ selectedCustomer }) => {
  console.log(selectedCustomer);

  const [customer, setCustomer] = useState(selectedCustomer);

  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState(customer.appointments);

  const [editBillIndex, setEditBillIndex] = useState(null);
  const [editAppntIndex, setEditAppntIndex] = useState(null);
  const [billing] = useState(customer.billing);

  const [currentPageBilling, setCurrentPageBilling] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [billsPerPage, setBillsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBillQuery, setSearchBillQuery] = useState("");
  const [displayComponent, setDisplayComponent] = useState("customerDetails");

  const [showBillDetails, setShowBillDetails] = useState(false);
  const [selectedBillDetails, setSelectedBillDetails] = useState(null);

  const handleShowBillDetails = (bill) => {
    setSelectedBillDetails(bill);
    setShowBillDetails(true);
  };

  const handleCloseBillDetails = () => {
    setShowBillDetails(false);
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  }

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleDelete = async (appointmentId) => {
    const customerId = customer._id;

    // Display a confirmation toast
    const confirmToastId = toast.info(
      "Are you sure you want to delete this appointment?",
      {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );

    // Optionally, you can use a loading spinner or other UI indication here
    try {
      // Make your delete request here
      await Axios.delete(
        `${BASE_URL}/api/customers/${customerId}/appointments/${appointmentId}`
      );

      // Remove the deleted appointment from the appointments state
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment._id !== appointmentId
        )
      );

      // Dismiss the confirmation toast
      toast.dismiss(confirmToastId);

      // Display a success toast
      toast.success("Appointment deleted successfully!");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // Dismiss the confirmation toast
      toast.dismiss(confirmToastId);
      // Display an error toast
      toast.error("Error deleting appointment. Please try again.");
    }
  };

  const handleEditAppnt = (appointment) => {
    setEditAppntIndex(appointment);
    setDisplayComponent("editAppnt");
    // Pass the customer data instead of the index
  };

  const handleEditAppntCancel = () => {
    setEditAppntIndex(null);
    setDisplayComponent("customerDetails");
  };

  const handleEditBill = (index) => {
    setEditBillIndex(index);
    setDisplayComponent("editBill"); // Pass the customer data instead of the index
  };

  const handleEditBillCancel = () => {
    setDisplayComponent("customerDetails");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBillSearch = (e) => {
    const searchQuery = e.target.value.trim().toLowerCase();
    console.log("search Query :", searchQuery);
    setSearchBillQuery(searchQuery);
  };

  //     const filteredCustomers = customers.filter((customer) =>
  //     customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  const filteredAppointments = customer.appointments.filter((appointment) =>
    formatDate(appointment.date)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredBills = customer.billing.filter(
    (bill) => bill.billNumber && bill.billNumber.includes(searchBillQuery)
  );

  const handleEditSave = async (editedCustomer) => {
    setCustomer(editedCustomer);
    try {
      const response = await fetch(
        `${BASE_URL}/api/customers/${editedCustomer._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedCustomer),
        }
      );
      console.log("Response:", response.data);

      toast.success("Customer Profile Updated Successfully", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // setCustomer(editedCustomer);
    } catch (error) {
      console.error("Error updating data:", error);

      toast.error("Error Updating Customer Profile");
    }
  };

  const handleEditAppntSave = async (customerData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/appointments/${customerData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerData),
        }
      );
      console.log("Response:", response.data);

      toast.success("Appointment Updated Successfully", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setDisplayComponent("customerDetails");
    } catch (error) {
      console.error("Error updating data:", error);

      toast.error("Error Updating Appointment");
    }
  };

  const handleEditBillSave = async (customerData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/customers/billing/${customerData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerData),
        }
      );
      console.log("Response:", response.data);

      toast.success("Billing Updated Successfully", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setDisplayComponent("customerDetails");
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error Updating Billing");
    }
  };

  const handleBillingPageChange = (pageNumber) => {
    setCurrentPageBilling(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const indexOfLastBilling = currentPageBilling * billsPerPage;
  const indexOfFirstBilling = indexOfLastBilling - billsPerPage;
  const currentBillingList = filteredBills.slice(
    indexOfFirstBilling,
    indexOfLastBilling
  );
  const totalBillingPages = Math.ceil(filteredBills.length / billsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  const handleLastPageClick = () => {
    setCurrentPage(totalPages);
  };

  const handlePreviousPageClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // Calculate which page numbers to display
  const getDisplayedPages = () => {
    const totalDisplayPages = 3; // Number of pages to display
    const pages = [];
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
      if (pages.length >= totalDisplayPages) {
        break;
      }
    }
    return pages;
  };

  const handleBillsPerPageChange = (e) => {
    setBillsPerPage(parseInt(e.target.value, 10));
    setCurrentPageBilling(1);
  };

  const handleBillingFirstPageClick = () => {
    setCurrentPageBilling(1);
  };

  const handleBillingLastPageClick = () => {
    setCurrentPageBilling(totalBillingPages);
  };

  const handleBillingPreviousPageClick = () => {
    setCurrentPageBilling((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleBillingNextPageClick = () => {
    setCurrentPageBilling((prevPage) =>
      Math.min(prevPage + 1, totalBillingPages)
    );
  };

  const getDisplayedBillingPages = () => {
    const totalDisplayPages = 3; // Number of pages to display
    const pages = [];
    for (let i = currentPageBilling - 1; i <= currentPageBilling + 1; i++) {
      if (i > 0 && i <= totalBillingPages) {
        pages.push(i);
      }
      if (pages.length >= totalDisplayPages) {
        break;
      }
    }
    return pages;
  };

  const handlePrintBillDetails = () => {
    if (showBillDetails && selectedBillDetails) {
      // Create the printable content
      const printContent = `
          <html>
            <head>
              <title>Bill Details</title>
              <style>
                
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid black;
                  padding: 8px;
                }
                .div4563{
                  display: flex;
                  justify-content: center;
                }
                .popup-content {
                  height: 100vh;
                  width: 100vw;
                  overflow-y: auto;
                  padding: 20px;
                  border-radius: 3px;
                  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                  background: #fff;
                 
                  // width: 40%;
                  position: relative;
                }
                .popup-details{
                  width: 140px;
                  margin-top: 0px;
                  font-weight: 500;
                }
                .popup-title {
                  text-align:center;
                  // font-size: large;
                  margin-bottom: 10px;
                }
                .flexchange445589{
                  display: flex;
                  flex-direction: row;
                  margin-bottom: -10px;
                }
                .th89{
                  background-color: rgb(218, 213, 213);
                  border: 1px solid #ccc;
                  padding: 5px;
                  text-align: center;
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
              </style>
            </head>
            <body>
            <div style=" display: flex; justify-content: center;">
              <div class="popup-content">
                <h2 class="popup-title">Bill Details</h2>
                <div style="display: flex; flex-direction: row; margin-bottom: -10px;"><p class="popup-details">Bill Number</p> :&nbsp;&nbsp;&nbsp;&nbsp; ${
                  selectedBillDetails.billNumber
                }</div>
                <div style="display: flex; flex-direction: row; margin-bottom: -10px;"><p class="popup-details">Customer Name</p> :&nbsp;&nbsp;&nbsp;&nbsp; ${
                  selectedBillDetails.customer
                }</div>
                <div style="display: flex; flex-direction: row; margin-bottom: -10px;"><p class="popup-details">Customer Id</p> :&nbsp;&nbsp;&nbsp;&nbsp; ${
                  selectedCustomer.customerId
                }</div>
                <div style="display: flex; flex-direction: row; margin-bottom: -10px;"><p class="popup-details">Bill Date</p> : &nbsp;&nbsp;&nbsp;&nbsp;${formatDate(
                  selectedBillDetails.date
                )}</div>
                <div style="display: flex; flex-direction: row; margin-bottom: -10px;"><p class="popup-details">Discount</p> :&nbsp;&nbsp;&nbsp;&nbsp; ${
                  selectedBillDetails.discountPercent
                }%</div>
                <div style="display: flex; flex-direction: row; margin-bottom: -10px;"><p class="popup-details">GST</p> :&nbsp;&nbsp;&nbsp;&nbsp; ${
                  selectedBillDetails.gstPercent
                }%</div>
                <div style="display: flex; flex-direction: row; margin-bottom: -10px;"><p class="popup-details">Amount Paid</p> :&nbsp;&nbsp;&nbsp;&nbsp; ${
                  selectedBillDetails.totalAmount
                }</div>
                <!-- Display Services Table -->
                <h4 class="popup-subtitle">Services:</h4>
                <table class="popup-table">
                  <thead>
                    <tr>
                      <th className="th89">Service Name</th>
                      <th className="th89">Price</th>
                      <th className="th89">Employee</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${selectedBillDetails.services
                      .map(
                        (service) => `
                        <tr>
                          <td className="td89 td88">${service.serviceName}</td>
                          <td className="td89">₹${service.price}</td>
                          <td className="td89 td88">${service.employee}</td>
                        </tr>
                      `
                      )
                      .join("")}
                  </tbody>
                </table>
                <!-- Display Items Table -->
                <h4 class="popup-subtitle">Items:</h4>
                <table class="popup-table">
                  <thead>
                    <tr>
                      <th className="th89">Item Name</th>
                      <th className="th89">Price</th>
                      <th className="th89">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${selectedBillDetails.items
                      .map(
                        (item) => `
                        <tr>
                          <td className="td89 td88">${item.itemName}</td>
                          <td  className="td89">₹${item.price}</td>
                          <td  className="td89">${item.quantity}</td>
                        </tr>
                      `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
              </div>
            </body>
          </html>
        `;

      // Open a new window for printing
      const printWindow = window.open("", "", "width=600,height=600");
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Initiate the print dialog
      printWindow.print();

      // Close the new window after printing
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    }
  };
  // className="A7custmaindiv"
  return (
    <div className="main-empp">
      {displayComponent === "customerDetails" ? (
        <>
          <div className="customer-container11">
            <h6 className="edit-customer-heading1123">Customers</h6>

            <div className="mdiv">
              <div className="sdiv1">
                {/* <img className="sdiv1img" src={customer.profilePhoto} alt="Customer Avatar" /> */}
                {customer.profilePhoto ? (
                  <img
                    className="sdiv1img"
                    src={`http://localhost:5000/${customer.profilePhoto}`}
                    alt="Customer Avatar"
                  />
                ) : (
                  <FaUserCircle size={"150px"} />
                )}
              </div>
              <div className="sdiv2">
                <div className="A7divlabip">
                  <label className="custdetailslabel">Customer Name</label>
                  :&nbsp;&nbsp;
                  <input
                    className="cd-input"
                    type="text"
                    name="name"
                    value={customer.name}
                    readOnly
                  />
                </div>
                <div className="A7divlabip">
                  <label className="custdetailslabel">DOB</label>:&nbsp;&nbsp;
                  <input
                    className="cd-input"
                    type="text"
                    name="dob"
                    value={formatDate(customer.dob)}
                    readOnly
                  />
                </div>
                <div className="A7divlabip">
                  <label className="custdetailslabel">Email</label>:&nbsp;&nbsp;
                  <input
                    className="cd-input"
                    type="text"
                    name="email"
                    value={customer.email}
                    readOnly
                  />
                </div>
                <div className="A7divlabip">
                  <label className="custdetailslabel">Contact Number</label>
                  :&nbsp;&nbsp;
                  <input
                    className="cd-input"
                    type="text"
                    name="phone"
                    value={customer.phone}
                    readOnly
                  />
                </div>
                <div className="A7divlabip">
                  <label className="custdetailslabel">Address</label>
                  :&nbsp;&nbsp;
                  <input
                    className="cd-input"
                    type="text"
                    name="address"
                    value={customer.address}
                    readOnly
                  />
                </div>
                {/* <div className="A7divlabip">
                <label className="custdetailslabel">Discount</label>
                <input

                  className="cd-input"
                  type="text"
                  name="discount"
                  value={customer.discount}
                  readOnly
                />
              </div> */}
              </div>
            </div>

            <div className="center025">
              {isEditing ? (
                <CustomerDetailsPopup
                  customer={customer}
                  onClose={() => setIsEditing(false)}
                  onSave={handleEditSave}
                />
              ) : (
                <button className="A7editbtn-cust-det" onClick={handleClick}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="customer-container11">
            <h6 className="edit-customer-heading1123">Appointments</h6>
            <div className="padding908">
              <div className="customer-search11">
                <div className="select-number-of-entries">
                  <label>Show </label>
                  <select
                    className="input1"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    {/* Add more options as needed */}
                  </select>
                  <label> entries </label>
                </div>
                <div className="A7serinp">
                  <label> Search </label>
                  <input
                    className="input2"
                    type="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="By Date "
                  />
                </div>
              </div>

              <div>
                <table className="customer-table11">
                  <thead>
                    <tr>
                      <th className="customer-table11-th">Sno.</th>
                      <th className="customer-table11-th">Service Name</th>
                      <th className="customer-table11-th">Date</th>
                      <th className="customer-table11-th">From</th>
                      <th className="customer-table11-th">To</th>
                      <th className="customer-table11-th">Remark</th>
                      <th className="customer-table11-th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems
                      .filter((appointment) =>
                        formatDate(appointment.date)
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((appointment, index) => (
                        <tr key={index}>
                          <td className="customer-table11-td1">{index + 1}</td>
                          <td className="customer-table11-td">
                            <ol>
                              {appointment.selectedServices.map(
                                (service, serviceIndex) => (
                                  <li key={serviceIndex}>{service}</li>
                                )
                              )}
                            </ol>
                          </td>
                          <td className="customer-table11-td1">
                            {formatDate(appointment.date)}
                          </td>
                          <td className="customer-table11-td1">
                            {appointment.fromTiming}
                          </td>
                          <td className="customer-table11-td1">
                            {appointment.toTiming}
                          </td>
                          <td className="customer-table11-td">
                            {appointment.notes}
                          </td>
                          <td className="customer-table11-td1">
                            <button
                              className="app-edit-btn11"
                              onClick={() => handleEditAppnt(appointment)}
                            >
                              Edit
                            </button>
                            <button
                              className="app-delete-btn11"
                              onClick={() => handleDelete(appointment._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="entries-div121">
                <div>
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, appointments.length)} of{" "}
                  {appointments.length} entries
                </div>
                <div>
                  <button className="badges" onClick={handleFirstPageClick}>
                    First
                  </button>
                  <button className="badges" onClick={handlePreviousPageClick}>
                    Previous
                  </button>
                  {getDisplayedPages().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className={`badges ${
                        pageNumber === currentPage ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button className="badges" onClick={handleNextPageClick}>
                    Next
                  </button>
                  <button className="badges" onClick={handleLastPageClick}>
                    Last
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="customer-container11">
            <h6 className="edit-customer-heading1123">Bills Generated</h6>
            <div className="padding908">
              <div className="customer-search11">
                <div className="select-number-of-entries">
                  <label>Show </label>
                  <select
                    className="input1"
                    value={billsPerPage}
                    onChange={handleBillsPerPageChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    {/* Add more options as needed */}
                  </select>
                  <label> entries </label>
                </div>
                <div className="A7serinp">
                  <label> Search </label>
                  <input
                    className="input2"
                    type="search"
                    value={searchBillQuery}
                    onChange={handleBillSearch}
                    placeholder="By Bill Number"
                  />
                </div>
              </div>

              <div>
                <table className="customer-table11">
                  <thead>
                    <tr>
                      <th className="customer-table11-th">Bill No</th>
                      <th className="customer-table11-th">Customer Name</th>
                      <th className="customer-table11-th">Bill Date</th>
                      <th className="customer-table11-th">Discount</th>
                      <th className="customer-table11-th">Amount Paid</th>
                      <th className="customer-table11-th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBillingList
                      .filter((bill) =>
                        bill.billNumber.toLowerCase().includes(searchBillQuery)
                      )
                      .map((bill, index) => (
                        <tr key={index}>
                          <td className="customer-table11-td1">
                            {bill.billNumber}
                          </td>
                          <td className="customer-table11-td">
                            {bill.customer}
                          </td>
                          <td className="customer-table11-td1">
                            {formatDate(bill.date)}
                          </td>
                          <td className="customer-table11-td1">
                            {bill.discountPercent}
                          </td>
                          <td className="customer-table11-td1">
                            {bill.totalAmount}
                          </td>
                          <td className="customer-table11-td1">
                            <button
                              className="bill-details-btn"
                              onClick={() => handleShowBillDetails(bill)}
                            >
                              Details
                            </button>
                            <button
                              className="app-edit-btn11"
                              onClick={() => handleEditBill(index)}
                            >
                              EditBill
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {/* )} */}
              </div>
              <div className="entries-div121">
                <div>
                  Showing {indexOfFirstBilling + 1} to{" "}
                  {Math.min(indexOfLastBilling, billing.length)} of{" "}
                  {billing.length} entries
                </div>
                <div>
                  <button
                    className="badges"
                    onClick={handleBillingFirstPageClick}
                  >
                    First
                  </button>
                  <button
                    className="badges"
                    onClick={handleBillingPreviousPageClick}
                  >
                    Previous
                  </button>
                  {getDisplayedBillingPages().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className={`badges ${
                        pageNumber === currentPageBilling ? "active" : ""
                      }`}
                      onClick={() => handleBillingPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    className="badges"
                    onClick={handleBillingNextPageClick}
                  >
                    Next
                  </button>
                  <button
                    className="badges"
                    onClick={handleBillingLastPageClick}
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          </div>
          {showBillDetails && selectedBillDetails && selectedCustomer && (
            <div className="popup-overlay">
              <div className="popup-content">
                <div className="flexchange445577">
                  <h2 className="popup-title">Bill Details</h2>
                  <button
                    className="popup-close-button89"
                    onClick={handleCloseBillDetails}
                  >
                    X
                  </button>
                </div>
                <div className="flexchange4455">
                  <p className="popup-details">Bill Number</p> : &nbsp;&nbsp;
                  &nbsp;&nbsp;{selectedBillDetails.billNumber}
                </div>
                <div className="flexchange4455">
                  <p className="popup-details">Customer Name</p> : &nbsp;&nbsp;
                  &nbsp;&nbsp;{selectedBillDetails.customer}
                </div>
                <div className="flexchange4455">
                  <p className="popup-details">Customer Id</p> : &nbsp;&nbsp;
                  &nbsp;&nbsp;{selectedCustomer.customerId}
                </div>
                <div className="flexchange4455">
                  <p className="popup-details">Bill Date</p> : &nbsp;&nbsp;
                  &nbsp;&nbsp;{formatDate(selectedBillDetails.date)}
                </div>
                <div className="flexchange4455">
                  <p className="popup-details">Discount</p> : &nbsp;&nbsp;
                  &nbsp;&nbsp;{selectedBillDetails.discountPercent}%
                </div>
                <div className="flexchange4455">
                  <p className="popup-details">GST</p> : &nbsp;&nbsp;
                  &nbsp;&nbsp;{selectedBillDetails.gstPercent}%
                </div>
                <div className="flexchange4455">
                  <p className="popup-details">Amount Paid</p> : &nbsp;&nbsp;
                  &nbsp;&nbsp;{selectedBillDetails.totalAmount}
                </div>

                <h4 className="popup-subtitle">Services :</h4>
                <table className="popup-table67">
                  <thead>
                    <tr>
                      <th className="th89">Service Name</th>
                      <th className="th89">Price</th>
                      <th className="th89">Employee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBillDetails.services.map((service) => (
                      <tr className="td89" key={service.id}>
                        <td className="td89 td88">{service.serviceName}</td>
                        <td className="td89">₹{service.price}</td>
                        <td className="td89 td88">{service.employee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h4 className="popup-subtitle">Items :</h4>
                <table className="popup-table67">
                  <thead>
                    <tr>
                      <th className="th89">Item Name</th>
                      <th className="th89">Price</th>
                      <th className="th89">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBillDetails.items.map((item) => (
                      <tr className="td89" key={item.id}>
                        <td className="td89 td88">{item.itemName}</td>
                        <td className="td89">₹{item.price}</td>
                        <td className="td89 ">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="print285">
                  <button
                    className="popup-print-button"
                    onClick={handlePrintBillDetails}
                  >
                    Print
                  </button>
                </div>
                {/* <button className="popup-close-button" onClick={handleCloseBillDetails}>X</button> */}
              </div>
            </div>
          )}
        </>
      ) : displayComponent === "editBill" ? (
        <div className="editbill">
          {editBillIndex !== null && (
            <EditBill
              data={customer}
              index={editBillIndex}
              onSave={handleEditBillSave}
              onCancel={handleEditBillCancel}
            />
          )}
        </div>
      ) : displayComponent === "editAppnt" ? (
        <div className="editbill">
          {editAppntIndex !== null && (
            <EditAppointments
              data={customer}
              index={customer.appointments.findIndex(
                (appointment) => appointment._id === editAppntIndex._id
              )} // Pass the customer data here
              onSave={handleEditAppntSave}
              onCancel={handleEditAppntCancel}
            />
          )}
        </div>
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default CustomerDetails;
