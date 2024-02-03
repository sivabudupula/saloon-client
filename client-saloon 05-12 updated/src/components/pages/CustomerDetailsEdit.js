import React, { useState } from 'react';
import '../styles/CustomerDetailsEdit.css';

const CustomerDetailsPopup = ({ customer, onSave, onClose }) => {
   const [editedCustomer, setEditedCustomer] = useState(customer);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({
      ...editedCustomer,
      [name]: value
    });
  };

  const handleSaveClick = () => {
    onSave(editedCustomer);
    onClose();
  };
  
  return (
    <div className="A7-customer-details-popup">
      <div className='A7-cust-edit-content-popup'>
        <div><h5 className='A7-cust-popup-h5'> Edit Customer Details</h5></div>
        <div className='A7-cust-edit-popup-close'>
          <button className='btn0011' onClick={onClose}>x</button>
        </div>
      </div><br/>
      <div className='margin184'>
      <label className='label203'>Name</label> 
      <input className='A7-cust-popup-input'
        type="text"
        name="name"
        value={editedCustomer.name}
        onChange={handleInputChange}
      />
      </div>
      <div className='margin184'>
      <label className='label203'>D O B</label>
      <input className='A7-cust-popup-input'
        type="date"
        name="dob"
        value={editedCustomer.dob}
        onChange={handleInputChange}
        required
      />
      </div>
      <div className='margin184'>
        <label className='label203'>Email</label>
      <input className='A7-cust-popup-input'
        type="text"
        name="email"
        value={editedCustomer.email}
        onChange={handleInputChange}
      />
      </div>
      <div className='margin184'>
      <label className='label203'>Phone No.</label>
      <input className='A7-cust-popup-input'
        type="text"
        name="phone"
        value={editedCustomer.phone}
        onChange={handleInputChange}
      />
      </div>
      <div className='margin184'>
      <label className='label203'>Address</label>
      <input className='A7-cust-popup-input'
        type="text"
        name="address"
        value={editedCustomer.address}
        onChange={handleInputChange}
      />
      </div>
      {/* <div className='margin184'>
      <label className='label203'>Discount (%)</label>
      <input className='A7-cust-popup-input'
        type="text"
        name="discount"
        value={editedCustomer.discount}
        onChange={handleInputChange}
      />
      </div> */}
      <div className='btn123'>
      <button type='button' className='A7-cust-popup-button' onClick={handleSaveClick}>Save</button>
    </div>
    </div>
  );
};

export default CustomerDetailsPopup;