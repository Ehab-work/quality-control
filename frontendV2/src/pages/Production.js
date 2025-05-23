// src/pages/Production.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductionLayout.css';

const Production = () => {
  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Production Menu</h2>
        <Link to="/ProductRatioPage" className="split-card">Recipes</Link>
        <Link to="/ProductPage" className="split-card">Products</Link>
        <Link to="/production-orders" className="split-card">Make Production Order</Link>
        <Link to="/production-orders-list" className="split-card">View Production Orders</Link>
        <Link to="/IncompletProduction" className="split-card">In Progress Orders</Link>
        <Link to="/ColorAnalyzer" className="split-card">Photo Checker</Link>
      </div>
      <div className="split-right">
        <h2 className="welcome-title">Welcome to Production</h2>
        <p className="welcome-text">
          Use the left menu to manage products, create production orders, and verify outputs.
        </p>
      </div>
    </div>
  );
};

export default Production;
