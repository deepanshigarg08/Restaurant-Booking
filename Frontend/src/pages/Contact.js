import React from 'react';
import { FaEnvelope, FaPhone, FaLinkedin, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../styles/Contact.module.css';
import Layout from './Layout';

const Contact = () => {
  return (
    <Layout>
      <div className={styles.contactContainer}>
        <div className={styles.header}>
          <h1>Contact Me</h1>
          <p>Feel free to reach out to me through any of the methods below!</p>
        </div>

        <div className={styles.contactDetails}>
          <div className={styles.contactItem}>
            <FaEnvelope className={styles.icon} />
            <div>
              <span className={styles.contactText}>bhuvantenguria37@gmail.com</span>
              <a href="mailto:bhuvantenguria37@gmail.com" className={styles.contactLink}>Send an Email</a>
            </div>
          </div>
          
          <div className={styles.contactItem}>
            <FaPhone className={styles.icon} />
            <div>
              <span className={styles.contactText}>+91 8433076329</span>
              <a href="tel:+918433076329" className={styles.contactLink}>Call Me</a>
            </div>
          </div>
          
          <div className={styles.contactItem}>
            <FaLinkedin className={styles.icon} />
            <div>
              <span className={styles.contactText}>Bhuvan Tenguria</span>
              <a href="https://www.linkedin.com/in/bhuvan-tenguria-71902b238/" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                View LinkedIn Profile <FaExternalLinkAlt />
              </a>
            </div>
          </div>
          
          <div className={styles.contactItem}>
            <FaExternalLinkAlt className={styles.icon} />
            <div>
              <span className={styles.contactText}>Portfolio</span>
              <a href="https://bhuvantenguria.com" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                View Portfolio <FaExternalLinkAlt />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
