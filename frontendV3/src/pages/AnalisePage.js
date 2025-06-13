import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './AnaliseLayout.css';

const navOptions = [
  { title: 'Client Insights', to: '/AnalByrequat' },
  { title: 'Employee Performance', to: '/AnalByemployee' },
  { title: 'Raw Material Insights', to: '/AnalByRaw' },
  { title: 'Product Insights', to: '/AnalByProduct' },
];




const Analise = () => {
  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (!accessToken || !role) {
    return <Navigate to="/" />;
  }

  if (role.toLowerCase() !== 'ceo') {
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
        <h2 className="split-title">Insights Menu</h2>

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
        <h2 className="welcome-title">Welcome to Insights & Analysis</h2>
        <p className="welcome-text">
          Use the left menu to explore visual dashboards and discover performance trends across clients, employees, materials, and products.
        </p>
      </div>
    </div>
  );
};

export default Analise;
