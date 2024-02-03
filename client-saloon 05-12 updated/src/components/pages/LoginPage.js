// LoginPage.js
import React, { useState } from 'react';
import "../styles/LoginPage.css"
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { toast , ToastContainer  } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helper/helper';

const LoginPage = () => {
  
  const navigate = useNavigate(); 
  const [data,setData] = useState({
    username:'',
    password:'',
})
  
  // const [showPassword, setShowPassword] = useState(false);
   const [token,setToken] = useState('')
   const [message, setMessage] = useState('');

  const changeHandler = e =>{
    setData({...data,[e.target.name]:e.target.value})
}

  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${BASE_URL}/api/login`, data);
    const username = data.username;
    
    console.log('Response:', response); //
    if (response.status === 200) {
      // Set the token when login is successful
      toast.success('Login Successful');
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username' , username)

      // Display a success message
     

    } else if (response.status === 400) {
      // Display "Invalid credentials" for 400 response status
      setMessage('Invalid credentials');
    }
  } catch (error) {
    if (error.response) {
      // Handle known errors with response data
      if (error.response.status === 500) {
        setMessage('Internal server error');
      } else if (error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      }
    } else {
      // Handle unknown errors
      setMessage('Unknown error occurred');
    }
  }
};

if(token){
  setTimeout(() => {
    navigate('/dashboard');
  }, 3000);


 }
 
  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  return (
    <div className="login-page-saloon">
      <div className="login-container-saloon ">
        <h2 className='h2-saloon'>Login to Salon</h2>
        <form onSubmit={handleSubmit} autoComplete='off'>
          <div className="form-group-saloon">
            {/* <label htmlFor="username">Username</label> */}
            <input
            className='inputfor-saloon'
              type="text"
              name="username"
              placeholder="Enter Username"
              value={data.username}
              onChange={changeHandler}
            />
          </div>

          <div className="form-group-saloon">
            {/* <label htmlFor="password">Password</label> */}
            <input
             className='inputfor-saloon'
          //  type={showPassword ? 'text' : 'password'}
             type='password'
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={changeHandler}
            />
          </div>

          {message && <p className="login-error-message">{message}</p>}


          <button className='button-login-saloon' type="submit" >
            Login
          </button>
        </form>

        {/* <div className="register-link">
          <p>
            Forgot password?{' '}
            <a href="#">Forgot Password</a>
          </p>
          
        </div> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;