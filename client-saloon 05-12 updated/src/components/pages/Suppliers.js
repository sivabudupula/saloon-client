import React, { useState, useEffect } from "react";
import "../styles/AddProduct.css";
import axios from "axios";
import "../styles/Suppliers.css";
import EditSupplier from "./EditSupplier";
import { BASE_URL } from "../Helper/helper";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmToast = ({ handleConfirm, handleCancel }) => {
  return (
    <div className="ConfirmToast">
      <p>Are you sure you want to delete this supplier?</p>
      <button className="yes" onClick={handleConfirm}>
        Yes
      </button>
      <button className="no" onClick={handleCancel}>
        No
      </button>
    </div>
  );
};
const Suppliers = ({ onNewSupplierClick }) => {
  const [supplierList, setSupplierList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  // const [totalRowsProcessed, setTotalRowsProcessed] = useState(0);

  const [displayComponent, setDisplayComponent] = useState("SuppliersList");

  // const [supplierData, setSupplierData] = useState({
  //   supplier: "",
  //   contact: "",
  //   email: "",
  //   address: "",
  // });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter customers based on search query
  const filteredSupplierList = supplierList.filter((supplier) =>
    supplier.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setSupplierData({ ...supplierData, [name]: value });
  // };

  const handleClick = () => {
    onNewSupplierClick();
  };

  // const handleAddSupplier = async (e) => {
  //   e.preventDefault();

  //   try {
  //     console.log("productdata ", supplierData);
  //     await axios.post("http://localhost:5000/AddSupplier", supplierData);
  //     toast.success("Saved Successfully");
  //   } catch (error) {
  //     toast.error("Error while logging in");
  //   }

  //   setSupplierData({
  //     supplier: "",
  //     contact: "",
  //     email: "",
  //     address: "",
  //   });
  // };

  useEffect(() => {
    // Fetch vitals data from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/suppliers`);
        const responseData = response.data.reverse();
        console.log(responseData);
        setSupplierList(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setDisplayComponent("editSupplier");
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setDisplayComponent("SuppliersList");
  };

  const handleEditSave = async (editedData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/suppliers/${editedData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedData),
        }
      );

      if (response.ok) {
        const updatedSupplierList = [...supplierList];
        updatedSupplierList[editIndex] = editedData;
        setSupplierList(updatedSupplierList);
        setEditIndex(null);
        setDisplayComponent("SuppliersList");
        // toast.success("Data updated successfully");
      } else {
        console.error("Failed to update data in MongoDB");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = (supplierId) => {
    toast(
      <ConfirmToast
        handleConfirm={() => handleConfirmDelete(supplierId)}
        handleCancel={handleCancelDelete}
      />,
      {
        position: "top-center",
      }
    );
  };

  const handleConfirmDelete = async (supplierId) => {
    try {
      // Send a DELETE request to the server with the supplier's ID
      await axios.delete(`${BASE_URL}/api/suppliers/${supplierId}`);
      // Update the state to remove the deleted supplier
      const updatedSupplierList = supplierList.filter(
        (supplier) => supplier._id !== supplierId
      );
      setSupplierList(updatedSupplierList);
      toast.success("Supplier deleted successfully");
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Error deleting supplier");
    }
  };

  const handleCancelDelete = () => {
    toast.dismiss();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSupplierList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSupplierList.length / itemsPerPage);

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
    <div>
      <ToastContainer />
      {displayComponent === "SuppliersList" ? (
        <>
          <div className="pd-container14">
            <h5 className="pd-heading14">Suppliers </h5>
            <div className="space209">
              <button className="pdadd-btn12" onClick={handleClick}>
                {" "}
                + Add Supplier
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
                      placeholder="By Supplier Name"
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
                    <th className="pd-th12">Supplier</th>
                    <th className="pd-th12">Contact</th>
                    <th className="pd-th12">Email</th>
                    <th className="pd-th12">Address</th>
                    <th className="pd-th12">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="customer-table11-td1">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="pd-td123">{item.supplier}</td>
                      <td className="pd-td12">{item.contact}</td>
                      <td className="pd-td123">{item.email}</td>
                      <td className="pd-td123">{item.address}</td>
                      <td className="pd-td12">
                        <button
                          className="pdedit-btn12"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="app-delete-btn11" // Add a class for styling
                          onClick={() => handleDelete(item._id)} // Pass the item's ID to handleDelete
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
                  {Math.min(indexOfLastItem, filteredSupplierList.length)} of{" "}
                  {filteredSupplierList.length} entries
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
          </div>
        </>
      ) : displayComponent === "editSupplier" ? (
        <div>
          {editIndex !== null && (
            <EditSupplier
              data={supplierList[editIndex]}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};
export default Suppliers;
