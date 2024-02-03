import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css'
import { toast , ToastContainer  } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helper/helper';

const Register = () => {
   const [message, setMessage] = useState('');

  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
  });

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  
    // Password validation criteria
    // const passwordRegex = /^(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    // if (!passwordRegex.test(data.password)) {
    //   setMessage(
    //     'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.'
    //   );
    //   return;
    // }
    // if (data.password !== data.confirmpassword) {
    //   toast.error('Password and Confirm Password do not match.');
    //   return;
    // }
  
    try {
      const response = await axios.post(`${BASE_URL}/api/register`, data);
  
      if (response.status === 200) {
        toast.success('Registered Successfully!', {
          // ... (your existing toast options)
        });
        setData({
          username: '',
          email: '',
          password: '',
          confirmpassword: '',
        });
      }
      }catch (error) {
        if (error.response) {
            if (error.response.status === 400 && error.response.data.error === 'User Already Exist') {
                setMessage('UserName Already Exist');
                
            } else if (error.response.status === 500) {
                setMessage('Internal server error');
            } else if (error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            }else if (error.response.status === 400 && error.response.data.error === 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.') {
              setMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.');
          }
            
        } else {
            setMessage('Unknown error occurred');
        }
    }

    
  };

  return (
    <div>
      {/* <center> */}
        <form onSubmit={submitHandler} autoComplete="off" className="register-form-sk543">
          <h3 className="register-h3-sk543">Register</h3>
          <div className='padding0467'>
          <div className='registerlable-name-saloon234'>
            <label className='name56' htmlFor="username">Username</label>
            

          <input
            type="text"
            onChange={changeHandler}
            name="username"
            value={data.username}
            placeholder="User Name"
            className="register-input-sk543"
          />
          </div>
         
          <div className='registerlable-name-saloon234'>
            <label  className='name56' htmlFor="username">Email</label>
           
          <input
            type="email"
            onChange={changeHandler}
            name="email"
            value={data.email}
            placeholder="Email"
            className="register-input-sk543"
          />
           </div>
          <div className='registerlable-name-saloon234'>
            <label  className='name56' htmlFor="username">Password</label>
            
          <input
            type="password"
            onChange={changeHandler}
            name="password"
            value={data.password}
            placeholder="Password"
            className="register-input-sk543"
          />
          </div>
          <div className='registerlable-name-saloon234'>
            <label  className='name56' htmlFor="username">ConfirmPassword</label>
           
          <input
            type="password"
            onChange={changeHandler}
            name="confirmpassword"
            value={data.confirmpassword}
            placeholder="Confirm Password"
            className="register-input-sk543"
          />
           </div>
           {message && <p className="login-error-message">{message}</p>}

           </div>
          <div className='emp-btn-flex2345'>
          <input type="submit" value="Register" className="register-submit-sk543" />
          
          </div>
          
        </form>
      {/* </center> */}
      <div>
      <ToastContainer />
      </div>
    </div>
  );
};

export default Register;