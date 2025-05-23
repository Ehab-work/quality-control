import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './ClientOrderSummaryPage.css';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ClientOrderSummaryPage = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/analytics/client-order-summary/');
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const chartData = {
    labels: summary.map(item => item.client__name),
    datasets: [
      {
        label: 'Total Revenue (EGP)',
        data: summary.map(item => item.total_revenue),
        backgroundColor: 'rgba(94, 231, 223, 0.8)',
      },
      {
        label: 'Total Orders',
        data: summary.map(item => item.total_orders),
        backgroundColor: 'rgba(134, 4, 160, 0.8)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'white' },
        title: {
          display: true,
          text: 'Value / Count',
          color: 'white'
        },
      },
      x: {
        ticks: { color: 'white' },
        title: {
          display: true,
          text: 'Clients',
          color: 'white'
        },
      }
    },
  };

  return (
    <div className="client-summary-container">
      <div className="summary-layout">
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="summary-text-box">
          <h2 className="summary-header">Client Comparison</h2>
          <p className="summary-description">
            This chart compares clients based on total revenue and number of orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientOrderSummaryPage;
