import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './TopSellingProductsPage.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TopSellingProductsPage = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/analytics/top-selling-products/');
      const labels = res.data.map(item => item.product__name);
      const values = res.data.map(item => item.total_sold);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Quantity Sold',
            data: values,
            backgroundColor: 'rgba(94, 231, 223, 0.7)',
            borderColor: '#057e76',
            borderWidth: 1,
          }
        ],
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <div className="top-selling-container">
      <h2 className="top-selling-title">Top Selling Products</h2>
      {chartData ? (
        <div className="top-selling-chart">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: ctx => `Quantity: ${ctx.raw}`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Quantity Sold',
                    color: 'white'
                  },
                  ticks: { color: 'white' }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Product',
                    color: 'white'
                  },
                  ticks: { color: 'white' }
                }
              }
            }}
          />
        </div>
      ) : (
        <p className="top-selling-loading">Loading data...</p>
      )}
    </div>
  );
};

export default TopSellingProductsPage;
