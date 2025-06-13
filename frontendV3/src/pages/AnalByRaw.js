import React from 'react';
import { Link } from 'react-router-dom';
import './Analsie.css';


const Analsie = () => {
  return (
    <div className="analsie-container">
      <h2 className="analsie-header">Analysis Dashboard - Raw Material Insights</h2>
      <div className="analsie-links">
        <Link to="/AnalRawMaterialUsagePage" className="analsie-btn">
          Raw Material Usage
        </Link>
        <Link to="/AnalRawMaterialCostPage" className="analsie-btn">
          Raw Material Cost
        </Link>
        <Link to="/AnalCostStokRaw" className="analsie-btn">
          Cost & Stock Value
        </Link>
      </div>
    </div>
  );
};

export default Analsie;
