import React, { useState, useEffect } from 'react';
import '../styles/Messages.css';
import { BASE_URL } from '../Helper/helper';


const Individual = () => {
  const [message, setMessage] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState('');
  const maxCharacters = 160;

  const handleInputChange = (event) => {
    const inputText = event.target.value;

    if (inputText.length <= maxCharacters) {
      setMessage(inputText);
    }
  };

  const handleClearClick = () => {
    setMessage('');
  };

  const handleSendClick = () => {
    alert('Sending SMS:', message, 'to', selectedCustomer);
  };

  const handleCustomerChange = (event) => {
    const selectedCustomerName = event.target.value;
    setSelectedCustomer(selectedCustomerName);

    // Find the customer's phone number based on their name
    const selectedCustomerData = customers.find(
      (customer) => customer.name === selectedCustomerName
    );

    // Update the selectedCustomerPhone state with the phone number
    if (selectedCustomerData) {
      setSelectedCustomerPhone(selectedCustomerData.phone);
    } else {
      setSelectedCustomerPhone('');
    }
  };

  useEffect(() => {
    // Fetch customer data from your backend API
    fetch(`${BASE_URL}/api/customers`) // Replace with your actual API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Error fetching customer data:', error));
  }, []);

  return (
    <div className="main-empp">
      <div className='A7custmaindiv89'>
        
          <h4 className='A7custheader23'>Individual</h4>
        
        {/* <div className='A7custform'> */}
        <div className='space639'>
            <div className='flex3399'>
            <p className='A7sendAllbtn'>Send to </p>
            <select
              className='A7drpdwn45'
              value={selectedCustomer}
              onChange={handleCustomerChange}
            >
              <option value=''>--- Select Customer ---</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
            </div>
            
            <div className='flex3399'>
              <p className='A7sendAllbtn'>Phone No. </p>
              <input
                className='A7drpdwn45'
                value={selectedCustomerPhone}
                readOnly
              />
            </div>
          
          <div className='flex3399'>
            <p className='A7sendAllbtn'>Message</p>
          
            <textarea
              className='A7txtar-bulk'
              rows='8'
              cols='25'
              value={message}
              onChange={handleInputChange}
            />
          </div>
          <div className='A7cntr-bulk35'>
            {message.length}/{maxCharacters - message.length}
          </div>
          <div className='A7cntrl-bulk'>
            <button className='A7sendSmsbtn' onClick={handleSendClick}>
              Send SMS
            </button>
            <button className='A7sendSmsbtn A7clr' onClick={handleClearClick}>
              Clear
            </button>
          </div>
        </div>
      </div>
      </div>
   
  );
};

export default Individual;