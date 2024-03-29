import React, { useState, useEffect, useRef } from 'react';
import '../styles/StockSelfUse.css';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import { BASE_URL } from '../Helper/helper';

const StockSelfUse = () => {
  const [productList, setProductList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tableData, setTableData] = useState([
    {
      product: '',
      quantity: '',
    },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        const responseData = response.data;
        setProductList(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleSave = async () => {
    const nonEmptyData = tableData.filter(
      (entry) => entry.product.trim() !== "" && entry.quantity.trim() !== ""
    );

    if (nonEmptyData.length === 0) {
      toast.error("Please enter product and quantity before saving.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/stock-selfuse`,
        nonEmptyData
      );
      console.log(response.data);
      toast.success("Data saved successfully");
      setTableData([
        {
          product: "",
          quantity: "",
        },
      ]);
    } catch (error) {
      toast.error("Error saving data");
      console.error(error);
    }
  };

  const deleteEntry = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };
  // const handleButtonClick = () => {
  //   setIsDeleting(true);
  //   setTimeout(() => setIsDeleting(false), 3200);
  // };
  const addRow = () => {
    const newEmptyEntry = {
      product: '',
      quantity: '',
    };
    setTableData((prevTableData) => [...prevTableData, newEmptyEntry]);
  };

  const productInputRef = useRef(null);
  const quantityInputRef = useRef(null);

  const handleKeyDown = (event, fieldName, index) => {
    if (event.key === 'ArrowRight' || event.key === 'Enter') {
      if (fieldName === 'product' && quantityInputRef.current) {
        quantityInputRef.current.focus();
      } else if (fieldName === 'quantity' && index === tableData.length - 1) {
        addRow();
        productInputRef.current.focus();
      }
    }
  };

  return (
    <div className='A7Stockmaindiv'>
      <ToastContainer />

      <h5 className='heading234'>Stock Sale</h5>
      {/* <div className="tble-overflow12"> */}
      <table className='pp-entering1301'>
        <thead>
          <tr>
            <td className='ppe-th'>Product:</td>
            <td className='ppe-th'>Quantity:</td>
            {/* <td className='ppe-th'></td> */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((entry, index) => (
            <tr key={index}>
              <td >
                <select
                  type="text"
                  className='pp-input131 pp-input1312'
                  value={entry.product}
                  onChange={(e) =>
                    setTableData((prevTableData) => {
                      const updatedTableData = [...prevTableData];
                      updatedTableData[index].product = e.target.value;
                      return updatedTableData;
                    })
                  }
                  onKeyDown={(e) => handleKeyDown(e, 'product', index)}
                  ref={index === tableData.length - 1 ? productInputRef : null}
                >
                  <option value="">Select an item</option>
                  {productList.map((item, index) => (
                    <option value={item.itemName} key={item.id}>
                      {item.itemName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className='pp-input13 pp-input1312'
                  value={entry.quantity}
                  onChange={(e) =>
                    setTableData((prevTableData) => {
                      const updatedTableData = [...prevTableData];
                      updatedTableData[index].quantity = e.target.value;
                      return updatedTableData;
                    })
                  }
                  onKeyDown={(e) => handleKeyDown(e, 'quantity', index)}
                  ref={index === tableData.length - 1 ? quantityInputRef : null}
                />
              </td>
              <td>
                <button className='delete-buttonss' onClick={() => deleteEntry(index)}>
                  <div className='delete-icon' />
              Delete
                </button>
        
              </td>
            </tr>
          ))}

          <tr>
          <button type="button" className='add-row-btn add-row-btn90' onClick={addRow}>
              Add Row
            </button>
          </tr>
        </tbody>
      </table>
{/* </div> */}

      <div className='A7Stock-sub-div3'>
        <button className='A7Stock-sub-div2-button3' onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default StockSelfUse;
