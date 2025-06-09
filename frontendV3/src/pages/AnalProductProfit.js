import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './ProductProfitAnalysisPage.css';

ChartJS.register(
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const ProductProfitAnalysisPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/analytics/product-profit-analysis/');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching profit data:', err);
    }
  };

  const barData = {
    labels: data.map(item => item.product__name),
    datasets: [
      {
        label: 'Total Profit (EGP)',
        data: data.map(item => item.total_profit),
        backgroundColor: 'rgba(94, 231, 223, 0.7)',
        borderColor: '#057e76',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: data.map(item => item.product__name),
    datasets: [
      {
        label: 'Profit Share (%)',
        data: data.map(item => item.profit_share),
        backgroundColor: [
          '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236',
          '#166a8f', '#00a950', '#58595b', '#8549ba'
        ],
      },
    ],
  };

  return (
    <div className="profit-container">
      <h2 className="profit-title">Product Profit Analysis</h2>
      <p className="profit-description">
        The charts below show total profit by product and each product's share of the overall profit.
      </p>

      <div className="profit-bar">
        <Bar data={barData} />
      </div>

      <div className="profit-pie">
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default ProductProfitAnalysisPage;
