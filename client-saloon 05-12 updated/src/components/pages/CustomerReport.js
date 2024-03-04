import React, { useState, useEffect, useCallback } from "react";
import "../styles/Reports.css";
import axios from "axios";
import Chart from "react-apexcharts";
import { BASE_URL } from "../Helper/helper";

const CustomerReport = ({ onCustomerDetailsClick }) => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromAge, setFromAge] = useState("");
  const [toAge, setToAge] = useState("");
  const [showChart, setShowChart] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerData, setCustomerData] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterClicked, setFilterClicked] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [ageChartVisible, setAgeChartVisible] = useState(false);
  const [selectedAge, setSelectedAge] = useState(null);
  const [ageChartData, setAgeChartData] = useState(null);
  const [selectedAgeChartVisible, setSelectedAgeChartVisible] = useState(false);
  const [selectedAgePieChartData, setSelectedAgePieChartData] = useState(null);

  const calculateCustomerData = useCallback(
    (data) => {
      const updatedCustomerData = {};

      data.forEach((customer) => {
        if (customer.billing && customer.billing.length > 0) {
          const customerServices = [];
          let customerServiceCount = 0;

          customer.billing.forEach((bill) => {
            bill.services.forEach((service) => {
              customerServices.push(service.serviceName);
            });

            customerServiceCount += bill.services.length;
          });

          updatedCustomerData[customer.name] = {
            services: customerServices,
            serviceCount: customerServiceCount,
          };
        }
      });

      setCustomerData(updatedCustomerData);
    },
    [setCustomerData]
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/customers`);
        const customersWithServices = await Promise.all(
          response.data.map(async (customer) => {
            try {
              const servicesResponse = await axios.get(
                `${BASE_URL}/api/customers/${customer._id}/services`
              );
              const services = servicesResponse.data;

              return {
                ...customer,
                services,
              };
            } catch (servicesError) {
              console.error("Error fetching services:", servicesError);
              return {
                ...customer,
                services: [],
              };
            }
          })
        );

        setCustomers(customersWithServices.reverse());
        calculateCustomerData(customersWithServices);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [calculateCustomerData]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    } else {
      return age;
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFromAgeChange = (e) => {
    setFromAge(e.target.value);
  };

  const handleToAgeChange = (e) => {
    setToAge(e.target.value);
  };

  const handleFilterClick = () => {
    setFilterClicked(true);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFromAge("");
    setToAge("");
    setFilterClicked(false);
  };

  const getCustomersWithAge = (age) => {
    return customers.filter((customer) => calculateAge(customer.dob) === age);
  };

  const getServicesWithAge = (age) => {
    const customersWithAge = getCustomersWithAge(age);
    const services = customersWithAge.flatMap((customer) => {
      return customerData[customer.name]?.services || [];
    });
    return services.join(", ");
  };

  const calculateServicesCountAndRevenue = (age) => {
    const customersWithAge = getCustomersWithAge(age);
    let serviceCount = 0;
    let totalRevenue = 0;

    customersWithAge.forEach((customer) => {
      const customerServices = customerData[customer.name]?.services || [];
      serviceCount += customerServices.length;

      customer.billing.forEach((bill) => {
        bill.services.forEach((service) => {
          totalRevenue += service.price;
        });
      });
    });

    return { serviceCount, totalRevenue };
  };

  useEffect(() => {
    const generateChartData = () => {
      const labels = Array.from(new Set(customers.map((customer) => calculateAge(customer.dob))));
      const series = labels.map((age) => calculateServicesCountAndRevenue(age).totalRevenue.toFixed(2));

      return {
        options: {
          labels: labels.map(String),
        },
        series: series.map(parseFloat),
      };
    };

    setChartData(generateChartData());
  }, [customers]);

  const generateAgeChartData = (selectedAge) => {
    const customersWithSelectedAge = getCustomersWithAge(selectedAge);
    const servicesData = {};

    customersWithSelectedAge.forEach((customer) => {
      const customerServices = customerData[customer.name]?.services || [];

      customerServices.forEach((service) => {
        if (!servicesData[service]) {
          servicesData[service] = 1;
        } else {
          servicesData[service]++;
        }
      });
    });

    const labels = Object.keys(servicesData);
    const series = labels.map((service) => servicesData[service]);

    return {
      options: {
        labels,
      },
      series,
    };
  };

  const handleAgeClick = (age) => {
    setSelectedAge(age);
    setSelectedAgePieChartData(generateAgeChartData(age));
    setSelectedAgeChartVisible(true);
  };

const handleRevenueChartClick = () => {
    if (selectedAge !== null) {
      setAgeChartVisible(true);
      setAgeChartData(generateAgeChartData(selectedAge));
    }
  };
  

  const filteredCustomers = customers.filter((customer) => {
    const customerAge = calculateAge(customer.dob);

    const fromAgeNum = fromAge === "" ? 0 : parseInt(fromAge, 10);
    const toAgeNum = toAge === "" ? Number.MAX_SAFE_INTEGER : parseInt(toAge, 10);

    const ageFilter =
      (!filterClicked || (fromAge === "" && toAge === "")) ||
      (fromAge !== "" && toAge !== ""
        ? customerAge >= fromAgeNum && customerAge <= toAgeNum
        : fromAge !== "" && customerAge >= fromAgeNum
        ? customerAge >= fromAgeNum
        : toAge !== "" && customerAge <= toAgeNum);

    const searchFilter = searchQuery === "" || customerAge.toString() === searchQuery;

    return ageFilter && searchFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

// Slice the array to get the current items for the current page
const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

// Calculate the total number of pages
const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

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

  const getDisplayedPages = () => {
    const totalDisplayPages = 3;
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
    <div className="main-empp">
      <div className="customer-container11">
        <h6 className="edit-customer-heading1123">Age-wise report</h6>
        <div className="margin786">
        <div className="select-number-of-entries">
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
          <div className="customer-search1197">
            
            <div className="flex14334 ">
            <div className="flex14345">
                <div className="flex143">
            <div className="container4901">
              <label className="date-label-sk654s"> From Age </label>
              <input
                className="date-input-sk654s"
                type="number"
                value={fromAge}
                onChange={handleFromAgeChange}
                placeholder=" From Age"
              />&nbsp;
              </div>

              <div className="container4901">
              <label className="date-label-sk654s"> To Age </label>
              <input
                className="date-input-sk654s"
                type="number"
                value={toAge}
                onChange={handleToAgeChange}
                placeholder=" To Age"
              />
              </div>
              </div>
              <div className="flex1433456">
                <div>
              <button className="filter-button-sk654s" onClick={handleFilterClick}>
                Filter
              </button>&nbsp;&nbsp;
              <button className="filter-button-sk654s" onClick={resetFilters}>
                Reset
              </button>
              </div>
              </div>
              </div>

              
             
              <div className="end865">
              <button 
              onClick={() => setShowChart(!showChart)}
              className="show-chart-button"
            >
              {showChart ? 'Close Chart' : 'Show Chart'}
            </button>
            </div>
              </div>
            {/* </div> */}
            {/* <div className="A7serinp">
              <label> Search by Age </label>
              <input
                className="input2"
                type="number"
                value={searchQuery}
                onChange={handleSearch}
                placeholder=" Age"
              />
            </div> */}
            
          </div>
          {showChart && chartData && (
            <div onClick={handleRevenueChartClick} className="pie-chart-container">
              
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="pie"
                width="380"
              />
            </div>
          )}
          {selectedAgeChartVisible && selectedAgePieChartData && (
            <div className="pie-chart-container ">
                <div className="flex878">
              <h5>Services Chart for Age {selectedAge}</h5>
              <Chart
                options={selectedAgePieChartData.options}
                series={selectedAgePieChartData.series}
                type="pie"
                width="400"
              />
              <div>
              <button className="show-chart-button6677" onClick={() => setSelectedAgeChartVisible(false)}>Close Age Chart</button>
            </div>
            </div>
            </div>
          )}

          <div>
            <table className="customer-table11a7">
              <thead>
                {/* <p>click on age for detail pie chart </p> */}
                <tr>
                  <th className="A7th2">Age</th>
                  <th className="A7th10">Customers</th>
                  <th className="A7th5">Services</th>
                  <th className="A7th5">Service Count</th>
                  <th className="A7th7">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(currentItems.map((customer) => calculateAge(customer.dob)))).map((age, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td
                        className="customer-table-td1 colorblue00"
                        onClick={() => handleAgeClick(age)}
                      >
                        {age}
                      </td>
                      <td className="customer-table-td">{getCustomersWithAge(age).map((customer) => customer.name).join(", ")}</td>
                      <td className="customer-table-td">{getServicesWithAge(age)}</td>
                      <td className="customer-table-td1">{calculateServicesCountAndRevenue(age).serviceCount}</td>
                      <td className="customer-table-td1">{calculateServicesCountAndRevenue(age).totalRevenue.toFixed(2)}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="entries-div121">
            <div className="number-of-entries-div">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} entries
            </div>
            <div className="pagination-div">
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
    </div>
  );
};

export default CustomerReport;