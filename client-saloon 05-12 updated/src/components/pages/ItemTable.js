import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Reports.css";
import Chart from "react-apexcharts";
import * as XLSX from "xlsx";
import PaginationItem from "./PaginationItem";
import { BASE_URL } from "../Helper/helper";

function formatTotalPrice(totalPrice) {
  return totalPrice.toFixed(2);
}

function ItemTable() {
  const [billingData, setBillingData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPieChart, setShowPieChart] = useState(true);
  const [pieChartData, setPieChartData] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showToday, setShowToday] = useState(false);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, [showAll, showToday]);

  const fetchData = () => {
    let apiUrl = `${BASE_URL}/api/customers`;

    if (showToday) {
      const today = new Date().toISOString().split("T")[0];
      apiUrl += `?fromDate=${today}&toDate=${today}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        const billingData = response.data.reduce((acc, customer) => {
          return acc.concat(customer.billing || []);
        }, []);
        setBillingData(billingData);

        if (showPieChart) {
          const pieChartInfo = calculatePieChartData(billingData);
          setPieChartData(pieChartInfo);
        }
      })
      .catch((error) => {
        console.error("Error fetching billing data:", error);
      });
  };

  const calculatePieChartData = (data) => {
    const pieChartLabels = [];
    const pieChartDataValues = [];
    const pieChartColors = [];

    data.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemName = item.itemName;
        const price = item.price * item.quantity;
        const index = pieChartLabels.indexOf(itemName);
        if (index === -1) {
          pieChartLabels.push(itemName);
          pieChartDataValues.push(price);
          pieChartColors.push(getRandomColor());
        } else {
          pieChartDataValues[index] += price;
        }
      });
    });

    return {
      labels: pieChartLabels,
      data: pieChartDataValues,
      backgroundColor: pieChartColors,
    };
  };

  const togglePieChart = () => {
    setShowPieChart(!showPieChart);

    if (!showPieChart) {
      const pieChartInfo = calculatePieChartData(billingData);
      setPieChartData(pieChartInfo);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
    setShowToday(false);
    setFromDate("");
    setToDate("");

    const pieChartInfo = calculatePieChartData(billingData);
    setPieChartData(pieChartInfo);
  };

  const handleShowToday = () => {
    setShowAll(false);
    setShowToday(true);

    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);

    const filteredData = billingData.filter((bill) => {
      if (bill.items.length === 0) {
        return false;
      }
      const billDate = new Date(bill.date);
      const fromDateObj = new Date(today); // Update fromDateObj to use today's date
      const toDateObj = new Date(today);

      return billDate >= fromDateObj && billDate <= toDateObj;
    });

    const pieChartInfo = calculatePieChartData(filteredData);
    setPieChartData(pieChartInfo);
  };

  useEffect(() => {
    if (showAll) {
      handleShowAll();
    } else if (showToday) {
      handleShowToday();
    }
  }, [showAll, showToday]);

  const handleFilter = () => {
    if (showAll) {
      setShowAll(false);
    }
    if (showToday) {
      setShowToday(false);
    }

    const filteredData = billingData
      .filter((bill) => bill.items && bill.items.length > 0)
      .map((bill) => ({
        ...bill,
        items: bill.items.map((item) => ({
          ...item,
          customer: bill.customer, // Add customer information to each item
        })),
      }))
      .flat()
      .filter((item) => {
        const billDate = new Date(item.date);
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        return billDate >= fromDateObj && billDate <= toDateObj;
      });

    const updatedPieChartData = calculatePieChartData(filteredData);
    setPieChartData(updatedPieChartData);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const filteredBillingData = billingData.filter((bill) => {
    if (bill.items.length === 0) {
      return false;
    }
    if (fromDate && toDate) {
      const billDate = new Date(bill.date);
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      return billDate >= fromDateObj && billDate <= toDateObj;
    }
    return true;
  });

  const totalBillAmount = filteredBillingData.reduce((total, bill) => {
    return (
      total +
      bill.items.reduce(
        (subtotal, item) => subtotal + item.price * item.quantity,
        0
      )
    );
  }, 0);

  const totalPages = Math.ceil(filteredBillingData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredBillingData.slice(startIndex, endIndex);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  }

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.table_to_sheet(
      document.getElementById("item-table")
    );
    XLSX.utils.book_append_sheet(wb, ws1, "Product Reports");
    const ws3 = XLSX.utils.aoa_to_sheet([
      ["Selected Date Range:", `${fromDate} to ${toDate}`],
    ]);
    XLSX.utils.book_append_sheet(wb, ws3, "Selected Dates");
    XLSX.writeFile(wb, "Product_report.xlsx");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  const handlePreviousPageClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleLastPageClick = () => {
    setCurrentPage(totalPages);
  };

  const getDisplayedPages = () => {
    // Implement the logic to get the array of displayed page numbers
    // based on the current page, total pages, and the number of pages to show.
    // You can use Math.min and Math.max to ensure the displayed pages are within valid range.
    // Example:
    const maxPagesToShow = 2;
    const middlePage = Math.ceil(maxPagesToShow / 2);
    const startPage = Math.max(1, currentPage - middlePage + 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <div className="billing-table-container-sk654s">
      <h1 className="headingreport6789">Product Sales Report</h1>
      <div className="date-filter-section-sk8765432s">
        <div className="flex-109586">
          <div className="flex-1095">
            <div className="flex143">
              <div className="container490">
                <label htmlFor="fromDate" className="date-label-sk654s">
                  From Date:
                </label>
                <input
                  type="date"
                  id="fromDate"
                  className="date-input-sk654s"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="container490">
                <label htmlFor="toDate" className="date-label-sk65432s">
                  To Date:
                </label>
                <input
                  type="date"
                  id="toDate"
                  className="date-input-sk654s"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="btns-7832">
              <button onClick={handleExport} className="filter-button-sk654s">
                Export
              </button>
            </div>
          </div>
          <div>
            <div className="flex-change6743">
              <button
                onClick={handleShowAll}
                className="show-all-button-sk654s"
              >
                Show All
              </button>
              &nbsp;
              <button
                onClick={handleShowToday}
                className="show-today-button-sk654s"
              >
                Today
              </button>
              &nbsp;
              <button onClick={togglePieChart} className="show-chart-button">
                {showPieChart ? "Close Pie Chart" : "Show Pie Chart"}
              </button>
            </div>
          </div>
        </div>
        {showPieChart && pieChartData && (
          <div className="pie-chart-container">
            <Chart
              options={{
                labels: pieChartData.labels,
              }}
              series={pieChartData.data}
              type="pie"
              width={380}
            />
          </div>
        )}
      </div>
      <table className="billing-table-sk654s" id="item-table">
        <thead>
          <tr className="billing-table-header-sk654s">
            <th className="billing-table-cell-sk654s">S.No</th>
            <th className="billing-table-cell-sk654s">Item Name</th>
            <th className="billing-table-cell-sk654s">Price</th>
            <th className="billing-table-cell-sk654s">Quantity</th>
            <th className="billing-table-cell-sk654s">Total Price</th>
            <th className="billing-table-cell-sk654s">Date</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((bill, index) => (
            <tr key={index} className="billing-table-row-sk654s">
              <td className="billing-table-cell-sk654s">
                {index + 1 + (currentPage - 1) * rowsPerPage}
              </td>
              <td className="customer-table11-td">
                {bill.items.map((item) => item.itemName).join(", ")}
              </td>
              <td className="billing-table-cell-sk654s">
                {bill.items.map((item) => item.price).join(", ")}
              </td>
              <td className="billing-table-cell-sk654s">
                {bill.items.map((item) => item.quantity).join(", ")}
              </td>
              <td className="billing-table-cell-sk654s">
                {formatTotalPrice(
                  bill.items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                )}
              </td>
              <td className="billing-table-cell-sk654s">
                {formatDate(bill.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationItem
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        handleFirstPageClick={handleFirstPageClick}
        handlePreviousPageClick={handlePreviousPageClick}
        handleNextPageClick={handleNextPageClick}
        handleLastPageClick={handleLastPageClick}
        getDisplayedPages={getDisplayedPages}
        filteredItems={filteredBillingData}
      />

      <p className="para7890">
        Total Amount: Rs {formatTotalPrice(totalBillAmount)}
      </p>
    </div>
  );
}

export default ItemTable;
