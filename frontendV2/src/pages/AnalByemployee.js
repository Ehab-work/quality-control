import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './SalesByDatePage.css';

const SalesByDatePage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    setLoading(true);
    axios
      .get('http://127.0.0.1:8000/api/sales-summary-by-date/', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      })
      .then((res) => {
        const labels = res.data.map(item => item.product__name);
        const data = res.data.map(item => item.total_quantity);

        setChartData({
          labels,
          datasets: [{
            label: 'Total Quantity Sold',
            data,
            backgroundColor: 'rgba(94, 231, 223, 0.7)',
            borderColor: '#8604a0',
            borderWidth: 1,
          }]
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  return (
    <div className="sales-date-container">
      <h2 className="sales-title">Sales Analysis by Date</h2>

      <div className="sales-filter">
        <label>From:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>To:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchData}>Fetch</button>
      </div>

      {loading && <p className="sales-loading">Loading data...</p>}
      {!loading && chartData && (
        <div className="sales-chart-box">
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
};

export default SalesByDatePage;
