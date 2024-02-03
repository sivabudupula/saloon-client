import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function PasswordToggle({ formData, handleInputChange }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="password-toggle">
        <div style={{border:'1px solid #ccc',borderRadius:'3px',padding:'4px',}}>
      <div className='eye8976'>
      <input style={{border:'none',  outline:'none'}}
        type={isPasswordVisible ? 'text' : 'password'}
        name="password"
        className='toggle2389'
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <span className="toggle-icon" onClick={togglePasswordVisibility}>
        {isPasswordVisible ? (
          <FontAwesomeIcon icon={faEyeSlash} />
        ) : (
          <FontAwesomeIcon icon={faEye} />
        )}
      </span>
      </div>
    </div>
    </div>
  );
}

export default PasswordToggle;