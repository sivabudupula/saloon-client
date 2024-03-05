import React, { useState } from 'react';
import axios from 'axios';

import '../styles/AddService.css';
import { BASE_URL } from '../Helper/helper';
import { toast , ToastContainer  } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';


const AddService = () => {
  const [service, setService] = useState({
    serviceName: '',
    category: '',
    price: '',
    durationTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // console.log('Service data to be sent:', service); // Log the data being sent
       await axios.post(`${BASE_URL}/api/services`, service);
      toast.success('Service added successfully!', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });


      // Optionally, clear the form fields after a successful submission
      setService({
        serviceName: '',
        category: '',
        price: '',
        durationTime: '',
      });
    } catch (error) {
      toast.error('Error adding service:', error);
    }
  };

  return (
    <div className="main-empp">


    <div className="add-service-container-sk141s"> 
    <h6 className='heading143sk'>Services</h6>
      
      <form onSubmit={handleSubmit} autoComplete='off'>
        <div className="form-group-sk141s">
        <div className='labelchange567'>
          <label htmlFor="serviceName" className="label-sk141s">Service Name:</label>
          </div>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={service.serviceName}
            onChange={handleChange}
            className="input-sk141s" 
            required
          />
        </div>
        <div className="form-group-sk141s"> 
        <div className='labelchange567'>
          <label htmlFor="category" className="label-sk141s">Category:</label>
          </div>
          <select
            id="text"
            name="category"
            value={service.category}
            onChange={handleChange}
            className="select-sk141s" 
            required
          >
             <option value="">Select category</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Others</option>
            
          </select>
        </div>
        <div className="form-group-sk141s"> 
        <div className='labelchange567'>
          <label htmlFor="price" className="label-sk141s">Price:</label>
          </div>
          <input
            type="number"
            id="price"
            name="price"
            value={service.price}
            onChange={handleChange}
            className="input-sk141s"
            required
          />
        </div>
        <div className="form-group-sk141s">
        <div className='labelchange567'>
          <label htmlFor="durationTime" className="label-sk141s">Duration Time:</label>
          </div>
          <input
            type="time"
            id="durationTime"
            name="durationTime"
            value={service.durationTime}
            onChange={handleChange}
            className="input-sk141s"
            required
          />
        </div>
        <div className='buttons143sk'>
        <button type="submit" className="submit-button-sk141s">Save</button>

        
          {/* <button className="cancel-button-sk141s">Cancel</button> */}
        
        </div>
      </form>
    </div>
    <ToastContainer />
    </div>
  );
};

export default AddService;
