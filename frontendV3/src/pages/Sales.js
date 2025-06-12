import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './Sales.css';

const navOptions = [
  { title: 'Clients', to: '/ClientPage' },
  { title: 'Make Quotation', to: '/SalesOrderPage' },
  { title: 'View Quotations', to: '/SalesOrderListPage' },
  { title: 'Invoices', to: '/SalesByClientPage' },
  { title: 'In Progress Orders', to: '/SalseorderNotcomplet' },
  { title: 'Orders Ready to Go', to: '/SalesOrderdone' },
];

const Sales = () => {
  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (!accessToken || !role) {
    return <Navigate to="/" />;
  }

  if (role.toLowerCase() !== 'sales') {
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
        <h2 className="split-title">Sales Menu</h2>

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
        <h2 className="welcome-title">Welcome to the Sales Section</h2>
        <p className="welcome-text">
          Use the left menu to manage clients, create quotations, and track orders.
        </p>
      </div>
    </div>
  );
};

export default Sales;
