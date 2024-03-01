import React, { useState, useEffect } from "react";
import "../styles/appointments.css";
import axios from "axios";
import EditAppointments from "./EditAppointments";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const Appointments = ({ onNewAppointmentClick }) => {
  //  const [token,setToken] = useContext(store);
  // const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [searchAppointmentQuery, setSearchAppointmentQuery] = useState("");
  const [displayComponent, setDisplayComponent] = useState("Appointments");
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [currentAppPage, setCurrentAppPage] = useState(1);

  const [appsPerPage, setAppsPerPage] = useState(5);

  // Event handler to update search query state
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter customers based on search query
  // const filteredCustomers = customers.filter((customer) =>
  //   customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // Filter customers based on search query (name or phone)
  // const filteredCustomers = customers.filter((customer) =>
  //   customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredCustomers = customers.filter((customer) => {
    // Check if customer is defined before accessing its properties
    if (customer && customer.name && customer.phone) {
      return (
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return false; // Exclude undefined customers
  });

  const handleAppointmentSearch = (e) => {
    setSearchAppointmentQuery(e.target.value);
  };

  const updatedCustomers = customers.map((customer) => {
    const filteredAppointments = customer.appointments.filter(
      (appointment) =>
        appointment.name
          .toLowerCase()
          .includes(searchAppointmentQuery.toLowerCase()) ||
        appointment.phone.toString().includes(searchAppointmentQuery)
    );

    // Update the customer with the filtered appointments
    return {
      ...customer,
      appointments: filteredAppointments,
    };
  });

  const filteredAppointments = updatedCustomers.flatMap(
    (customer) => customer.appointments
  );

  const handleFilter = () => {
    // Filter appointments based on the selected date range
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    const updatedCustomers = customers.map((customer) => {
      const filteredAppointments = customer.appointments.filter(
        (appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= fromDateObj && appointmentDate <= toDateObj;
        }
      );

      return { ...customer, appointments: filteredAppointments };
    });

    // Update the state with the filtered appointments
    setCustomers(updatedCustomers);
  };

  const handleShowAll = () => {
    // Reset the date filters and refresh the data for the current page
    fetch(`${BASE_URL}/api/customers`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received from API:", data); // Debugging line
        setCustomers(data.reverse());
        setFromDate("");
        setToDate("");
      })

      .catch((error) => {
        console.error("Error fetching billing data:", error);
      });
  };

  const handleShowToday = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format

    // Filter and show only today's records
    const updatedCustomers = customers.map((customer) => {
      const todayAppointments = customer.appointments.filter(
        (appointment) => appointment.date === today
      );
      return { ...customer, appointments: todayAppointments };
    });

    // Update the state with the filtered appointments
    setCustomers(updatedCustomers);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/customers`);
        setCustomers(response.data.reverse());

        // Filter appointments for today
        const today = new Date().toISOString().split("T")[0];
        const todayAppointments = response.data.map((customer) => ({
          ...customer,
          appointments: customer.appointments.filter(
            (appointment) => appointment.date === today
          ),
        }));

        setCustomers(todayAppointments);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);
  // const handleClick = () => {
  //   // Call the callback to update selectedButton
  //   onNewAppointmentClick();
  // };

  // In Appointments.js
  const handleClick = (customerData) => {
    console.log(customerData);

    // Call the callback to update selectedButton and pass the customerData
    onNewAppointmentClick(customerData);
  };

  const handleEdit = (customer, item) => {
    setEditIndex({ customer, item });
    setDisplayComponent("editAppointment"); /// Pass the customer data instead of the index
  };

  const handleEditCancel = () => {
    setDisplayComponent("Appointments");
    // setEditIndex(null);
  };

  const handleEditSave = async (customerData) => {
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

      // Check if the request was successful (status code 200)
      if (response.ok) {
        toast.success("Appointment Updated Successfully!", {
          position: "top-right",
          autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const updatedCustomers = [...customers];
        const customerIndex = updatedCustomers.findIndex(
          (customer) => customer._id === customerData._id
        );

        if (customerIndex !== -1) {
          const appointmentIndex = updatedCustomers[
            customerIndex
          ].appointments.findIndex(
            (appointment) =>
              appointment._id === customerData.appointments[0]._id
          );

          if (appointmentIndex !== -1) {
            updatedCustomers[customerIndex].appointments[appointmentIndex] =
              customerData.appointments[0];
            setCustomers(updatedCustomers);
          }
        }

        setDisplayComponent("Appointments");
      } else {
        console.error("Error updating data:", response.statusText);
        toast.error("Error Updating Appointment");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error Updating Appointment");
    }
  };

  const handleDelete = async (customerId, appointmentId) => {
    try {
      // Display a confirmation toast with custom JSX content
      const confirmToastId = toast(
        <div>
          <p>Are you sure you want to delete this appointment?</p>
          <button
            className="confirm-btn confirm-yes"
            onClick={() => {
              handleConfirmDelete(confirmToastId, customerId, appointmentId);
            }}
          >
            Yes
          </button>
          <button
            className="confirm-btn confirm-no"
            onClick={() => {
              handleCancelDelete(confirmToastId);
            }}
          >
            No
          </button>
        </div>,
        {
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      console.error("Error displaying confirmation toast:", error);
      // Display an error toast with the specific error message
      toast.error(`Error deleting appointment: ${error.message}`);
    }
  };

  const handleConfirmDelete = async (
    confirmToastId,
    customerId,
    appointmentId
  ) => {
    try {
      // Close the confirmation toast
      toast.dismiss(confirmToastId);

      // Send a DELETE request to the server with both customer ID and appointment ID
      await axios.delete(
        `${BASE_URL}/api/customers/${customerId}/appointments/${appointmentId}`
      );

      // Update the state to reflect the deleted appointment
      const updatedCustomers = [...customers];
      const customerIndex = updatedCustomers.findIndex(
        (customer) => customer._id === customerId
      );

      if (customerIndex !== -1) {
        const updatedAppointments = updatedCustomers[
          customerIndex
        ].appointments.filter(
          (appointment) => appointment._id !== appointmentId
        );
        updatedCustomers[customerIndex].appointments = updatedAppointments;
        setCustomers(updatedCustomers);
      }

      // Display a success toast
      toast.success("Appointment deleted successfully!");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // Display an error toast with the specific error message
      toast.error(`Error deleting appointment: ${error.message}`);
    }
  };

  const handleCancelDelete = (confirmToastId) => {
    // Close the confirmation toast
    toast.dismiss(confirmToastId);

    // Display a cancellation toast
    toast.info("Appointment deletion cancelled.");
  };

  const deleteAppointment = async (
    confirmToastId,
    customerId,
    appointmentId,
    closeToast,
    confirmed
  ) => {
    try {
      // Close the confirmation toast
      closeToast();

      // If the user confirmed, send a DELETE request to the server
      if (confirmed) {
        await axios.delete(
          `${BASE_URL}/api/customers/${customerId}/appointments/${appointmentId}`
        );

        // Update the state to reflect the deleted appointment
        const updatedCustomers = [...customers];
        const customerIndex = updatedCustomers.findIndex(
          (customer) => customer._id === customerId
        );

        if (customerIndex !== -1) {
          const updatedAppointments = updatedCustomers[
            customerIndex
          ].appointments.filter(
            (appointment) => appointment._id !== appointmentId
          );
          updatedCustomers[customerIndex].appointments = updatedAppointments;
          setCustomers(updatedCustomers);
        }

        // Display a success toast
        toast.success("Appointment deleted successfully!", {
          autoClose: 800,
        });
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // Display an error toast with the specific error message
      toast.error(`Error deleting appointment: ${error.message}`);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

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

  const indexOfAppLastItem = currentAppPage * appsPerPage;
  const indexOfAppFirstItem = indexOfAppLastItem - appsPerPage;
  const currentAppItems = updatedCustomers.slice(
    indexOfAppFirstItem,
    indexOfAppLastItem
  );
  const totalAppPages = Math.ceil(filteredAppointments.length / appsPerPage);

  const handleAppPageChange = (appPageNumber) => {
    setCurrentAppPage(appPageNumber);
  };

  const handleAppsPerPageChange = (e) => {
    setAppsPerPage(parseInt(e.target.value, 10));
    setCurrentAppPage(1);
  };
  const handleAppFirstPageClick = () => {
    setCurrentAppPage(1);
  };

  const handleAppLastPageClick = () => {
    setCurrentAppPage(totalAppPages);
  };

  const handleAppPreviousPageClick = () => {
    setCurrentAppPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleAppNextPageClick = () => {
    setCurrentAppPage((prevPage) => Math.min(prevPage + 1, totalAppPages));
  };

  const getDisplayedAppPages = () => {
    const totalDisplayAppPages = 3; // Number of pages to display
    const appPages = [];
    for (let i = currentAppPage - 1; i <= currentAppPage + 1; i++) {
      if (i > 0 && i <= totalAppPages) {
        appPages.push(i);
      }
      if (appPages.length >= totalDisplayAppPages) {
        break;
      }
    }
    return appPages;
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  }

  return (
    <div>
      {displayComponent === "Appointments" ? (
        <>
          <div className="customer-container11">
            <h6 className="edit-customer-heading1123">Existing Customers</h6>
            <div className="margin786">
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
                  <label> Entries </label>
                </div>
                <div className="A7serinp">
                  <label> Search &nbsp;</label>
                  <input
                    type="search"
                    className="input2"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder=" Name/Mobile Number"
                  ></input>
                </div>
              </div>

              <table className="customer-table11">
                <thead>
                  <tr>
                    <th className="customer-table11-th">Customer ID</th>
                    <th className="customer-table11-th">Customer Name</th>
                    <th className="customer-table11-th">Mobile Number</th>
                    <th className="customer-table11-th">Address</th>
                    {/* <th className='customer-table11-th'>Discount</th> */}
                    <th className="customer-table11-th">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((customer) => (
                    <tr key={customer.email}>
                      <td className="customer-table11-td1">
                        {customer.customerId}
                      </td>
                      <td className="customer-table11-td">{customer.name}</td>
                      <td className="customer-table11-td1">{customer.phone}</td>
                      <td className="customer-table11-td">
                        {customer.address}
                      </td>
                      {/* <td className='customer-table11-td1'>{customer.discount}</td> */}

                      <td className="customer-table11-td1">
                        {/* <p className='book-text' onClick={handleClick}>Book</p> */}
                        <button
                          className="book-text"
                          onClick={() => handleClick(customer)}
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="entries-div121">
                <div className="number-of-entries-div">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
                  {filteredCustomers.length} Entries
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
            <h6 className="edit-customer-heading1123">Edit Appointments</h6>
            <div className="margin786">
              <div className="customer-search11">
                <div className="select-number-of-entries">
                  <label>Show </label>
                  <select
                    className="input1"
                    value={appsPerPage}
                    onChange={handleAppsPerPageChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    {/* Add more options as needed */}
                  </select>
                  <label> Entries </label>
                </div>
                <div className="A7serinp">
                  <label> Search &nbsp;</label>
                  <input
                    className="input2"
                    type="search"
                    value={searchAppointmentQuery}
                    onChange={handleAppointmentSearch}
                    placeholder="Name/Mobile Number"
                  ></input>
                </div>
              </div>
              <div className="app-filter-div11">
                <div className="flex-change234">
                  <div className="from-div">
                    From &nbsp;
                    <input
                      type="date"
                      id="fromDate"
                      className="date-input-sk654s"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    ></input>
                  </div>
                  <div className="to-div">
                    {" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;To &nbsp;
                    <input
                      type="date"
                      id="toDate"
                      className="date-input-sk654s"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    ></input>
                  </div>

                  <button className="fst filter" onClick={handleFilter}>
                    Filter
                  </button>
                </div>
                <div className="app-filter-buttons11">
                  <button className="fst filter" onClick={handleShowAll}>
                    Show all
                  </button>
                  <button className="fst today" onClick={handleShowToday}>
                    Today
                  </button>
                </div>
              </div>

              <div>
                <table className="customer-table11">
                  <thead>
                    <tr>
                      <th className="customer-table11-th">Customer ID</th>
                      <th className="customer-table11-th">Customer Name</th>
                      <th className="customer-table11-th">Mobile Number</th>
                      <th className="customer-table11-th">Date</th>
                      <th className="customer-table11-th">From</th>
                      <th className="customer-table11-th">To</th>
                      <th className="customer-table11-th">Services</th>
                      <th className="customer-table11-th">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentAppItems.map((customer, customerIndex) =>
                      customer.appointments.map((item, index) => (
                        <tr key={item.id}>
                          <td className="customer-table11-td1">
                            {customer.customerId}
                          </td>
                          <td className="customer-table11-td">{item.name}</td>
                          <td className="customer-table11-td1">{item.phone}</td>
                          <td className="customer-table11-td1">
                            {formatDate(item.date)}
                          </td>
                          <td className="customer-table11-td1">
                            {item.fromTiming}
                          </td>
                          <td className="customer-table11-td1">
                            {item.toTiming}
                          </td>

                          <td className="customer-table11-td">
                            <ol>
                              {item.selectedServices.map(
                                (service, serviceIndex) => (
                                  <li key={serviceIndex}>{service}</li>
                                )
                              )}
                            </ol>
                          </td>

                          <td className="customer-table11-td1">
                            <button
                              className="app-edit-btn11"
                              onClick={() => handleEdit(customer, item)}
                            >
                              Edit
                            </button>
                            <button
                              className="app-delete-btn21"
                              onClick={() =>
                                handleDelete(customer._id, item._id)
                              }
                            >
                              Delete
                            </button>
                            {/* <button className='app-delete-btn11' onClick={() => handleDelete(null, customer._id, item._id)}>Delete</button> */}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="entries-div121">
                  <div className="number-of-entries-div">
                    Showing {indexOfAppFirstItem + 1} to{" "}
                    {Math.min(indexOfAppLastItem, filteredAppointments.length)}{" "}
                    of {filteredAppointments.length} Entries
                  </div>
                  <div>
                    <button
                      className="badges"
                      onClick={handleAppFirstPageClick}
                    >
                      First
                    </button>
                    <button
                      className="badges"
                      onClick={handleAppPreviousPageClick}
                    >
                      Previous
                    </button>
                    {getDisplayedAppPages().map((appPageNumber) => (
                      <button
                        key={appPageNumber}
                        className={`badges ${
                          appPageNumber === currentAppPage ? "active" : ""
                        }`}
                        onClick={() => handleAppPageChange(appPageNumber)}
                      >
                        {appPageNumber}
                      </button>
                    ))}
                    <button className="badges" onClick={handleAppNextPageClick}>
                      Next
                    </button>
                    <button className="badges" onClick={handleAppLastPageClick}>
                      Last
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : displayComponent === "editAppointment" ? (
        <div className="editApp">
          {editIndex !== null && (
            <EditAppointments
              data={editIndex.customer}
              index={editIndex.customer.appointments.findIndex(
                (appointment) => appointment._id === editIndex.item._id
              )}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          )}
        </div>
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default Appointments;
