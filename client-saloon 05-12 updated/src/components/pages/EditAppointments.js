import React, { useState, useEffect } from "react";
import "../styles/EditAppointments.css";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";

const EditAppointments = ({ data, index, onSave, onCancel }) => {
  console.log(data);
  console.log(index);
  // const [editedData, setEditedData] = useState({ ...data, services: [] });
  // const [editedData, setEditedData] = useState({ ...data.appointments[0], services: [] });
  const [customerData, setCustomerData] = useState(data);
  const [editedData, setEditedData] = useState(
    data.appointments && data.appointments.length > 0
      ? { ...data.appointments[index], services: [] }
      : {
          /* Provide a default value if necessary */
        }
  );

  const [selectedServices, setSelectedServices] = useState([]);
  const [popupData, setPopupData] = useState(null);
  // const [displaySelected, setDisplaySelected] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (editedData.selectedServices && editedData.selectedServices.length > 0) {
      setSelectedServices(editedData.selectedServices);
    }
  }, [editedData.selectedServices]);

  useEffect(() => {
    // Fetch data from your Express.js backend when the component mounts
    axios
      .get(`${BASE_URL}/api/services`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  // useEffect(() => {
  //   // You can update the 'data' state here based on 'editedData'
  //   setCustomerData({ ...data, appointments: [editedData] });
  // }, [editedData]);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedAppointments = [
      ...customerData.appointments,
      (customerData.appointments[index] = {
        ...editedData,
        selectedServices: selectedServices,
      }),
    ]; // Make a copy of existing appointments
    updatedAppointments[index] = {
      ...editedData,
      selectedServices: selectedServices,
    }; // Update the specific appointment

    // Update the customerData state with the updated appointments
    setCustomerData({
      ...customerData,
      appointments: updatedAppointments,
    });

    onSave(editedData); // Optionally, you can pass the updated customerData to onSave
  };

  // const handleSave = (e) => {
  //   e.preventDefault();
  //   const updatedAppointments = [...customerData.appointments];
  //   const updatedAppointment = { ...editedData, selectedServices: selectedServices };
  //   updatedAppointments[index] = updatedAppointment;

  //   // Update the customerData state with the updated appointments
  //   setCustomerData({
  //     ...customerData,
  //     appointments: updatedAppointments,
  //   });

  //   // Optionally, you can pass the updated customerData to onSave
  //   onSave(customerData);
  // };

  const openPopup = (item) => {
    setPopupData(true);
  };

  const closePopup = () => {
    setPopupData(null);
    // Reset display when closing the popup
  };

  const handleCheckboxChange = (label) => {
    // Check if the label is already in the selected services
    if (selectedServices.includes(label)) {
      // If it's already selected, deselect it by filtering it out
      setSelectedServices(
        selectedServices.filter((service) => service !== label)
      );
    } else {
      // If it's not selected, select it by adding it to the array
      setSelectedServices([...selectedServices, label]);
    }
  };

  return (
    <div className="edit-main11">
      <div className="appnt-form11">
        <h5 className="appnt-heading11">Appointment Details</h5>

        <form>
          <div className="appntform-group11">
            <label htmlFor="name" className="appnt-label11">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleChange}
              required
              className="text-input11"
            ></input>
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">Address</label>
            <textarea
              type="text"
              name="address"
              className="customer-inputa7"
              value={editedData.address}
              onChange={handleChange}
              required
              rows="3"
              cols="40"
            ></textarea>{" "}
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">Phone</label>
            <input
              type="tel"
              name="phone"
              value={editedData.phone}
              onChange={handleChange}
              className="text-input11"
              required
            ></input>
          </div>

          {/* <div  className='appntform-group11'>
     <label className='appnt-label11'>Provide Discount</label>
     <input type="text"
      name="discount"
      value={editedData.discount}
      onChange={handleChange}
      required
      className='text-input11'
     ></input></div> */}

          <div className="appntform-group11">
            <label className="appnt-label11">Services</label>
            <div className="flex-category390">
              <div className="selected-services12">
                <ol className="ol897">
                  {/* {editedData.selectedServices &&
                editedData.selectedServices.length > 0 ? (
                editedData.selectedServices.map((service, index) => (
                  <li key={index}>{service}</li>
                ))
              ) : null}
             */}
                  {selectedServices.length > 0 && (
                    <div className="selected-services">
                      {/* <h6>Selected Services:</h6> */}

                      {selectedServices.map((service, index) => (
                        <li className="li78" key={index}>
                          {service}
                        </li>
                      ))}
                    </div>
                  )}
                </ol>
              </div>

              <div>
                <button
                  type="button"
                  className="servbtn11"
                  onClick={() => openPopup()}
                >
                  + Add Services
                </button>
              </div>
            </div>
          </div>
          <div className="appntform-group11">
            <label className="appnt-label11">Date</label>
            <input
              type="date"
              name="date"
              value={editedData.date}
              onChange={handleChange}
              required
              className="small-input1122"
            ></input>
          </div>

          <div className="appntform-group11">
            {" "}
            <label className="appnt-label11">Timings </label>
            <input
              type="time"
              name="fromTiming"
              value={editedData.fromTiming}
              onChange={handleChange}
              required
              className="small-input1133"
            ></input>
            &nbsp;&nbsp; To &nbsp;&nbsp;
            <input
              type="time"
              name="toTiming"
              value={editedData.toTiming}
              onChange={handleChange}
              required
              className="small-input1133"
            ></input>
          </div>

          {/* <div  className='appntform-group11'> 
    <label className='appnt-label11'>Advance</label>
    <input type="text"
     name="advance"
     value={editedData.advance}
     onChange={handleChange}
     required
     className='text-input11'
    ></input></div> */}

          <div className="appntform-group11">
            <label className="appnt-label11">Notes</label>
            <textarea
              name="notes"
              className="customer-inputa7"
              value={editedData.notes}
              onChange={handleChange}
              required
              rows="4"
              cols="40"
            ></textarea>
          </div>

          <div className="bookbtn-div11">
            <button type="submit" className="bookbtn11" onClick={handleSave}>
              Book
            </button>
            <button className="cancel-btn11" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {popupData && (
        <div className="popupsk14">
          <div className="popup-contentsk14">
            <div className="btnend234">
              <h5>Select the Services</h5>
              <button className="btn567" onClick={closePopup}>
                X
              </button>
            </div>
            <div className="men-women">
              <div className="flex0033">
                <h5 className="h58">Men Category</h5>
                <div className="men-category">
                  {services
                    .filter((service) => service.category === "Male")
                    .map((service) => (
                      <div className="service-item" key={service._id}>
                        <input
                          type="checkbox"
                          onChange={() =>
                            handleCheckboxChange(`Men - ${service.serviceName}`)
                          }
                          checked={selectedServices.includes(
                            `Men - ${service.serviceName}`
                          )}
                          style={{ marginLeft: "8px" }}
                          className="custom-checkbox"
                        />
                        <label className="lableup123">{`Men - ${service.serviceName}`}</label>
                        <span className="size293">Rs - {service.price}</span>
                        <span className="size2935">
                          Time: {service.durationTime}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex0033">
                <h5 className="h58">Women Category</h5>
                <div className="women-category">
                  {services
                    .filter((service) => service.category === "Female")
                    .map((service) => (
                      <div className="service-item" key={service._id}>
                        <input
                          type="checkbox"
                          onChange={() =>
                            handleCheckboxChange(
                              `Women - ${service.serviceName}`
                            )
                          }
                          checked={selectedServices.includes(
                            `Women - ${service.serviceName}`
                          )}
                          style={{ marginLeft: "8px" }}
                          className="custom-checkbox"
                        />
                        <label className="lableup123">{`Women - ${service.serviceName}`}</label>
                        <span className="size293">Rs - {service.price}</span>
                        <span className="size2935">
                          Time: {service.durationTime}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAppointments;
