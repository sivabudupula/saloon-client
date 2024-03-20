import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import "../styles/Reports.css";
import PaginationService from "./ServicePagination";
import * as XLSX from "xlsx";
import { BASE_URL } from "../Helper/helper";

function ServiceTable() {
  const [customerData, setCustomerData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  // const [totalRowsProcessed, setTotalRowsProcessed] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  // const [employeeNames, setEmployeeNames] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBillingData, setFilteredBillingData] = useState([]); // Initialize with an empty array
  const [showPie, setShowPie] = useState(true);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const [chartData, setChartData] = useState({
    options: {
      labels: [],
    },
    series: [],
  });

  const calculateTotalAmount = useCallback(
    (data) => {
      const total = data.reduce((acc, item) => {
        const totalPrice = item.services.reduce((total, service) => {
          return total + (service.price || 0);
        }, 0);
        return acc + totalPrice;
      }, 0);
      setTotalAmount(total);
    },
    [setTotalAmount]
  );

  const generatePieChart = useCallback(
    (data) => {
      const services = {};
      data.forEach((billing) => {
        billing.services.forEach((service) => {
          if (!services[service.serviceName]) {
            services[service.serviceName] = 0;
          }
          services[service.serviceName] += service.price || 0;
        });
      });

      const serviceNames = Object.keys(services);
      const serviceValues = serviceNames.map((name) => services[name]);

      setChartData({
        options: {
          labels: serviceNames,
        },
        series: serviceValues,
      });
    },
    [setChartData]
  );

  // Modify the handleFilter function
  const handleFilter = useCallback(() => {
    let filteredData = customerData
      .filter((customer) => customer.billing && customer.billing.length > 0)
      .map((customer) => {
        return customer.billing.map((bill) => ({
          ...bill,
          customer: customer.name,
        }));
      })
      .flat();

    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      filteredData = filteredData.filter((billing) => {
        const billDate = new Date(billing.date);
        return billDate >= fromDateObj && billDate <= toDateObj;
      });
    }

    if (selectedEmployee) {
      filteredData = filteredData.filter((billing) =>
        billing.services.some(
          (service) => service.employee === selectedEmployee
        )
      );
    }

    if (searchQuery) {
      const lowercaseSearchQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((billing) =>
        billing.customer.toLowerCase().includes(lowercaseSearchQuery)
      );
    }

    setFilteredBillingData(filteredData);
    setCurrentPage(1);

    calculateTotalAmount(filteredData);
    generatePieChart(filteredData);

    // Reset filterTrigger to false after applying the filter
    setFilterTrigger(false);
  }, [
    customerData,
    fromDate,
    toDate,
    selectedEmployee,
    searchQuery,
    setFilteredBillingData,
    setCurrentPage,
    calculateTotalAmount,
    generatePieChart,
  ]);

  // Modify the useEffect to trigger handleFilter only when filterTrigger is true
  useEffect(() => {
    if (filterTrigger) {
      handleFilter();
    }
  }, [fromDate, toDate, filterTrigger, handleFilter]);

  // Modify the handleShowToday function
  const handleShowToday = () => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    setFromDate(startOfDay.toISOString().split("T")[0]);
    setToDate(endOfDay.toISOString().split("T")[0]);
    setSelectedEmployee("");
    setSearchQuery("");

    // Set filterTrigger to true after updating fromDate and toDate
    setFilterTrigger(true);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/customers`)
      .then((response) => {
        setCustomerData(response.data);

        // const uniqueNames = Array.from(
        //   new Set(
        //     response.data
        //       .filter((customer) => customer.billing && customer.billing.length > 0)
        //       .map((customer) => customer.billing)
        //       .flat()
        //       .map((bill) => bill.services)
        //       .flat()
        //       .map((service) => service.employee)
        //   )
        // );

        // setEmployeeNames(uniqueNames);

        let allData = response.data
          .filter((customer) => customer.billing && customer.billing.length > 0)
          .map((customer) => {
            return customer.billing.map((bill) => ({
              ...bill,
              customer: customer.name,
            }));
          })
          .flat();

        setFilteredBillingData(allData);
        calculateTotalAmount(allData); // Calculate the total amount initially
        generatePieChart(allData);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, [calculateTotalAmount, generatePieChart]);

  const handleShowAll = () => {
    setFromDate("");
    setToDate("");
    setSelectedEmployee("");
    setSearchQuery("");

    setFilterTrigger(true);
  };

  const totalPages = Math.ceil(filteredBillingData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBillingData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const handleExport = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Add the data from the service-report-table
    const ws1 = XLSX.utils.table_to_sheet(
      document.getElementById("service-table")
    );
    XLSX.utils.book_append_sheet(wb, ws1, "Service Reports");

    // Create a new worksheet for the selected dates
    const ws3 = XLSX.utils.aoa_to_sheet([
      ["Selected Date Range:", `${fromDate} to ${toDate}`],
    ]);
    XLSX.utils.book_append_sheet(wb, ws3, "Selected Dates");

    // Export the workbook to an XLSX file
    XLSX.writeFile(wb, "Service_report.xlsx");
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  }

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
    <div className="flex163">
      <div className="billing-table-container-sk654s">
        <h5 className="heading234">Service Report</h5>
        <div className="date-filter-section-sk65432s">
          <div className="filter-item">
            <div>
              <label htmlFor="searchEmployee" className="date-label-sk654s">
                Search:
              </label>
              <input
                type="text"
                id="searchEmployee"
                className="search-input-sk654s"
                placeholder="Search Employee Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex14345">
              <div className="margintop345">
                {/* <div className="flex14345"> */}
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
                      <label htmlFor="toDate" className="date-label-sk654s">
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
                    <div className="button456">
                    <button
                      onClick={handleFilter}
                      className="filter-button-sk654s"
                    >
                      Filter
                    </button>
                    &nbsp;
                    <button
                      onClick={handleExport}
                      className="filter-button-sk654s"
                    >
                      Export
                    </button>
                  </div>
                  </div>
                 
                {/* </div> */}
                <div className="btns-783">
                 
                    <button
                      className="show-all-button-sk654s"
                      onClick={() => handleShowAll()}
                    >
                      Show All
                    </button>
                    &nbsp;
                    <button
                      className="show-today-button-sk654s"
                      onClick={() => handleShowToday()}
                    >
                      Today
                    </button>
                    &nbsp;
                    <button
                      className="show-chart-button"
                      onClick={() => setShowPie(!showPie)}
                    >
                      {showPie ? "Hide Chart" : "Show Chart"}
                    </button>
                  
                </div>
              </div>
            </div>
            {showPie && (
              <div className="pie-chart-container">
                <Chart
                  className="piechartchange"
                  options={chartData.options}
                  series={chartData.series}
                  type="pie"
                  width={380}

                  // height={380}
                />
              </div>
            )}
          </div>
        </div>
        <div className="tble-overflow12">
        <table className="billing-table-sk654s" id="service-table">
          <thead className="thead87">
            <tr className="billing-table-header-sk654s">
              <th className="billing-table-cell-sk654s">S.No</th>
              <th className="billing-table-cell-sk654s">Customer Name</th>
              <th className="billing-table-cell-sk654s">Employee Name</th>
              <th className="billing-table-cell-sk654s">Service Name</th>
              <th className="billing-table-cell-sk654s">Price</th>
              <th className="billing-table-cell-sk654s">Total Price</th>
              <th className="billing-table-cell-sk654s">Date</th>
            </tr>
          </thead>
          <tbody className="thead87">
            {currentRows.map((item, index) => {
              const employeeNames = item.services
                .map((service) => service.employee)
                .join(", ");

              const totalPrice = item.services.reduce((total, service) => {
                return total + (service.price || 0);
              }, 0);

              return (
                <tr key={index} className="billing-table-row-sk654s">
                  <td className="customer-table11-td1">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </td>
                  <td className="customer-table11-td">{item.customer}</td>
                  <td className="customer-table11-td">
                    {employeeNames || "N/A"}
                  </td>
                  <td className="customer-table11-td">
                    {item.services
                      .map((service) => service.serviceName || "N/A")
                      .join(", ")}
                  </td>
                  <td className="customer-table11-td1">
                    {item.services
                      .map((service) => service.price || "N/A")
                      .join(", ")}
                  </td>
                  <td className="customer-table11-td1">{totalPrice}</td>
                  <td className="customer-table11-td1">
                    {formatDate(item.date)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        <PaginationService
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
        <p className="para7890">Total Amount: Rs {totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default ServiceTable;
