import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // ✅ استخدم axiosInstance
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

import './AnalRawMaterialUsagePage.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RawMaterialUsagePage = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchRawMaterialUsage();
  }, []);

  const fetchRawMaterialUsage = async () => {
    try {
      const res = await axiosInstance.get('analytics/raw-material-usage/');
      const rawData = res.data;

      const rawMaterials = Object.keys(rawData);
      const allProducts = new Set();
      rawMaterials.forEach(material => {
        Object.keys(rawData[material]).forEach(product => allProducts.add(product));
      });

      const productList = Array.from(allProducts);
      const colors = [
        '#5ee7df', '#8604a0', '#f093fb', '#f5576c',
        '#ffc107', '#20c997', '#17a2b8', '#e83e8c'
      ];

      const datasets = productList.map((product, index) => ({
        label: product,
        data: rawMaterials.map(material => rawData[material][product] || 0),
        backgroundColor: colors[index % colors.length],
      }));

      setChartData({
        labels: rawMaterials,
        datasets: datasets,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <div className="raw-usage-container">
      <h2 className="raw-usage-title">Raw Material Usage by Product</h2>
      {chartData ? (
        <div className="raw-usage-chart">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top', labels: { color: 'white' } },
              },
              scales: {
                x: {
                  ticks: { color: 'white' },
                  title: {
                    display: true,
                    text: 'Raw Materials',
                    color: 'white'
                  }
                },
                y: {
                  ticks: { color: 'white' },
                  title: {
                    display: true,
                    text: 'Quantity Used',
                    color: 'white'
                  }
                }
              }
            }}
          />
        </div>
      ) : (
        <p className="raw-usage-loading">Loading data...</p>
      )}
    </div>
  );
};

export default RawMaterialUsagePage;