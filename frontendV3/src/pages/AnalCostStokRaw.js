import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import './RawMaterialPieChartsPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const RawMaterialPieChartsPage = () => {
  const [stockData, setStockData] = useState(null);
  const [costData, setCostData] = useState(null);

  useEffect(() => {
    fetchStockData();
    fetchCostData();
  }, []);

  const fetchStockData = async () => {
    try {
      const res = await axiosInstance.get('analytics/raw-material-stock-pie/');
      const labels = res.data.map(item => item.name);
      const quantities = res.data.map(item => parseFloat(item.quantity));
      setStockData({
        labels,
        datasets: [{
          label: 'Stock Quantity',
          data: quantities,
          backgroundColor: generateColors(labels.length),
        }]
      });
    } catch (err) {
      console.error('Error fetching stock data:', err);
    }
  };

  const fetchCostData = async () => {
    try {
      const res = await axiosInstance.get('analytics/raw-material-cost-pie/');
      const labels = res.data.map(item => item.name);
      const costs = res.data.map(item => parseFloat(item.total_cost));
      setCostData({
        labels,
        datasets: [{
          label: 'Total Money Spent',
          data: costs,
          backgroundColor: generateColors(labels.length),
        }]
      });
    } catch (err) {
      console.error('Error fetching cost data:', err);
    }
  };

  const generateColors = (count) => {
    const baseColors = [
      '#FF6384', '#36A2EB', '#FFCE56',
      '#4BC0C0', '#9966FF', '#FF9F40',
      '#00C49F', '#FF6B6B', '#FFD93D', '#6A4C93'
    ];
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  return (
    <div className="raw-pie-container">
      <h2 className="raw-pie-title">Raw Materials Analysis: Stock & Cost</h2>
      <div className="raw-pie-charts">
        <div className="raw-pie-box">
          <h4>Stock Quantity Share</h4>
          {stockData ? <Pie data={stockData} /> : <p className="raw-loading">Loading...</p>}
        </div>

        <div className="raw-pie-box">
          <h4>Spending Share on Raw Materials</h4>
          {costData ? <Pie data={costData} /> : <p className="raw-loading">Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default RawMaterialPieChartsPage;