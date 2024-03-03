import React, { useState, useEffect, useRef } from "react";
import "../styles/AddEmployee.css";
// import PasswordToggle from "./PasswordToggle";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

function AddEmployee({ data, onSave, onCancel }) {
  // console.log(data);
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({
    aadharNo: "",
    panNumber: "",
    phoneNumber: "",
  });
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(
    data
      ? { ...data }
      : {
          employeeName: "",
          username: "",
          password: "",
          phoneNumber: "",
          email: "",
          address: "",
          dob: "",
          age: "",
          aadharNo: "",
          panNumber: "",
        }
  );

  const [setError] = useState(null);
  const [isEditing] = useState(false);

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateAadhar = (value) => {
    const isValid = /^\d{12}(\s?\d{4})?$/.test(value);
    return isValid ? "" : "Invalid Aadhar number";
  };

  const validatePan = (value) => {
    const isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase());
    return isValid ? "" : "Invalid PAN number";
  };

  const validateMobile = (value) => {
    const isValid = /^\d{10}$/.test(value);
    return isValid ? "" : "Please Enter 10 numbers";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Calculate age when DOB is changed
    if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      // Check if the birthday has occurred this year
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          age: age - 1,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          age: age,
        }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    if (name === "aadharNo") {
      setErrors({ ...errors, aadharNo: value ? validateAadhar(value) : "" });
    } else if (name === "panNumber") {
      setErrors({ ...errors, panNumber: value ? validatePan(value) : "" });
    } else if (name === "phoneNumber") {
      setErrors({ ...errors, phoneNumber: value ? validateMobile(value) : "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("employeeName", formData.employeeName);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("aadharNo", formData.aadharNo);
    formDataToSend.append("panNumber", formData.panNumber);
    formDataToSend.append("file", file);

    console.log("formData before API request", formDataToSend);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/employees`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = `${BASE_URL}/uploads/${response.data.filePath}`;
      // window.open(fileUrl);

      toast.success("Employee added successfully!", {
        position: "top-right",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setEmployees([...employees, response.data]);

      setFormData({
        employeeName: "",
        username: "",
        password: "",
        phoneNumber: "",
        email: "",
        address: "",
        dob: "",
        age: "",
        aadharNo: "",
        panNumber: "",
        file: "",
      });
      fileInputRef.current.value = null;

      setFile(null);
    } catch (error) {
      toast.error("Error while adding employee", error);
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/employees`)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        setError("Error fetching employee data.");
      });
  }, [setError]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      employeeName: "",
      username: "",
      password: "",
      phoneNumber: "",
      email: "",
      address: "",
      dob: "",
      age: "",
      aadharNo: "",
      panNumber: "",
    });
  };

  return (
    <div>
      <div className="add-employee-container-saloon2345">
        <h6 className="edit-customer-heading11"> Add Employee </h6>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="employeeName">Employee Name</label>
            </div>
            <input
              className="empinput456"
              type="text"
              id="employeeName"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* <div className="form-group-saloon2345">
            <div className='lable-name-saloon2345'>
              <label htmlFor="username">Username</label>
            </div>
            <input
              className='empinput456'
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div> */}

          {/* <div className="form-group-saloon2345">
            <div className='lable-name-saloon2345'>
              <label htmlFor="password">Password</label>
            </div>

            <label className='icon8907'><PasswordToggle formData={formData} handleInputChange={handleInputChange} /></label>
          </div > */}

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="username">Username</label>
            </div>
            <input
              className="empinput456"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="password">Password</label>
            </div>
            <input
              className="empinput456"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="phoneNumber">Phone Number</label>
            </div>
            <input
              className="empinput456"
              placeholder="1234567890"
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            {errors.phoneNumber && (
              <div style={{ color: "red", marginLeft: "7px" }}>
                {errors.phoneNumber}
              </div>
            )}
          </div>
          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="email">Email</label>
            </div>
            <input
              className="empinput456"
              placeholder="Abc@gmail.com"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="address">Address</label>
            </div>
            <textarea
              className="empinput456"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="dob">Date of Birth</label>
            </div>
            <input
              className="empinput456"
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="age">Age</label>
            </div>
            <input
              className="empinput456"
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="aadharNo">Aadhar Number</label>
            </div>
            <input
              className="empinput456"
              placeholder="000000000000"
              pattern="\d{4} \d{4} \d{4}"
              type="number"
              id="aadharNo"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleInputChange}
              required
            />
            {errors.aadharNo && (
              <div style={{ color: "red", marginLeft: "7px" }}>
                {errors.aadharNo}
              </div>
            )}
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="panNumber">PAN Number</label>
            </div>
            <input
              className="empinput456"
              placeholder="DTYGF4321F"
              type="text"
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              required
            />
            {errors.panNumber && (
              <div style={{ color: "red", marginLeft: "7px" }}>
                {errors.panNumber}
              </div>
            )}
          </div>
          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="file">Upload File</label>
            </div>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
          <div className="emp-btn-flex2345">
            {data ? (
              <>
                <button
                  className="add-employee-button-saloon234567"
                  type="button"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="add-employee-button-saloon2345"
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="add-employee-button-saloon23456789"
                type="submit"
              >
                Add Employee
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddEmployee;
