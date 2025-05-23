import React from 'react';
import { Link } from 'react-router-dom';
import './Sales.css';

const Sales = () => {
  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Sales Menu</h2>
        <Link to="/ClientPage" className="split-card">Clients</Link>
        <Link to="/SalesOrderPage" className="split-card">Make Quotation</Link>
        <Link to="/SalesOrderListPage" className="split-card">View Quotations</Link>
        <Link to="/SalesByClientPage" className="split-card">Invoices</Link>
        <Link to="/SalseorderNotcomplet" className="split-card">In Progress Orders</Link>
        <Link to="/SalesOrderdone" className="split-card">Orders Ready to Go</Link>
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
