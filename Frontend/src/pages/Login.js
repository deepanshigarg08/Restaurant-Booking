import React, { useState } from 'react';
import styles from '../styles/Login.module.css'; // Import component-level CSS
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { SERVER_URL } from '@/utils/config';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed with form submission (e.g., send data to API)
      console.log('Login successful');
    }

    const data = {
       
          User_Email : email,

          User_Password : password
    }

    try{


      const response = await axios.post(`${SERVER_URL}/user/Login` , data)

      const {message , redirect_url , User_OID , Auth_Token} = response.data


 Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
    })

  
  localStorage.setItem('User_Email' , email)
  localStorage.setItem('User_OID' , User_OID)
  localStorage.setItem('Auth_Token', Auth_Token)
  

  sessionStorage.setItem('User_Email' , email)
  sessionStorage.setItem('User_OID', User_OID)


  window.location.pathname = redirect_url


    }

    catch(error){

      console.log(error)
         Swal.fire({
              title: "Error!",
              text: error.response.data.message,
              icon: "error",
              confirmButtonText: "OK",
            });

    }






  };

  return (
    <div className={styles.loginRoot}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className={styles.error}>{errors.password}</p>}
            </div>

            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
          <p className={styles.footer}>
            Don't have an account? <a href="/signup" className={styles.link}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
