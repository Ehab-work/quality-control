// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomeMain = () => {
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
      <h2>لوحة التحكم - نظام إدارة المصنع</h2>
      <div style={{ marginTop: '20px' }}>
        <Link to="/Sales" style={buttonStyle}>مبيعات</Link>
        <Link to="/Purchase" style={buttonStyle}>مشتريات</Link>
        <Link to="/Production" style={buttonStyle} > انتاج </Link>
        {/* ممكن تضيف المزيد هنا لاحقًا */}
        {/* <Link to="/clients" style={buttonStyle}>العملاء</Link> */}
        {/* <Link to="/products" style={buttonStyle}>المنتجات</Link> */}
        {/* <Link to="/analysis" style={buttonStyle}>التحليلات</Link> */}
      </div>
    </div>
  );
};

export default HomeMain;