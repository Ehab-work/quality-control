import React from 'react';
import { Link } from 'react-router-dom';
import './Production.css';

const Production = () => {
  return (
    <div className="production-container">
      <h2 className="production-title">Production Insights Dashboard</h2>
      <div className="production-links">
        <Link to="/AnalTotalproduction" className="production-btn">
          Total Production Analysis
        </Link>
        <Link to="/Analtopsale" className="production-btn">
          Top Selling Products
        </Link>
        <Link to="/AnalProductProfit" className="production-btn">
          Product Profit Share
        </Link>
      </div>
    </div>
  );
};

export default Production;
