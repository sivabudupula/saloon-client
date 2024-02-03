import React, { useState, useEffect } from 'react';
import '../styles/CustomerTable.css';
import axios from 'axios';
import { BASE_URL } from '../Helper/helper';



const CustomerTable = ({ onCustomerDetailsClick }) => {
  
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
   const [itemsPerPage, setItemsPerPage] = useState(5);
  
   const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/customers`);
      setCustomers(response.data.reverse());
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter customers based on search query
  // const filteredCustomers = customers.filter((customer) =>
  //   customer.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const filteredCustomers = customers.filter((customer) =>
 (customer.customerId && customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()))||
  customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
);

  const handleClick = (selectedCustomer) => {
    // const selected = customers.find((customer) => customer.email === selectedCustomer.email);
    // setSelectedCustomers(selected);
    console.log(selectedCustomer);

    onCustomerDetailsClick(selectedCustomer);
   
    //  navigate('/CustomerDetails', { state:  selected});
    // navigate('/CustomerDetails', { state: { selected, updateSelected } });
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
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
      <div className="customer-container11">
      <h6 className='edit-customer-heading1123'> Customers</h6>
      <div className='margin786'>
        <div className="customer-search11">
        <div className='select-number-of-entries'>
            <label>Show </label>
            <select className="input1" value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              {/* Add more options as needed */}
            </select>
            <label> entries </label>
          </div>
          <div className="A7serinp">
            <label> Search </label>
            <input className="input2" 
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder=' ID / Phone Number'
             />
          </div>
        </div>
        
        <div>
          
          <table className="customer-table11a7">
            <thead>
              <tr>
                <th className="A7th1">Customer ID</th>
                <th className="A7th10">Customer Name</th>
                <th className="A7th2">DOB</th>
                <th className="A7th3">Email</th>
                <th className="A7th4">Contact Number</th>
                <th className="A7th5">Address</th>
                {/* <th className="A7th6">Discount</th> */}
                <th className="A7th7">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((customer) => (
                <tr key={customer.email}>
                  <td className='customer-table-td1'>{customer.customerId}</td>
                  <td  className='customer-table-td'>{customer.name}</td>
                  <td  className='customer-table-td1'>{formatDate(customer.dob)}</td>
                  <td  className='customer-table-td'>{customer.email}</td>
                  <td  className='customer-table-td1'>{customer.phone}</td>
                  <td  className='customer-table-td'>{customer.address}</td>
                  {/* <td className='customer-table-td1'>{customer.discount}</td> */}
                  <td  className='customer-table-td1'>
                  <button className='details456' onClick={() => handleClick(customer)}>details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div className="entries-div121">
          <div className='number-of-entries-div'>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} entries
         
          </div>
        <div className='pagination-div'>
          <button className="badges" onClick={handleFirstPageClick}>First</button>
          <button className="badges" onClick={handlePreviousPageClick}>Previous</button>
          {getDisplayedPages().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`badges ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button className="badges" onClick={handleNextPageClick}>Next</button>
          <button className="badges" onClick={handleLastPageClick}>Last</button>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CustomerTable;