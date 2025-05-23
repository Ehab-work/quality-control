import React from 'react';
import { Link } from 'react-router-dom';
import './PurchaseLayout.css';

const Purchase = () => {
  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Purchasing Menu</h2>
        <Link to="/suppliers" className="split-card">Suppliers</Link>
        <Link to="/raw-materials" className="split-card">Raw Materials</Link>
        <Link to="/purchase-orders" className="split-card">Create PO</Link>
        <Link to="/purchase-orders-list" className="split-card">View POs</Link>
      </div>
      <div className="split-right">
        <h2 className="welcome-title">Welcome to Purchasing</h2>
        <p className="welcome-text">
          Use the left menu to manage suppliers, raw materials, and purchase orders.
        </p>
      </div>
    </div>
  );
};

export default Purchase;
