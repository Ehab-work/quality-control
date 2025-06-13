import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './PurchaseLayout.css';

const navOptions = [
  { title: 'Suppliers', to: '/suppliers' },
  { title: 'Raw Materials', to: '/raw-materials' },
  { title: 'Create PO', to: '/purchase-orders' },
  { title: 'View POs', to: '/purchase-orders-list' },
];

const Purchase = () => {



const accessToken = localStorage.getItem('access_token');
const role = localStorage.getItem('role');

if (!accessToken || !role) {
  return <Navigate to="/" />;
}

const allowedRoles = ['purchase', 'ceo']; //  أدوار مسموح لها

if (!allowedRoles.includes(role.toLowerCase())) {
  return <Navigate to="/unauthorized" />;
}


  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Purchasing Menu</h2>

        {navOptions.map(({ title, to }) => (
          <Link key={title} to={to} className="split-card">
            <span className="split-text">{title}</span>
          </Link>
        ))}

        <div className="logout-spacer" />

        <div className="split-card logout-card" onClick={handleLogout}>
          <span className="split-icon"><FiLogOut /></span>
          <span className="split-text">Log out</span>
        </div>
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
