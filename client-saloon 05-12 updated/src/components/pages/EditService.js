import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EditService.css';
import { toast , ToastContainer  } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helper/helper';


const EditService = ({ selectedService, onSave,  onCancelEdit }) => {
  const [editedService, setEditedService] = useState(selectedService);
  // const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedService(selectedService);
  }, [selectedService]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedService({ ...editedService, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/api/services/${editedService._id}`, editedService);
      onSave(editedService);
      toast.success('Service Edited successfully!', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Error updating service:', error);
    }
  };

  // const handleDelete = async () => {
  //   try {
  //     await axios.delete(`${BASE_URL}/api/services/${editedService._id}`);
  //     onDelete(editedService._id);
  //     alert('Service Deleted Successfully');
  //   } catch (error) {
  //     console.error('Error deleting service:', error);
  //   }
  // };

  return (
    <div className="edit-service-container-sk142sk">
      <h5 className='heading6789'>Edit Service</h5>
     
      <div className='flextochange90'>
        <div className='labelchange567'>
        <label className="label-sk142sk">Service Name :</label>
        </div>
        <input
         required
          type="text"
          name="serviceName"
          value={editedService.serviceName}
          onChange={handleInputChange}
          className="input-sk142sk"
        />
      </div>
      <div className='flextochange90'>
      <div className='labelchange567'>
        <label className="label-sk142sk">Category :</label>
        </div>
        <input
          type="text"
          name="category"
          value={editedService.category}
          onChange={handleInputChange}
          className="input-sk142sk"
          required
        />
      </div>
      <div className='flextochange90'>
      <div className='labelchange567'>
        <label className="label-sk142sk">Price :</label>
        </div>
        <input
          type="text"
          name="price"
          value={editedService.price}
          onChange={handleInputChange}
          className="input-sk142sk"
          required
        />
      </div>
      <div className='flextochange90'>
      <div className='labelchange567'>
        <label className="label-sk142sk">Duration Time :</label>
        </div>
        <input
          type="text"
          name="durationTime"
          value={editedService.durationTime}
          onChange={handleInputChange}
          className="input-sk142sk"
          required
        />
      </div>
      <div className='buttons567'>
      <button type="button" onClick={handleSave} className="save-button-sk142sk">
        Save
      </button>

      {/* <button type="button" onClick={handleDelete} className="delete-button-sk142sk">
        Delete
      </button> */}

      
      <button type="button" onClick={onCancelEdit} className="delete-button-sk142sk">
          Cancel 
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default EditService;
