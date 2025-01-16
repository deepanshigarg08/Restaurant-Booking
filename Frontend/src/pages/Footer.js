import React from 'react';
import styles from '../styles/Footer.module.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.contactInfo}>
          <h3>Contact Us</h3>
          <p>Mathura, Uttar Pradesh, India</p>
          <p>Email: bhuvantenguria37@gmail.com</p>
          <p>Phone: +91 8433076329</p>
        </div>

        <div className={styles.socialMedia}>
          <h3>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className={styles.icon} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className={styles.icon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className={styles.icon} />
            </a>
            <a href="https://www.linkedin.com/in/bhuvan-tenguria-71902b238/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className={styles.icon} />
            </a>
          </div>
        </div>

        <div className={styles.aboutUs}>
          <h3>About Us</h3>
          <p>
          "A lesson without pain is meaningless. That’s because you can’t gain something without sacrificing something in return. 
  But by enduring that pain and overcoming it, you shall gain a heart that is stronger than everything. That’s what makes it meaningful." <br/>
  – Edward Elric
          </p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2025 YourCompany. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
