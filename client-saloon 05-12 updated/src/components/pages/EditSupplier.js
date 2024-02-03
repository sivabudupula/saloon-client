import React, { useState } from "react";
import "../styles/AddProduct.css";
import "../styles/EditSupplier.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSupplier = ({ data, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState({ ...data });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(editedData);
    toast.success("Supplier details saved successfully");
  };

  return (
    <div className="pd-container14">
      <ToastContainer />
      <div className="sp-popup14">
        <form className="edit-spform">
          <h5 className="product-heading12">Edit Supplier</h5>
          <div className="product-formgroup12">
            <label className="plabel12">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={editedData.supplier}
              onChange={handleInputChange}
              required
              className="pinput12"
            ></input>
          </div>
          <div className="product-formgroup12">
            <label className="plabel12">Contact</label>
            <input
              type="text"
              name="contact"
              className="pinput12"
              value={editedData.contact}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <div className="product-formgroup12">
            <label className="plabel12">Email</label>
            <input
              type="email"
              name="email"
              className="pinput12"
              value={editedData.email}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <div className="product-formgroup12">
            <label className="plabel12">Address</label>
            <textarea
              className="pinput14"
              name="address"
              value={editedData.address}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="product-buttons12">
            <button className="pbtn12a" onClick={handleSave}>
              Save
            </button>
            <button className="pbtn12c" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplier;