import React, { useState } from "react";
import "../styles/AddProduct.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = ({ data, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState({ ...data });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = (e) => {
     e.preventDefault();
     onSave(editedData);
    toast.success('Product updated nsuccessfully');
  };
  const handleCancel = () => {
    onCancel();
    toast.warn('Edit canceled');
  };

  return (
    <div className="sp-popup14">
      <form className="editproduct12">
        <h5 className="product-heading12">Edit Product</h5>
        <div className="product-formgroup12">
          <label className="plabel12">Product Name</label>
          <input
            type="text"
            name="itemName"
            value={editedData.itemName}
            onChange={handleInputChange}
            required
            className="pinput12"
          ></input>
        </div>
        <div className="product-formgroup12">
          <label className="plabel12">Manufacturer</label>
          <input
            name="manufacturer"
            className="pinput12"
            value={editedData.manufacturer}
            onChange={handleInputChange}
            required
          ></input>
        </div>

        <div className="product-formgroup12">
          <label className="plabel12">Supplier</label>
          <input
            type="supplier"
            className="pinput12"
            name="price"
            value={editedData.supplier}
            onChange={handleInputChange}
            required
          ></input>
        </div>

        <div className="product-formgroup12">
          <label className="plabel12">Selling Price</label>
          <input
            type="number"
            className="pinput12"
            placeholder="0.00"
            name="price"
            value={editedData.price}
            onChange={handleInputChange}
            required
          ></input>
        </div>
        <div className="product-formgroup12">
          <label className="plabel12">Stock</label>
          <input
            type="number"
            className="pinput12"
            placeholder="0"
            name="stock"
            value={editedData.stock}
            onChange={handleInputChange}
            required
          ></input>
        </div>
        <div className="product-buttons12">
          <button className="pbtn12a" onClick={handleSave}>
            Save
          </button>
          <button className="pbtn12c" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;