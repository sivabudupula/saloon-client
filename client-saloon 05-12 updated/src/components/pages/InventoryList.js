import React, { useState, useEffect } from "react";
import "../styles/ProductList.css";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";

const InventoryList = ({ onNewPurchaseClick }) => {
  const [purchaseList, setPurchaseList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Fetch vitals data from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Stock`);
        const responseData = response.data.reverse();
        console.log(responseData);
        setPurchaseList(responseData);
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
  const filteredPurchaseList = purchaseList.filter((purchase) =>
    formatDate(purchase.purchaseDate)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleClick = () => {
    // Call the callback to update selectedButton
    onNewPurchaseClick();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchaseList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPurchaseList.length / itemsPerPage);

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

  const handleDetailsClick = (item) => {
    // Calculate the total purchase amount for the current purchase entry
    const totalPurchaseAmount = item.tableData.reduce((acc, product) => {
      const amount = product.quantity * product.cp;
      return acc + amount;
    }, 0);

    // Calculate the total quantity
    const totalQuantity = item.tableData.reduce((acc, product) => {
      return acc + parseInt(product.quantity, 10);
    }, 0);

    // Calculate the total cp
    const totalCP = item.tableData.reduce((acc, product) => {
      return acc + parseFloat(product.cp);
    }, 0);

    setSelectedItem({
      ...item,
      totalPurchaseAmount: totalPurchaseAmount,
      NoOfProducts: item.tableData.length,
      totalQuantity: totalQuantity,
      totalCP: totalCP.toFixed(2),
    });
  };

  const handlePrint = () => {
    if (selectedItem) {
      // Create the printable content
      const printContent = `
        <html>
          <head>
            <title>Inventory Details</title>
            <style>
              /* Add your styles here */
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
              }
              .popup-content {
                height: 100vh;
                width: 100vw;
                overflow-y: auto;
                padding: 20px;
                border-radius: 3px;
                // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                background: #fff;
               
                // width: 40%;
                position: relative;
              }
              .popup-title {
                text-align:center;
                  // font-size: large;
                  margin-bottom: 10px;
              }
              .popup-details{
                width: 140px;
                margin-top: 0px;
                font-weight: 500;
              }
              .flexchange4455{
                display: flex;
                flex-direction: row;
                margin-bottom: -10px;
              }
              .th89{
                background-color: rgb(218, 213, 213);
                border: 1px solid #ccc;
                padding: 5px;
                text-align: center;
              }
              .td89{
                background-color: white;
                border: 1px solid #ccc;
                padding: 5px;
                font-weight: normal;
                text-align: center;
              }
              .td88{
                text-align: left !important;
              }
            </style>
          </head>
          <body>
          <div style=" display: flex;justify-content: center;">
            <div class="popup-content">
              <h2 class="popup-title">Purchase Order Details</h2>
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;"> <p class="popup-details">Purchase Date</p> :&nbsp;&nbsp;&nbsp;&nbsp; ${
                selectedItem.purchaseDate
              } </div>
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;"> <p class="popup-details">Supplier</p> : &nbsp;&nbsp;&nbsp;&nbsp;${
                selectedItem.supplier
              } </div>
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;"> <p class="popup-details">Bill Number</p> : &nbsp;&nbsp;&nbsp;&nbsp;${
                selectedItem.billNumber
              } </div>
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;"> <p class="popup-details">Purchase Type</p> : &nbsp;&nbsp;&nbsp;&nbsp;${
                selectedItem.purchaseType
              } </div>
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;"> <p class="popup-details">Purchase Amount</p> : &nbsp;&nbsp;&nbsp;&nbsp;₹ ${
                selectedItem.totalPurchaseAmount
              } </div>
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;">  <p class="popup-details">No of Products</p> : &nbsp;&nbsp;&nbsp;&nbsp;${
                selectedItem.NoOfProducts
              } </div>
              <table style=" margin-top: 16px;">
                <thead>
                  <tr>
                    <th className="th89">Product</th>
                    <th className="th89">Quantity</th>
                    <th className="th89">CP</th>
                    <th className="th89">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${selectedItem.tableData
                    .map(
                      (product, index) => `
                      <tr>
                        <td className="td89 td88">${product.product}</td>
                        <td className="td89">${product.quantity}</td>
                        <td className="td89">₹ ${product.cp}</td>
                        <td className="td89"> ${formatDate(product.expiryDate)}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            </div>
          </body>
        </html>
      `;

      // Open a new window for printing
      const printWindow = window.open("", "", "width=600,height=600");
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Initiate the print dialog
      printWindow.print();

      // Close the new window after printing
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    }
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  }
  return (
    <div className="pd-container12">
      <h5 className="pd-heading12">Inventory Details</h5>
      <div className="margin4567">
        <button className="pdadd-btn12" onClick={handleClick}>
          {" "}
          + New Purchase
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
                placeholder="Search by Date"
                value={searchQuery}
                onChange={handleSearch}
              ></input>{" "}
            </div>
          </div>
        </div>
        <table className="pd-table12">
          <thead>
            <tr>
              <th className="pd-th12">S.NO</th>
              <th className="pd-th12">Bill Number</th>
              <th className="pd-th12">Purchase Date</th>
              <th className="pd-th12">Company Name</th>
              <th className="pd-th12">Product Name</th>
              <th className="pd-th12">Expiry Date</th>
              <th className="pd-th12">Supplier</th>
              <th className="pd-th12">Purchase Amount</th>
              <th className="pd-th12">Purchase Type</th>
              <th className="pd-th12">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              // Calculate the total purchase amount for the current purchase entry
              const totalPurchaseAmount = item.tableData.reduce(
                (acc, product) => {
                  const amount = product.quantity * product.cp;
                  return acc + amount;
                },
                0
              );

              return (
                <tr key={item.id}>
                  <td className="customer-table11-td1">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="pd-td12">{item.billNumber}</td>
                  <td className="pd-td12">{formatDate(item.purchaseDate)}</td>
                  <td className="pd-td12">{item.companyName}</td>
                  <td className="pd-td12">
                    {item.tableData.map((product, index) => (
                      <React.Fragment key={index}>
                        {product.product}
                      
                        {index < item.tableData.length - 1 && ", "}
                      </React.Fragment>
                      
                    ))}
                  </td>
                  <td className="pd-td12">
                    {item.tableData.map((product, index) => (
                      <React.Fragment key={index}>
                        {formatDate(product.expiryDate)}
                      
                        {index < item.tableData.length - 1 && ", "}
                      </React.Fragment>
                      
                    ))}
                  </td>
                  
                  <td className="pd-td123">{item.supplier}</td>
                  <td className="pd-td12">₹ {totalPurchaseAmount}</td>
                  <td className="pd-td123">{item.purchaseType}</td>
                  <td className="pd-td12">
                    <button
                      className="pdedit-btn12"
                      onClick={() => handleDetailsClick(item)} // Show details on click
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {selectedItem && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="flexchange445577">
                <h5 className="popup-title">Purchase Order Details</h5>
                <button
                  className="popup-close-button"
                  onClick={() => setSelectedItem(null)}
                >
                  X
                </button>
              </div>
              <div className="flexchange4455">
                <p className="popup-details">Purchase Date</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.purchaseDate}
              </div>
              <div className="flexchange4455">
                {" "}
                <p className="popup-details">Supplier </p>: &nbsp; &nbsp; &nbsp;
                {selectedItem.supplier}
              </div>
              <div className="flexchange4455">
                <p className="popup-details">Bill Number</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.billNumber}
              </div>
              <div className="flexchange4455">
                <p className="popup-details">Purchase Type</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.purchaseType}
              </div>
              <div className="flexchange4455">
                <p className="popup-details">Purchase Amount</p> : &nbsp; &nbsp;
                &nbsp;₹ {selectedItem.totalPurchaseAmount}
              </div>
              <div className="flexchange4455">
                <p className="popup-details">No of Products</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.NoOfProducts}
              </div>
              <table className="popup-table">
                <thead>
                  <tr>
                    <th className="th89">Product</th>
                    <th className="th89">Quantity</th>
                    <th className="th89">CP</th>
                    <th className="th89">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem.tableData.map((product, index) => (
                    <tr key={index}>
                      <td className="td89 td88">{product.product}</td>
                      <td className="td89">{product.quantity}</td>
                      <td className="td89">{product.cp}</td>
                      <td className="td89">{formatDate(product.expiryDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="print285">
                <button className="popup-print-button" onClick={handlePrint}>
                  Print
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="entries-div121">
          <div className="flex163">
            {" "}
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredPurchaseList.length)} of{" "}
            {filteredPurchaseList.length} Entries
          </div>
          <div className="flex163">
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
  );
};

export default InventoryList;
