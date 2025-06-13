// src/pages/HomePage.jsx
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiTruck, FiShoppingCart, FiBarChart2, FiLogOut } from 'react-icons/fi';
import { GiFactory } from 'react-icons/gi';
import './HomeMain.css';

const navOptions = [
  { title: 'Sales', icon: <FiTruck />, to: '/sales', role: 'Sales' },
  { title: 'Purchasing', icon: <FiShoppingCart />, to: '/purchase', role: 'Purchase' },
  { title: 'Production', icon: <GiFactory />, to: '/production', role: 'Production' },
  { title: 'Insights', icon: <FiBarChart2 />, to: '/AnalisePage', role: 'CEO' },
];

const HomePage = () => {
  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role')?.trim().toLowerCase();
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  if (!accessToken || !role) {
    return <Navigate to="/" />;
  }

  const filteredOptions = navOptions.filter(option =>
    isSuperuser ||  role === 'ceo' || option.role.toLowerCase() === role
  );

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Factory Dashboard</h2>

        {filteredOptions.map(({ title, to, icon }) => (
          <Link key={title} to={to} className="split-card">
            <span className="split-icon">{icon}</span>
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
        <h2 className="welcome-title">Welcome</h2>
        <a className ="welcome-text ">Use the left panel to manage your Factory</a>
      </div>
    </div>
  );
};

export default HomePage;