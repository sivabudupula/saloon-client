

import React, { useState, useEffect } from "react";
import "../styles/ProductList.css";
import axios from "axios";
import EditProduct from "./EditProduct";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmToast = ({ message, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm();
    toast.dismiss(); // Close the toast after confirming
  };
  const handleCancel = () => {
    onCancel();
    toast.dismiss(); // Close the toast after canceling
  };

  return (
    <div className="confirmation-toast">
      <div>{message}</div>
      <div className="confirmation-buttons">
        <button className="confirm-button" onClick={handleConfirm}>
          Yes
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          No
        </button>
      </div>
    </div>
  );
};


const ProductList = ({ onNewProductClick }) => {
  const [productList, setProductList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [displayComponent, setDisplayComponent] = useState("ProductList");

  useEffect(() => {
    // Fetch vitals data from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/Products");
        const responseData = response.data.reverse();
        console.log(responseData);
        setProductList(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter customers based on search query
  const filteredProducts = productList.filter((product) =>
    product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (index) => {
    setEditIndex(index);
    setDisplayComponent("editProduct");
  };

  const handleClick = () => {
    // Call the callback to update selectedButton
    onNewProductClick();
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setDisplayComponent("ProductList");
  };

  const handleEditSave = async (editedData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/Products/${editedData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedData),
        }
      );

      if (response.ok) {
        const updatedProductList = [...productList];
        updatedProductList[editIndex] = editedData;
        setProductList(updatedProductList);
        setEditIndex(null);
        setDisplayComponent("ProductList");
        // alert(" Data updated successfully");
      } else {
        console.error("Failed to update data in MongoDB");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = (productId) => {
    toast.info(
      <ConfirmToast
        message="Do you want to delete this product?"
        onConfirm={() => {
          fetch(`http://localhost:5000/api/Products/${productId}`, {
            method: 'DELETE',
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                console.log(data.message);
                const updatedProductList = productList.filter(
                  (product) => product._id !== productId
                );
                setProductList(updatedProductList);
                toast.success('Product deleted successfully');
              } else {
                console.error('Error deleting product:', data.error);
                toast.error('Error deleting product');
              }
            })
            .catch((error) => {
              console.error('Error deleting product:', error);
              toast.error('Error deleting product');
            });
        }}
        onCancel={() => {
        }}
      />,
      {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };
  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  const handleLastPageClick = () => {
    setCurrentPage(totalPages);
  };

  const handlePreviousPageClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // Calculate which page numbers to display
  const getDisplayedPages = () => {
    const totalDisplayPages = 3; // Number of pages to display
    const pages = [];
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
      if (pages.length >= totalDisplayPages) {
        break;
      }
    }
    return pages;
  };

  return (
    <div className="pd-container12">
      <ToastContainer />
      {displayComponent === "ProductList" ? (
        <>
          <h5 className="pd-heading12">Product Details</h5>
          <div className="space209">
            <button className="pdadd-btn12" onClick={handleClick}>
              {" "}
              + New Product
            </button>

            <div className="pd-search12">
              <div>
                <label>Show </label>
                <select
                  className="input1"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
                <label> entries </label>
              </div>
              <div className="A7serinp">
                <div>
                  {" "}
                  Search{" "}
                  <input
                    type="search"
                    className="border-change890"
                    placeholder="By Product Name"
                    value={searchQuery}
                    onChange={handleSearch}
                  ></input>{" "}
                </div>
              </div>
            </div>
            <table className="pd-table12">
              <thead>
                <tr>
                  <th className="pd-th12">S.No</th>
                  <th className="pd-th12">Product Name</th>
                  <th className="pd-th12">Manufacturer</th>
                  <th className="pd-th12">Supplier</th>
                  <th className="pd-th12">S.P</th>
                  <th className="pd-th12">Stock</th>
                  <th className="pd-th12">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="customer-table11-td1">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td className="pd-td123">{item.itemName}</td>
                    <td className="pd-td123">{item.manufacturer}</td>
                    <td className="pd-td123">{item.supplier}</td>
                    <td className="pd-td12">{item.price}</td>
                    <td className="pd-td12">{item.stock}</td>

                    <td className="pd-td12">
                      <button
                        className="pdedit-btn12"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="app-delete-btn11"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="entries-div121">
              <div>
                {" "}
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
                {filteredProducts.length} entries
              </div>
              <div>
                <button className="badges" onClick={handleFirstPageClick}>
                  First
                </button>
                <button className="badges" onClick={handlePreviousPageClick}>
                  Previous
                </button>
                {getDisplayedPages().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`badges ${
                      pageNumber === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button className="badges" onClick={handleNextPageClick}>
                  Next
                </button>
                <button className="badges" onClick={handleLastPageClick}>
                  Last
                </button>
              </div>
            </div>
          </div>
        </>
      ) : displayComponent === "editProduct" ? (
        <div>
          {editIndex !== null && (
            <EditProduct
              data={productList[editIndex]}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ProductList;