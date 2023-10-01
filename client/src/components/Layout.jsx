// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="Layout">
      <Header />
      <main className="Content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
