import React, { useState, useEffect } from 'react';
import '../styles/AddProduct.css';
import axios from 'axios';
import { ToastContainer,  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helper/helper';

const AddProduct = () => {
  const [supplierList, setSupplierList] = useState([]);
  const [productData, setProductData] = useState({
    itemName: '',
    manufacturer: '',
    supplier: '',
    expiryDate: '', 
    productPrice: '',  
    price: '',
    stock: '',
  });

  useEffect(() => {
    // Fetch vitals data from the API
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/suppliers`);
        const responseData = response.data;
        console.log(responseData);
        setSupplierList(responseData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    if (
      !productData.itemName ||
      !productData.manufacturer ||
      !productData.supplier ||
      !productData.price ||
      !productData.stock
    ) {
      toast.error('Please fill in all the required fields');
      return;
    }

    try {
      console.log('productdata ', productData);
      await axios.post(`${BASE_URL}/api/Products`, productData);
      toast.success('Product saved successfully');
    } catch (error) {
      console.error('Error while adding product', error);
      toast.error('Error while adding product');
    }

    setProductData({
      itemName: '',
      manufacturer: '',
      supplier: '',
      price: '',
      stock: '',
    });
  };

  return (
    <div className="main-empp">
      <ToastContainer />
      <form className="addproduct12" autoComplete="off">
        <h5 className="heading234">Add Product</h5>
        <div className="product-formgroup12">
          <label className="plabel12">Product Name</label>
          <input
            type="text"
            name="itemName"
            value={productData.itemName}
            onChange={handleChange}
            required
            className="pinput12"
          ></input>
        </div>
        <div className="product-formgroup12">
          <label className="plabel12">Manufacturer</label>
          <input
            name="manufacturer"
            className="pinput12"
            type="text"
            value={productData.manufacturer}
            onChange={handleChange}
            required
          ></input>
        </div>

        <div className="product-formgroup12">
          <label className="plabel12">Supplier</label>
          <select
            name="supplier"
            className="pinput12"
            value={productData.supplier}
            onChange={handleChange}
            required
          >
            <option value=""></option>
            {supplierList.map((item, index) => (
              <option value={item.supplier} key={item.id}>
                {item.supplier}
              </option>
            ))}
          </select>
        </div>

        <div className="product-formgroup12">
          <label className="plabel12">Selling Price</label>
          <input
            type="number"
            className="pinput12"
            placeholder="0.00"
            name="price"
            value={productData.price}
            onChange={handleChange}
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
            value={productData.stock}
            onChange={handleChange}
            required
          ></input>
        </div>
        <div className="product-buttons12">
          <button className="pbtn12a" onClick={handleAdd}>
            +Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;