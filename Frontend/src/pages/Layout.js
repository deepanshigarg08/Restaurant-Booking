import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/Layout.module.css'; // Optional: for styling the layout

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
