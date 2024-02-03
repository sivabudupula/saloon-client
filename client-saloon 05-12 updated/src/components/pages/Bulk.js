import React, { useState } from 'react'
import '../styles/Messages.css';

const Bulk = () => {
  const [message, setMessage]=useState('');
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
    alert('Sending SMS:', message);
  };
  return (
    <div>
     <div className='A7custmaindiv89'>
      
        
      
      {/* <div className='A7custform'> */}
      <h4 className='A7custheader23'>Bulk</h4> 
      <div className='space639'>
      <div className='flex0055'>
        <p  className='A7sendAllbtn'>Send to All</p>
        <select className='A7drpdwn45'>
          <option>---Select a Category---</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        </div>
        <div className='flex0055'>
          <p className='A7sendAllbtn'>Message</p>
      
        <textarea className='A7txtar-bulk'
        rows="8"
        cols="14"
        value={message}
        onChange={handleInputChange}
      /></div>
      <div className='A7cntr-bulk35'>
        {message.length}/{maxCharacters - message.length}
      </div>
      <div className='A7cntrl-bulk'>
        <button className='A7sendSmsbtn' onClick={handleSendClick}>Send SMS</button>
        <button className='A7sendSmsbtn A7clr' onClick={handleClearClick}>Clear</button>
      </div>
</div>
      </div>
      </div>
  )
}

export default Bulk;