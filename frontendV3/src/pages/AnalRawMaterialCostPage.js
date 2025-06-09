import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import './RawMaterialCostPage.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const RawMaterialCostPage = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/analytics/raw-material-costs/');
      const labels = res.data.map(item => item.raw_material__name);
      const data = res.data.map(item => item.total_spent);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Total Amount Spent (EGP)',
            data: data,
            backgroundColor: 'rgba(94, 231, 223, 0.8)',
            borderColor: '#057e76',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      console.error('Error fetching raw material costs:', err);
    }
  };

  return (
    <div className="cost-container">
      <h2 className="cost-title">Raw Material Cost Analysis</h2>
      {chartData ? (
        <div className="cost-chart">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: 'white' } },
                title: {
                  display: true,
                  text: 'Raw Materials and Expenditures',
                  color: 'white',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'EGP', color: 'white' },
                  ticks: { color: 'white' }
                },
                x: {
                  title: { display: true, text: 'Raw Materials', color: 'white' },
                  ticks: { color: 'white' }
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="cost-loading">Loading data...</p>
      )}
    </div>
  );
};

export default RawMaterialCostPage;
