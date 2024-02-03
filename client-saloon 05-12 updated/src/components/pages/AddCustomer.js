import React, { useState, useRef } from "react";
import "../styles/AddCustomer.css";
import Axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper"

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [previewImage, setPreviewImage] = useState(null);
  const [, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const handleProfileLogoChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
    setFormData((prevFormData) => ({
      ...prevFormData,
      profilePhoto: file,
    }));
  };

  // const openFileInput = () => {
  //   fileInputRef.current.click();
  // };
  const openFileInput = (e) => {
    e.preventDefault(); // Prevent the default form submission
    fileInputRef.current.click();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("dob", formData.dob);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("address", formData.address);
      formDataToSubmit.append("phone", formData.phone);
      formDataToSubmit.append("profilePhoto", formData.profilePhoto);

      // Send the form data to the backend
      const response = await Axios.post(
        `${BASE_URL}/api/customers`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      // Handle success (you can redirect or display a success message here)
      // window.alert("Data submitted successfully!");
      toast.success("Customer added successfully!", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setFormData({
        name: "",
        dob: "",
        email: "",
        address: "",
        phone: "",
        profilePhoto: "",
      });
    } catch (error) {
      console.error(error);
      // Handle error (display an error message or take appropriate action)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="A7custmaindiv86">
      <div>
        <form onSubmit={handleFormSubmit} autoComplete="off">
          <h5 className="add-cus-heading">Add New Customer</h5>

          <div className="flexchange190">
            <div className="width890">
              <div className="form-group">
                <label className="custlabel">Name</label>
                <input
                  className="customer-inputa7"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter a Name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="custlabel">DOB</label>
                <input
                  className="customer-date-input"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name" className="custlabel">
                  Email
                </label>
                <input
                  className="customer-inputa7"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="custlabel">Address</label>
                <textarea
                  className="customer-inputa7"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  cols="40"
                  required
                />
              </div>
              <div className="form-group">
                <label className="custlabel">Phone</label>
                <input
                  className="customer-inputa7"
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  required
                />
              </div>
            </div>
            <div className="width8989">
              <div className="form-group78">
                <div className="profile-image" onClick={openFileInput}>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="avatar img-circle"
                      // style={{
                      //   borderRadius: "50%",
                      //   width: "200px",
                      //   height: "200px",
                      // }}
                    />
                  ) : (
                    <div className="form-group789">
                      <FaUserCircle className="image4567" />
                      <button className="name1890">Upload your photo</button>
                    </div>
                  )}
                </div>

                <input
                  className="image4567"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileLogoChange}
                  ref={fileInputRef}
                  style={{
                    position: "absolute",
                    top: "-9999px", // Move off-screen
                    left: "-9999px", // Move off-screen
                  }}
                />
              </div>
            </div>
          </div>
          {/* <div className='form-group'>
            <label className='custlabel'>Provide Discount</label>
            <input
            type='number'
              className='dis'
              name='discount'
              value={formData.discount}
              onChange={handleInputChange}
              placeholder='0.00'
              
            />
          </div> */}
          <div className="disdiv">
            <button type="submit" className="bookbtn11">
              Add
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCustomer;

// import React, { useState, useRef } from "react";
// import axios from "axios";
// import "./Profile.css";
// import { FaUserCircle } from "react-icons/fa";

// const Profileform = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     clientname: "",
//     email: "",
//     projectname: "",
//     status: "",
//     value: "",
//     profilePhoto: null, // Store the profile photo here
//   });

//   const [previewImage, setPreviewImage] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleProfileLogoChange = (e) => {
//     const file = e.target.files[0];

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPreviewImage(event.target.result);
//     };
//     reader.readAsDataURL(file);

//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       profilePhoto: file,
//     }));
//   };

//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const formDataToSubmit = new FormData();
//       formDataToSubmit.append("clientname", formData.clientname);
//       formDataToSubmit.append("email", formData.email);
//       formDataToSubmit.append("projectname", formData.projectname);
//       formDataToSubmit.append("status", formData.status);
//       formDataToSubmit.append("value", formData.value);
//       formDataToSubmit.append("profilePhoto", formData.profilePhoto, formData.profilePhoto.name); // Include the original file name

//       // Send the form data to the backend
//       const response = await axios.post(
//         "http://localhost:5000/api/profiles", // Update the URL to match your backend API endpoint
//         formDataToSubmit,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log(response);

//       // Handle success (you can redirect or display a success message here)
//       window.alert("Data submitted successfully!");
//       onLogin();
//     } catch (error) {
//       console.error(error);
//       // Handle error (display an error message or take appropriate action)
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const openFileInput = () => {
//     fileInputRef.current.click();
//   };

//   const formbody = {
//     // backgroundImage: 'url("https://hbr.org/resources/images/article_assets/2014/02/Feb14_02_108315569.jpg")'
//     backgroundSize: "cover",
//     backgroundColor: "transparent",
//     backgroundImageRepeat: "no-repeat",
//     minHeight: "100vh",
//     flexDirection: "row",
//     maxWidth: "30vw",
//     marginLeft: "25vw",
//   };

//   return (
//     <div className="formbody" style={formbody}>
//       <div className="form-containerp">
//         <h2 className="profilee">Profile Form</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <div class="profileimage">
//               <div className="profile-image" onClick={openFileInput}>
//                 {previewImage ? (
//                   <img
//                     src={previewImage}
//                     alt="Profile Preview"
//                     className="avatar img-circle"
//                     style={{
//                       borderRadius: "50%",
//                       width: "100px",
//                       height: "100px",
//                     }}
//                   />
//                 ) : (
//                   <FaUserCircle size={"100px"} />
//                 )}
//                 <label>Upload your photo</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleProfileLogoChange}
//                   ref={fileInputRef}
//                   style={{
//                     position: "absolute",
//                     top: "-9999px", // Move off-screen
//                     left: "-9999px", // Move off-screen
//                   }}
//                   required
//                 />
//               </div>
//             </div>
//             <label htmlFor="name">Client Name*</label>
//             <input
//               type="text"
//               id="clientname"
//               name="clientname"
//               value={formData.clientname}
//               onChange={handleChange}
//               data-aos="fade-right"
//               required
//             />
//           </div>

//           <div className="form-groupp">
//             <label htmlFor="email">Email*</label>
//             <input
//             style={{backgroundColor:'aliceblue'}}
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               data-aos="fade-right"
//               required
//             />
//           </div>

//           <div className="form-groupp">
//             <label htmlFor="designation">Project Name*</label>
//             <input
//             style={{backgroundColor:'aliceblue'}}
//               type="text"
//               id="projectname"
//               name="projectname"
//               value={formData.projectname}
//               onChange={handleChange}
//               data-aos="fade-right"
//               required
//             />
//           </div>

//           <div className="form-groupp">
//             <label htmlFor="status">Status*</label>
//             <select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               data-aos="fade-right"
//               required
//             >
//               <option value="">Select Status</option>
//               <option value="excellent">Excellent</option>
//               <option value="good">Good</option>
//               <option value="fair">Fair</option>
//               <option value="poor">Poor</option>
//             </select>
//           </div>

//           <div className="form-groupp">
//             <label htmlFor="experience">Value*</label>
//             <input
//               type="text"
//               id="value"
//               name="value"
//               value={formData.value}
//               onChange={handleChange}
//               data-aos="fade-right"
//               required
//             />
//           </div>

//           <div className="form-groupp">
//             <button type="submit" disabled={submitting} data-aos="fade-up">
//               {submitting ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profileform;
