import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import './AnalByrequatTop5.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AnalByrequatTop5 = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [average, setAverage] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/clients/')
      .then(res => {
        const options = res.data.map(client => ({
          value: client.id,
          label: client.name
        }));
        setClients(options);
      })
      .catch(err => console.error("Error fetching clients", err));
  }, []);

  const handleClientChange = async (selected) => {
    setSelectedClient(selected);
    setAverage(null);
    setChartData(null);

    try {
      const [topProductsRes, averageRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/clients/${selected.value}/top-products/`),
        axios.get(`http://127.0.0.1:8000/api/analytics/client/${selected.value}/average-order/`)
      ]);

      const labels = topProductsRes.data.map(item => item.product__name);
      const quantities = topProductsRes.data.map(item => item.total);

      setChartData({
        labels: labels,
        datasets: [{
          label: 'Top 5 Products by Quantity',
          data: quantities,
          backgroundColor: 'rgba(94, 231, 223, 0.8)',
        }]
      });

      setAverage(averageRes.data.average_order_total);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: '#5ee7df',
      color: 'black',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      color: 'black',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#eee' : 'white',
      color: 'black',
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
    }),
    input: (provided) => ({
      ...provided,
      color: 'black',
    }),
  };

  return (
    <div className="top5-container">
      <h2 className="top5-header">Client Product Analysis</h2>
      <p className="top5-description">Select a client to view their most ordered products and average order value.</p>

      <div className="top5-select">
        <Select
          options={clients}
          value={selectedClient}
          onChange={handleClientChange}
          placeholder="Search client..."
          isSearchable
          styles={customSelectStyles}
        />
      </div>

      {average !== null && (
        <p className="top5-average">
          Average Order Value: <strong>{average.toFixed(2)} EGP</strong>
        </p>
      )}

      {chartData ? (
        <div className="top5-chart">
          <Bar data={chartData} />
        </div>
      ) : (
        selectedClient && <p className="top5-no-data">No data available for this client.</p>
      )}
    </div>
  );
};

export default AnalByrequatTop5;
