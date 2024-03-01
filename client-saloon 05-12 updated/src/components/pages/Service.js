import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";
import EditService from "./EditService";
import "../styles/Service.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceForm = ({ onNewServiceClick }) => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [displayComponent, setDisplayComponent] = useState("Services");

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

  const handleClick = () => {
    // Call the callback to update selectedButton
    onNewServiceClick();
  };

  const handleEditCancel = () => {
    setDisplayComponent("Services");
    // setEditIndex(null);
  };

  const handleEdit = (serviceId) => {
    if (!serviceId) {
      toast.warn("Please select a serviceName before editing.");
      return;
    }

    // Find the selected service based on the serviceId
    // const serviceToEdit = services.find((service) => service._id === serviceId);
    setSelectedServiceId(serviceId);
    setIsEditing(true);
    setDisplayComponent("editService");
  };

  const handleSaveEdit = (editedService) => {
    const updatedServices = services.map((service) =>
      service._id === editedService._id ? editedService : service
    );
    setServices(updatedServices);
    setIsEditing(false);
    setDisplayComponent("Services");
    setSelectedServiceId("");
  };

  // const handleDeleteService = async (deletedServiceId) => {

  //     const updatedServices = services.filter((service) => service._id !== deletedServiceId);
  //     setServices(updatedServices);
  //     setDisplayComponent('Services');
  //     alert('Service Deleted Successfully');

  // };

  const handleDelete = async (selectedServiceId) => {
    if (!selectedServiceId) {
      toast.warn("Please select a service name before deleting.");
      return;
    }
    // Show a confirmation toast before deleting
    toast.info(
      <>
        Are you sure you want to delete this service?
        <button onClick={() => handleConfirmDelete(selectedServiceId)}>
          Yes
        </button>
        <button onClick={handleCancelDelete}>No</button>
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

  const handleConfirmDelete = async (selectedServiceId) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/services/${selectedServiceId}`
      );

      const updatedServices = services.filter(
        (service) => service._id !== selectedServiceId
      );
      setServices(updatedServices);
      setDisplayComponent("Services");
      setSelectedServiceId("");
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Error deleting service. Please try again.");
    }
  };
  const handleCancelDelete = () => {
    toast.dismiss(); // Close the confirmation toast
  };

  return (
    <div className="service-form-container-sk141"> 
      {displayComponent === "Services" ? (
        <>
          <h6 className="heading6789">Services</h6>
          <div className="second-con678">
            <div className="sk1432s">
              <label className="service-label-sk141">Service Name</label>&nbsp;:
              <select   
                className="service-select-sk141"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                <option value="">Select a Service Name</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.serviceName}&nbsp;&nbsp;({service.category})
                  </option>
                ))}
              </select>
            </div>
          </div>   
          <div className="add-edit-buttons-container">
            <button className="add-button-sk141" onClick={handleClick}>
              Add New
            </button>
            {services.length > 0 && (
              <button
                className="save-button-sk141"
                onClick={() => handleEdit(selectedServiceId)}
              >
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={() => handleDelete(selectedServiceId)}
              className="delete-button-sk142sk"
            >
              Delete
            </button>
          </div>
        </>
      ) : displayComponent === "editService" ? (
        // <div className='margin-left789'>  
        <div className="changeedit248">
          {isEditing !== null && (
            <EditService
              selectedService={services.find(
                (service) => service._id === selectedServiceId
              )}
              onSave={handleSaveEdit}
              // onDelete={handleDeleteService}
              onCancelEdit={handleEditCancel}
            />
          )}
        </div>
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default ServiceForm;
