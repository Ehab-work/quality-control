import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // ✅ استخدم instance المحمي
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  CategoryScale,
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';
import './ClientQuarterHeatmapPage.css';

ChartJS.register(
  MatrixController,
  MatrixElement,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  CategoryScale
);

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const ClientQuarterHeatmapPage = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      const res = await axiosInstance.get('analytics/client-order-distribution/');
      setHeatmapData(res.data);
    } catch (err) {
      console.error('Error fetching heatmap data:', err);
    }
  };

  const clients = heatmapData.map((entry) => entry.client);

  const matrixData = heatmapData.flatMap((entry, yIndex) =>
    quarters.map((q, xIndex) => ({
      x: xIndex,
      y: yIndex,
      v: entry[q] || 0,
    }))
  );

  const chartData = {
    datasets: [
      {
        label: 'Order Distribution',
        data: matrixData,
        backgroundColor(ctx) {
          const value = ctx?.raw?.v || 0;
          if (value === 0) return 'rgba(200,200,200,0.3)';
          if (value < 3) return 'rgba(144,238,144,0.7)';
          if (value < 6) return 'rgba(255,204,102,0.7)';
          return 'rgba(255,99,132,0.8)';
        },
        borderWidth: 1,
        width: () => 50,
        height: () => 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => {
            const x = items[0].raw.x;
            const y = items[0].raw.y;
            return `Client: ${clients[y]}, Quarter: ${quarters[x]}`;
          },
          label: (item) => `Orders: ${item.raw.v}`,
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: quarters,
        title: {
          display: true,
          text: 'Quarter',
          color: 'white',
        },
        ticks: { color: 'white' }
      },
      y: {
        type: 'category',
        labels: clients,
        title: {
          display: true,
          text: 'Client',
          color: 'white',
        },
        ticks: { color: 'white' }
      },
    },
  };

  return (
    <div className="heatmap-container">
      <h2 className="heatmap-title">Client Quarterly Order Distribution</h2>
      <p className="heatmap-description">
        This heatmap shows how many orders each client made in each quarter.
      </p>
      <div className="heatmap-chart-box">
        <Chart type="matrix" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ClientQuarterHeatmapPage;