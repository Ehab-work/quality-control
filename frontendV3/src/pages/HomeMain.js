import React from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiShoppingCart, FiBarChart2, FiLogOut } from 'react-icons/fi';
import { GiFactory } from 'react-icons/gi';
import './HomeMain.css';

const navOptions = [
  { title: ' Sales', icon: <FiTruck />, to: '/sales' },
  { title: ' Purchasing', icon: <FiShoppingCart />, to: '/purchase' },
  { title: ' Production', icon: <GiFactory />, to: '/production' },
  { title: ' Insights', icon: <FiBarChart2 />, to: '/AnalisePage' },
];

const HomePage = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Factory Dashboard</h2>

        {navOptions.map(({ title, icon, to }) => (
          <Link key={title} to={to} className="split-card">
            <span className="split-icon">{icon}</span>
            <span className="split-text">{title}</span>
          </Link>
        ))}

        {/* Spacer */}
        <div className="logout-spacer" />

        {/* Styled logout item like others */}
        <div className="split-card logout-card" onClick={handleLogout}>
          <span className="split-icon"><FiLogOut /></span>
          <span className="split-text">Log out</span>
        </div>
      </div>

      <div className="split-right">
        <h2 className="welcome-title">Welcome</h2>
        <p className="welcome-text">
          Use the left panel to manage your Factory
        </p>
      </div>
    </div>
  );
};

export default HomePage;
