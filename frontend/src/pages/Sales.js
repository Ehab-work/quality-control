// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sales = () => {
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
   
         <Link to="/ProductPage" style={buttonStyle}>المنتجات</Link>
         <Link to="/ClientPage" style={buttonStyle}>عميلات</Link>
         <Link to="/SalesOrderPage" style={buttonStyle}>عمليه شرائت</Link>
         <Link to="/SalesOrderListPage" style={buttonStyle}>عرض عمليه شرائت</Link>


      </div>
    </div>
  );
};

export default Sales;