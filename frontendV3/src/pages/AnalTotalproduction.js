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
import './ProductionTotalByProduct.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ProductionTotalByProduct = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/analytics/production-total-per-product/');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch production data:', err);
    }
  };

  const chartData = {
    labels: data.map(item => item.product__name),
    datasets: [
      {
        label: 'Total Units Produced',
        data: data.map(item => item.total_produced),
        backgroundColor: 'rgba(94, 231, 223, 0.7)',
        borderColor: '#057e76',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units Produced',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Product Name',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="production-chart-container">
      <h2 className="production-chart-title">Total Production by Product</h2>
      <div className="production-chart-box">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ProductionTotalByProduct;
