import React, { useState,useEffect } from 'react';
import "../styles/EditProfile.css";
import axios from 'axios';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast , ToastContainer  } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helper/helper';

const EditProfile =() => {
  const navigate = useNavigate();
  const [token,] = useState(localStorage.getItem('token'));
  const [data,setData] = useState({});
const [oldPassword,setOldPassword] = useState('');
  const [newPassword,setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fetchedPassword, setFetchedPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [message, setMessage] = useState('');


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/register`, {
        headers: {
          'x-token': token,
        },
      })
      .then((res) => {
        setData(res.data);
        setFetchedPassword(res.data.password);
      })
      .catch((err) => console.log(err));
  }, [token]);
  


 
if(!token){
  navigate('/');  
}


const validatePassword = () => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  if (newPassword.length < 8) {
    return 'New password must be at least 8 characters long.';
  }

  if (!passwordRegex.test(newPassword)) {
    return 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).';
  }

  if (newPassword !== confirmpassword) {
    return 'New password and confirm password do not match.';
  }

  return '';
};
 
  
 
const handleUpdate = async (e) => {
  e.preventDefault();

  // Validate new password and confirm password
  const newPasswordValidationResult = validatePassword();

  if (newPasswordValidationResult) {
    // Display validation error as Toastify message
    setMessage(newPasswordValidationResult, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return;
  }

  if (fetchedPassword === oldPassword) {
    try {
      await axios.put(`${BASE_URL}/api/register/${data._id}`, data);
      // Display success toast
     toast.success('Profile Updated Successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        

      });
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      // Display error toast
      toast.error('Error while updating profile', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    // Reset the form fields
    setOldPassword('');
    setNewPassword('');
    setConfirmpassword('');
  } else {
    // Display error toast for password mismatch
    setMessage('Old password does not match the stored password. Please check and try again.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};

  

  
    return (
      <div className="edit-profile-saloon234">
        <h2 className='edit-profile-h2--saloon234'>Edit Profile</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group-saloon234">

            <div className='lable-name-saloon234'>
            <label htmlFor="username">Username</label>
            </div>

            <input
            className='form-group-saloon234-input'
              type="text"
              
              placeholder='Enter Name'
              name="username"
              value={data.username}
              onChange={(e) => {
                
                setData({
                  ...data,
                  username: e.target.value,
                });
                
              }}
              required
            />
          </div>
          <div className="form-group-saloon234">

            <div className='lable-name-saloon234'>    
            <label htmlFor="oldPassword" >Old Password</label>
            </div>
           <div className="password-input-container">
            <input
            className='form-group-saloon234-input'
              // type="password"
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter Old Password'
              
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span className='profile-password' onClick={togglePasswordVisibility}>
        {showPassword ? (
          <FontAwesomeIcon icon={faEyeSlash} />
        ) : (
          <FontAwesomeIcon icon={faEye} />
        )}
      </span>
      </div>
          </div>
          <div className="form-group-saloon234">
          <div className='lable-name-saloon234'>
            <label htmlFor="newPassword">New Password</label>
          </div>
          <input
            className='form-group-saloon234-input'
            type="password"
            placeholder='Enter New Password'
            name="newPassword"
            value={newPassword}
            onChange={(e) => {
              const newPassword = e.target.value;
              setNewPassword(newPassword);
              setData({
                ...data,
                password: newPassword,
              });
            }}
            required
          />
        </div>
        <div className="form-group-saloon234">
          <div className='lable-name-saloon234'>
            <label htmlFor="newPassword">Confirm Password</label>
          </div>
          <input
            className='form-group-saloon234-input'
            type="password"
            placeholder='Enter Confirm Password'
            name="confirmPassword"
            value={confirmpassword}
            onChange={(e) => {
              const confirmpassword = e.target.value;
              setConfirmpassword(confirmpassword);
              setData({
                ...data,
                confirmpassword: confirmpassword,
              });
            }}
            required
          />
        </div>

        {message && <p className="login-error-message">{message}</p>}

          <div className='emp-btn-flex2345'>
        <button className='update-btn-saloon234'>update</button>
      </div>
          
        </form>
        <div>
        <ToastContainer />
        </div>
        
      </div>
    );
  }


export default EditProfile;