import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './ProductionLayout.css';

const navOptions = [
  { title: 'Recipes', to: '/ProductRatioPage' },
  { title: 'Products', to: '/ProductPage' },
  { title: 'Make Production Order', to: '/production-orders' },
  { title: 'View Production Orders', to: '/production-orders-list' },
  { title: 'In Progress Orders', to: '/IncompletProduction' },
  { title: 'Photo Checker', to: '/ColorAnalyzer' },
];

const Production = () => {
  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (!accessToken || !role) {
    return <Navigate to="/" />;
  }

  if (role.trim().toLowerCase() !== 'production') {
    return <Navigate to="/unauthorized" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Production Menu</h2>
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
        <h2 className="welcome-title">Welcome to Production</h2>
        <p className="welcome-text">
          Use the left menu to manage products, create production orders, and verify outputs.
        </p>
      </div>
    </div>
  );
};

export default Production;
