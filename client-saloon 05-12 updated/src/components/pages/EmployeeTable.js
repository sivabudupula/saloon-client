import React, { useEffect, useState, useCallback } from "react";
import "../styles/Reports.css";
import Chart from "react-apexcharts";
import PaginationEmp from "./PaginationEmp";
import * as XLSX from "xlsx";
import { BASE_URL } from "../Helper/helper";

function EmployeeTable() {
  const [employeeData, setEmployeeData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [showChart, setShowChart] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartData, setChartData] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(5); // Items per page
  const [showAll, setShowAll] = useState(false);
  const [showToday, setShowToday] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // New state

  useEffect(() => {
    fetch(`${BASE_URL}/api/customers`)
      .then((response) => response.json())
      .then((data) => {
        setCustomerData(data);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, []);

  const calculateTotalAmount = useCallback(
    (data) => {
      const total = Object.values(data).reduce((accumulator, employee) => {
        return accumulator + employee.totalAmount;
      }, 0);

      setTotalAmount(total);
    },
    [setTotalAmount]
  );

  useEffect(() => {
    const employeeData = {};

    customerData.forEach((customer) => {
      if (customer.billing && customer.billing.length > 0) {
        customer.billing.forEach((bill) => {
          bill.services.forEach((service) => {
            const employeeName = service.employee;
            if (!employeeData[employeeName]) {
              employeeData[employeeName] = {
                services: [],
                totalAmount: 0,
              };
            }
            employeeData[employeeName].services.push(service);
            employeeData[employeeName].totalAmount += service.price || 0;
          });
        });
      }
    });

    setEmployeeData(employeeData);
    if (!filterApplied) {
      calculateTotalAmount(employeeData);
    }
  }, [customerData, filterApplied, calculateTotalAmount]);

  const generateChartData = (data) => {
    const labels = Object.keys(data);
    const values = Object.values(data).map((employee) => employee.totalAmount);

    return {
      options: {
        labels: labels,
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const selectedEmployeeName = labels[config.dataPointIndex];
              setSelectedEmployee(selectedEmployeeName);
            },
          },
        },
      },
      series: values,
    };
  };

  useEffect(() => {
    setChartData(generateChartData(employeeData));
  }, [employeeData]);

  const generateSelectedEmployeeData = () => {
    if (selectedEmployee && employeeData[selectedEmployee]) {
      const selectedEmployeeData = employeeData[selectedEmployee];

      const labels = selectedEmployeeData.services.map(
        (service) => service.serviceName
      );
      const values = selectedEmployeeData.services.map(
        (service) => service.price || 0
      );

      return {
        options: {
          labels: labels,
          chart: {
            events: {
              dataPointSelection: (event, chartContext, config) => {},
            },
          },
        },
        series: values,
      };
    }
    return null;
  };

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return Object.keys(employeeData)
      .slice(startIndex, endIndex)
      .map((employeeName) => ({
        name: employeeName,
        data: employeeData[employeeName],
      }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilter = () => {
    if (showAll) {
      setShowAll(false);
    }
    if (showToday) {
      setShowToday(false);
    }

    const filteredData = customerData
      .filter((customer) => customer.billing && customer.billing.length > 0)
      .map((customer) => {
        return customer.billing.map((bill) => ({
          ...bill,
          customer: customer.name,
        }));
      })
      .flat()
      .filter((billing) => {
        const billDate = new Date(billing.date);
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        const dateInRange = billDate >= fromDateObj && billDate <= toDateObj;

        return dateInRange;
      });

    const updatedEmployeeData = {};

    filteredData.forEach((bill) => {
      bill.services.forEach((service) => {
        const employeeName = service.employee;
        if (!updatedEmployeeData[employeeName]) {
          updatedEmployeeData[employeeName] = {
            services: [],
            totalAmount: 0,
          };
        }
        updatedEmployeeData[employeeName].services.push(service);
        updatedEmployeeData[employeeName].totalAmount += service.price || 0;
      });
    });

    setEmployeeData(updatedEmployeeData);
    setFilterApplied(true);
    calculateTotalAmount(updatedEmployeeData);
    setCurrentPage(1);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setShowToday(false);
    setFromDate("");
    setToDate("");
    setFilterApplied(false);
    fetchAllData();
  };

  const handleShowToday = useCallback(() => {
    setShowAll(false);
    setShowToday(true);
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);

    const todayData = customerData
      .filter((customer) => customer.billing && customer.billing.length > 0)
      .map((customer) => {
        return customer.billing.map((bill) => ({
          ...bill,
          customer: customer.name,
        }));
      })
      .flat()
      .filter((billing) => billing.date === today);

    const updatedEmployeeData = {};

    todayData.forEach((bill) => {
      bill.services.forEach((service) => {
        const employeeName = service.employee;
        if (!updatedEmployeeData[employeeName]) {
          updatedEmployeeData[employeeName] = {
            services: [],
            totalAmount: 0,
          };
        }
        updatedEmployeeData[employeeName].services.push(service);
        updatedEmployeeData[employeeName].totalAmount += service.price || 0;
      });
    });

    setEmployeeData(updatedEmployeeData);
    setFilterApplied(true);
    calculateTotalAmount(updatedEmployeeData);
    setCurrentPage(1);
  }, [
    setShowAll,
    setShowToday,
    setFromDate,
    setToDate,
    customerData,
    calculateTotalAmount,
    setCurrentPage,
  ]);

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.table_to_sheet(
      document.getElementById("employee-table")
    );
    XLSX.utils.book_append_sheet(wb, ws1, "Employee Reports");
    const ws3 = XLSX.utils.aoa_to_sheet([
      ["Selected Date Range:", `${fromDate} to ${toDate}`],
    ]);
    XLSX.utils.book_append_sheet(wb, ws3, "Selected Dates");
    XLSX.writeFile(wb, "Employee_report.xlsx");
  };

  const handleClickShowAll = useCallback(() => {
    setShowAll(true);
    setShowToday(false);
    setFromDate(""); // Clear fromDate
    setToDate(""); // Clear toDate

    const allData = customerData
      .filter((customer) => customer.billing && customer.billing.length > 0)
      .map((customer) => {
        return customer.billing.map((bill) => ({
          ...bill,
          customer: customer.name,
        }));
      })
      .flat();

    const updatedEmployeeData = {};

    allData.forEach((bill) => {
      bill.services.forEach((service) => {
        const employeeName = service.employee;
        if (!updatedEmployeeData[employeeName]) {
          updatedEmployeeData[employeeName] = {
            services: [],
            totalAmount: 0,
          };
        }
        updatedEmployeeData[employeeName].services.push(service);
        updatedEmployeeData[employeeName].totalAmount += service.price || 0;
      });
    });

    setEmployeeData(updatedEmployeeData);
    setFilterApplied(false);
    calculateTotalAmount(updatedEmployeeData);
    setCurrentPage(1); // Reset current page to 1 after filtering
  }, [
    setShowAll,
    setShowToday,
    setFromDate,
    setToDate,
    customerData,
    calculateTotalAmount,
    setCurrentPage,
  ]);

  useEffect(() => {
    if (showAll) {
      handleClickShowAll();
    } else if (showToday) {
      handleShowToday();
    }
  }, [showAll, showToday, handleClickShowAll, handleShowToday]);

  const fetchAllData = () => {};

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(Object.keys(employeeData).length / itemsPerPage);

  // Add these lines to define filteredEmployees
  const filteredEmployees = Object.keys(employeeData)
    .slice(indexOfFirstItem, indexOfLastItem)
    .reduce((filtered, key) => {
      filtered[key] = employeeData[key];
      return filtered;
    }, {});

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

  const getDisplayedPages = () => {
    const totalDisplayPages = 2;
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

  useEffect(() => {
    setChartData(generateChartData(employeeData));
  }, [employeeData]);

  const handleEmployeeClick = (employeeName) => {
    // Set the selected employee when an employee name is clicked
    setSelectedEmployee(employeeName);
  };

  return (
    <div className="billing-table-container-sk654s">
      <div className="headingreport6789">Employee Report</div>
      <div className="date-filter-section-sk654s">
        <div className="flex-109586">
          <div className="flex14390">
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
            </div>
            {/* </div> */}
            <div className="button456">
              <button onClick={handleFilter} className="filter-button-sk654s">
                Filter
              </button>
              &nbsp;
              <button onClick={handleExport} className="filter-button-sk654s">
                Export
              </button>
            </div>
          </div>
          <div className="flex-change6743">
            <button onClick={handleShowAll} className="show-all-button-sk654s">
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
            <button
              onClick={() => setShowChart(!showChart)}
              className="show-chart-button"
            >
              {showChart ? "Close Pie Chart" : "Show Pie Chart"}
            </button>
          </div>
        </div>
        {showChart && chartData && (
          <div className="pie-chart-container">
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="pie"
              width={380}
            />
          </div>
        )}
      </div>
      {selectedEmployee && generateSelectedEmployeeData() && (
        <div className="selected-employee-chart">
          <h3>{`Selected Employee: ${selectedEmployee}`}</h3>
          <Chart
            className="widthrange290"
            options={generateSelectedEmployeeData().options}
            series={generateSelectedEmployeeData().series}
            type="pie"
            width={350}
          />
          <div className="pie-chart-container">
            <button
              onClick={() => setSelectedEmployee("")}
              className="delete-button-sk142sk"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <table className="billing-table-sk654s" id="employee-table">
        <thead>
          <tr className="billing-table-header-sk654s">
            <th className="billing-table-cell-sk654s">S.No</th>
            <th className="billing-table-cell-sk654s">Employee Name</th>
            <th className="billing-table-cell-sk654s">Services</th>
            <th className="billing-table-cell-sk654s">Service Count</th>
            <th className="billing-table-cell-sk654s">Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {getCurrentItems().map(({ name, data }, index) => {
            if (data.services.length > 0) {
              return (
                <tr key={name}>
                  <td className="billing-table-cell-sk654s">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td
                    className="billing-table-cell-sk6543s colorblue00"
                    onClick={() => handleEmployeeClick(name)}
                  >
                    {name}
                  </td>
                  <td className="billing-table-cell-sk6543s">
                    {data.services
                      .map((service) => service.serviceName)
                      .join(", ")}
                  </td>
                  <td className="billing-table-cell-sk654s">
                    {data.services.length}
                  </td>
                  <td className="billing-table-cell-sk654s">
                    {data.totalAmount.toFixed(2)}
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
      <PaginationEmp
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        handleFirstPageClick={handleFirstPageClick}
        handlePreviousPageClick={handlePreviousPageClick}
        handleNextPageClick={handleNextPageClick}
        handleLastPageClick={handleLastPageClick}
        getDisplayedPages={getDisplayedPages}
        filteredEmployees={filteredEmployees}
      />
      <p className="para7890">Total Amount: Rs {totalAmount.toFixed(2)}</p>
    </div>
  );
}

export default EmployeeTable;
