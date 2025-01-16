import React, { useEffect, useState } from 'react';
import styles from '../styles/Header.module.css'; // Your styles for the header
import { FaHome, FaInfoCircle, FaSignOutAlt, FaEnvelope , FaClipboardList } from 'react-icons/fa'; // Icons for navigation

const Header = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Check if the window object is available (to ensure client-side execution)
    if (typeof window !== "undefined") {
      const email = localStorage.getItem('User_Email');
      setUserEmail(email); // Update the state with the email
    }
  }, []);

  function clearStorage() {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>SHADOW BOOK</h1>
      </div>
      <nav>
        <ul className={styles.navList}>
          <li>
            <a href="/components/Home" className={styles.navItem}>
              <FaHome className={styles.icon} />
              <span className={styles.navText}>Home</span>
            </a>
          </li>
          <li>
            <a href="/About" className={styles.navItem}>
              <FaInfoCircle className={styles.icon} />
              <span className={styles.navText}>About</span>
            </a>
          </li>
          <li>
            <a href="/Contact" className={styles.navItem}>
              <FaEnvelope className={styles.icon} />
              <span className={styles.navText}>Contact</span>
            </a>
          </li>


          {userEmail && (
            <li>
              <a href="/order-history" className={styles.navItem}>
                <FaClipboardList className={styles.icon} />
                <span className={styles.navText}>Booking History</span>
              </a>
            </li>
          )}

          

          {userEmail && (
            <li onClick={clearStorage}>
              <a href="/" className={styles.navItem}>
                <FaSignOutAlt className={styles.icon} />
                <span className={styles.navText}>Logout</span>
              </a>
            </li>
          )}









        </ul>
      </nav>
    </header>
  );
};

export default Header;
