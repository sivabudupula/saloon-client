import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEmployee from "./AddEmployee";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classnames from "classnames";
import { BASE_URL } from "../Helper/helper";

const ConfirmToast = ({ message, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm();
    toast.dismiss(); // Close the toast after confirming
  };

  const handleCancel = () => {
    onCancel();
    toast.dismiss(); // Close the toast after canceling
  };

  return (
    <div>
      <div>{message}</div>
      <button onClick={handleConfirm}>Yes</button>
      <button onClick={handleCancel}>No</button>
    </div>
  );
};

const EmployeeDetailsPopup = ({ employee, onClose }) => {
  return (
    <div className="popup-container-sk9879">
      <div className="popup-content-sk9879">
        <button className="close-btn-sk9879" onClick={onClose}>
          &times;
        </button>
        <h2 className="h28">Employee Details</h2>
        <div className="abc1234">
          <p>
            <label className="align100px">ID</label>:&nbsp;&nbsp;&nbsp;{" "}
            {employee.employeeId}
          </p>
          <p>
            <label className="align100px">Name</label>: &nbsp;&nbsp;&nbsp;
            {employee.employeeName}
          </p>
          <p>
            <label className="align100px">MobileNumber</label>:
            &nbsp;&nbsp;&nbsp;{employee.phoneNumber}
          </p>
          <p>
            <label className="align100px">Email</label>: &nbsp;&nbsp;&nbsp;
            {employee.email}
          </p>
          <p>
            <label className="align100px">DOB</label>: &nbsp;&nbsp;&nbsp;
            {employee.dob}
          </p>
          <p>
            <label className="align100px">Aadhar No</label>: &nbsp;&nbsp;&nbsp;
            {employee.aadharNo}
          </p>
          <p>
            <label className="align100px">Pan</label>: &nbsp;&nbsp;&nbsp;
            {employee.panNumber}
          </p>
          <p>
            <label className="align100px">Address</label>: &nbsp;&nbsp;&nbsp;
            {employee.address}
          </p>
          <p>
            <label className="align100px">File</label>:&nbsp;&nbsp;&nbsp;
            {employee.filePath && (
              <a
                href={`${BASE_URL}/uploads/${employee.filePath
                  .split("\\")
                  .pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                View File
              </a>
            )}
          </p>
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
  );
};
const Employees = ({ onNewEmployeeClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);
  // const [editingEmployee, setEditingEmployee] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [editIndex, setEditIndex] = useState(null);
  const [displayComponent, setDisplayComponent] = useState("Employees");

  const handleEdit = (employee) => {
    setEditIndex(employee);
    setDisplayComponent("editEmployee");
    console.log("Updated displayComponent in handleEdit:", displayComponent);
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setDisplayComponent("Employees");
  };

  const handleClick = () => {
    // Call the callback to update selectedButton
    onNewEmployeeClick();
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/employees`)
      .then((response) => {
        setEmployees(response.data.reverse());
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleActivate = (employeeId) => {
    // Show an info toast to confirm activation
    toast.info(
      <>
        Are you sure you want to activate this employee?
        <button onClick={() => confirmActivation(employeeId)}>Yes</button>
        <button onClick={handleCancel}>No</button>
      </>,
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
  };
  
  const handleDeactivate = (employeeId) => {
    // Show an info toast to confirm deactivation
    toast.info(
      <>
        Are you sure you want to deactivate this employee?
        <button onClick={() => confirmDeactivation(employeeId)}>Yes</button>
        <button onClick={handleCancel}>No</button>
      </>,
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
  };
  
  const confirmActivation = (employeeId) => {
    // Close the toast
    toast.dismiss();
  
    // Make the API call to activate the employee
    axios
      .put(`${BASE_URL}/api/employees/activate/${employeeId}`)
      .then((response) => {
        // Handle success response
        console.log("Employee activated successfully:", response.data);
  
        // Update the state to reflect the changes
        const updatedEmployees = employees.map((employee) => {
          if (employee._id === response.data._id) {
            return { ...employee, isActive: true };
          }
          return employee;
        });
        setEmployees(updatedEmployees);
  
        // Show success toast
        toast.success("Employee successfully activated!");
      })
      .catch((error) => {
        // Handle error
        console.error("Error activating employee:", error);
        // You can show an error message or perform any other actions here
      });
  };
  
  const confirmDeactivation = (employeeId) => {
    // Close the toast
    toast.dismiss();
  
    // Make the API call to deactivate the employee
    axios
      .put(`${BASE_URL}/api/employees/deactivate/${employeeId}`)
      .then((response) => {
        // Handle success response
        console.log("Employee deactivated successfully:", response.data);
  
        // Update the state to reflect the changes
        const updatedEmployees = employees.map((employee) => {
          if (employee._id === response.data._id) {
            return { ...employee, isActive: false };
          }
          return employee;
        });
        setEmployees(updatedEmployees);
  
        // Show success toast
        toast.success("Employee successfully deactivated!");
      })
      .catch((error) => {
        // Handle error
        console.error("Error deactivating employee:", error);
        // You can show an error message or perform any other actions here
      });
  };
  
  const handleCancel = () => {
    // Close the toast
    toast.dismiss();
  };
  
  

  const handleEditSave = (EmployeeData) => {
    axios
      .put(`${BASE_URL}/api/employees/${EmployeeData._id}`, EmployeeData)
      .then((response) => {
        const updatedEmployees = employees.map((employee) => {
          if (employee._id === response.data._id) {
            return response.data;
          }
          return employee;
        });
        setEmployees(updatedEmployees);

        setDisplayComponent("Employees");
        setError(null);

        // Display success toast
        const toastClassName = classnames({
          "Toastify__toast--success234": true,
          "Toastify__toast--error234": false,
          "Toastify__toast--info234": false,
          "Toastify__toast--warning234": false,
        });

        toast.success("Employee updated successfully!", {
          autoClose: 3000,
          className: toastClassName,
        });
      })
      .catch((error) => {
        setError("Error updating employee data.");

        // Display error toast
        const toastClassName = classnames({
          "Toastify__toast--success234": false,
          "Toastify__toast--error234": true,
          "Toastify__toast--info234": false,
          "Toastify__toast--warning234": false,
        });

        toast.error("Error updating employee data!", {
          className: toastClassName,
        });
      });
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    const employeeName = employee.employeeName || "";
    const phoneNumber = employee.phoneNumber || "";
    return (
      employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneNumber.includes(searchQuery)
    );
  });

  // Calculate the indexes of the first and last item to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

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
  const getDisplayedPages = () => {
    const totalDisplayPages = 3;
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

  const handleDetailsClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="main-empee">
      {displayComponent === "Employees" ? (
        <>
          <div className="customer-container11">
            <h6 className="edit-customer-heading1123">Employees</h6>
            <div className="margin786">
              <button className="pdadd-btn12" onClick={handleClick}>
                {" "}
                + Add Employee
              </button>
              <div className="customer-search11">
                <div className="select-number-of-entries">
                  <label>Show</label>
                  <select
                    className="input1"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                  <label> Entries </label>
                </div>
                <div className="A7serinp">
                  <label>Search </label>
                  <input
                    type="text"
                    placeholder="Name or phone number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input2"
                  />
                </div>
              </div>
              <table className="table-saloon2345">
                <thead>
                  <tr className="tr-saloon2345">
                    <th className="th-saloon2345">Employee ID</th>
                    <th className="th-saloon2345">Employee Name</th>
                    <th className="th-saloon2345">Mobile Number</th>
                    <th className="th-saloon2345">Email</th>
                    <th className="th-saloon2345">Address</th>
                    <th className="th-saloon2345">User Name</th>
                    <th className="th-saloon2345">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((employee, index) => (
                    <tr key={employee._id} className="tr-saloon2345">
                      <td
                        className="td-saloon23456 td-saloon2345900 width30"
                        onClick={() => handleDetailsClick(employee)}
                      >
                        {employee.employeeId}
                      </td>
                      <td
                        className="td-saloon2345900"
                        onClick={() => handleDetailsClick(employee)}
                      >
                        {employee.employeeName}
                      </td>
                      <td className="td-saloon23456">{employee.phoneNumber}</td>
                      <td className="td-saloon2345">{employee.email}</td>
                      <td className="td-saloon2345">{employee.address}</td>
                      <td className="td-saloon2345">
                        {employee.username}
                      </td>

                      <td className="td-saloon23456">
                        <button
                          className="app-edit-btn11"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </button>
                        {/* Replace Delete button with Activate and Deactivate buttons */}
                        {employee.isActive ? (
                          <button
                            className="app-edit-btn112 deactivate-btn"
                            onClick={() => handleDeactivate(employee._id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="app-edit-btn112 activate-btn"
                            onClick={() => handleActivate(employee._id)}
                          >
                            Activate
                          </button>
                        )}
                       
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="customer-search11">
                <div>
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
                  {filteredEmployees.length} Entries
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
        </>
      ) : displayComponent === "editEmployee" ? (
        <div>
          {editIndex !== null && (
            <AddEmployee
              data={editIndex}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          )}
        </div>
      ) : null}
      {selectedEmployee && (
        <EmployeeDetailsPopup
          employee={selectedEmployee}
          onClose={handleCloseDetails}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default Employees;
