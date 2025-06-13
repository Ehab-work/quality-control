import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // ✅ استخدم instance المحمي
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import './AnalByrequat.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analsie = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientSalesShare();
  }, []);

  const fetchClientSalesShare = async () => {
    try {
      const res = await axiosInstance.get('analytics/client-sales-share/');
      setSalesData(res.data);
    } catch (err) {
      console.error('Error loading sales share:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: salesData.map(item => item["sale__client__name"]), // ✅ المفتاح الصحيح
    datasets: [
      {
        label: 'Total Sales (EGP)',
        data: salesData.map(item => item["total_sales"]),
        backgroundColor: [
          '#057e76', '#8604a0', '#5ee7df', '#00b3b3',
          '#d6336c', '#ffc107', '#20c997'
        ],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
    },
  };

  return (
    <div className="analytics-page">
      <h2 className="section-title">Sales Analytics Dashboard</h2>

      <div className="analytics-links">
        <Link to="/AnalByrequatTop5" className="analytics-btn">
          Top 5 Products Per Client
        </Link>
        <Link to="/Analcsonyear" className="analytics-btn">
          Seasonal Order Distribution
        </Link>
        <Link to="/AnalClientOrderSummaryPage" className="analytics-btn">
          Client Order & Sales Summary
        </Link>
      </div>

      <h3 className="chart-title">Client Sales Share</h3>
      {loading ? (
        <p>Loading sales data...</p>
      ) : (
        <div className="chart-container">
          <Pie data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Analsie;