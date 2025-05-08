// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const Production = () => {
  const buttonStyle = {
    display: 'block',
    margin: '10px 0',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    width: '200px',
    textAlign: 'center',
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>لوحة التحكم -  مبيعاتع</h2>
      <div style={{ marginTop: '20px' }}>
   
         <Link to="/ProductRatioPage" style={buttonStyle}> نسب التصنيع </Link>
         <Link to="/production-orders" style={buttonStyle}>أمر تصنيع</Link>
         <Link to="/ProductPage" style={buttonStyle}>المنتجات</Link>
         <Link to="/production-orders-list" style={buttonStyle}>عرض أوامر التصنيع</Link>
        

      </div>
    </div>
  );
};

export default Production;