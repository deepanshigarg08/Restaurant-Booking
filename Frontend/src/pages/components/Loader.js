// components/Loader.js
import React from 'react';
import styles from '../../styles/Loader.module.css'; // We'll create this CSS file for styling

const Loader = ({ isLoading }) => {
  if (!isLoading) return null; // Don't show the loader if isLoading is false

  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default Loader;
