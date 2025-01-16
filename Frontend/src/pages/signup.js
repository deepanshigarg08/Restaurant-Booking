import React, { useState } from 'react';
import styles from '../styles/signup.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from './Layout';
import axios from 'axios';
import { SERVER_URL } from '@/utils/config';
import Swal from 'sweetalert2';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [Name , setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (assuming we need a number with a length of 10)
    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Confirm Password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed with form submission (e.g., send data to API)
      console.log('Form submitted');
    }

    const Data = {

        User_Name : Name,

        User_Email : email,

        User_Phone : phone,

        User_Password : password,

        User_Confirm_Password : confirmPassword
    }

    try{

     const response = await axios.post(`${SERVER_URL}/user/signup`, Data)

     const {message , redirect_url} = response.data

     Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
    })

    window.location.pathname = redirect_url

    }

    catch(error){

      console.error(error)

      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }


  };

  return (

    <Layout>

<div className={styles.signupRoot}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create an Account</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                className={styles.input}
                placeholder="Enter your name"
                value={Name}
                onChange={(e)=>setName(e.target.value)}
              />
            </div>

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
              <label htmlFor="phone" className={styles.label}>Phone</label>
              <input
                type="text"
                id="phone"
                className={styles.input}
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}
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

            <div className={styles.inputGroup}>
              <label htmlFor="confirmpassword" className={styles.label}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmpassword"
                className={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
            </div>

            <button    type="submit" className={styles.button}>Sign Up</button>
          </form>
          <p className={styles.footerText}>
            Already have an account? <a href="/" className={styles.link}>Log In</a>
          </p>
        </div>
      </div>
    </div>


    </Layout>
   
  );
}
