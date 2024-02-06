import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../Helper/helper';
const AddSupplier = () => {
  const [supplierData, setSupplierData] = useState({
    supplier: '',
    contact: '',
    email: '', 
    address: '',
  });
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSupplierData({ ...supplierData, [name]: value });
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      console.log('supplierData', supplierData);
      await axios.post(`${BASE_URL}/api/suppliers`, supplierData);
      toast.success('Saved Successfully');
    } catch (error) {
      toast.error('Error while logging in', error);
    }
    setSupplierData({
      supplier: '',
      contact: '',
      email: '',
      address: '',
    });
  };

  return (
    <div>
      <form className="addproduct12" autoComplete='off'>
        <h5 className="product-heading12">Add Suppliers</h5>
        <div className="product-formgroup12">
          <label className="plabel12">Supplier</label>
          <input
            type="text"
            name="supplier"
            value={supplierData.supplier}
            onChange={handleChange}
            required
            className="pinput14"
          />
        </div>
        <div className="product-formgroup12">
          <label className="plabel12">Contact</label>
          <input
            type="text"
            name="contact"
            className="pinput14"
            value={supplierData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-formgroup12">
          <label className="plabel12">Email</label>
          <input
            type="text"
            name="email"
            className="pinput14"
            value={supplierData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-formgroup12">
          <label className="plabel12">Address</label>
          <textarea
            rows="3"
            cols="30"
            className="pinput14"
            name="address"
            value={supplierData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="spbtn-div14">
          <button className="sp-btn14" onClick={handleAddSupplier}>
            Add Supplier
          </button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default AddSupplier;