// src/pages/Analise.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AnaliseLayout.css';

const Analise = () => {
  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Insights Menu</h2>
        <Link to="/AnalByrequat" className="split-card">Client Insights</Link>
        <Link to="/AnalByemployee" className="split-card">Employee Performance</Link>
        <Link to="/AnalByRaw" className="split-card">Raw Material Insights</Link>
        <Link to="/AnalByProduct" className="split-card">Product Insights</Link>
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
