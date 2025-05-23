import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesByClientPage.css';

const SalesByClientPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchEmployees();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/clients/');
    setClients(res.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/employees/');
    const map = {};
    res.data.forEach(e => map[e.id] = e.name);
    setEmployees(map);
  };

  const fetchProducts = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/products/');
    const map = {};
    res.data.forEach(p => map[p.id] = p.name);
    setProducts(map);
  };

  const fetchOrdersByClient = async () => {
    if (!selectedClient) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/sales-orders/by-client/${selectedClient}/`);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  return (
    <div className="sales-client-page">
      <h2 className="section-title">Sales Invoices by Client</h2>

      <div className="client-select-bar">
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="client-select"
        >
          <option value="">-- Select Client --</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
        <button className="load-btn" onClick={fetchOrdersByClient}>Load Invoices</button>
      </div>

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <h4>Invoice #{order.id}</h4>
          <p><strong>Employee:</strong> {employees[order.employee]}</p>
          <p><strong>Sale Date:</strong> {order.sale_date}</p>
          <p><strong>Delivery Deadline:</strong> {order.delivery_deadline}</p>
          <p><strong>Notes:</strong> {order.notes}</p>
          <p><strong>Total:</strong> {order.total_amount} EGP</p>
          <h5>Products:</h5>
          <ul>
            {order.details.map((d, idx) => (
              <li key={idx}>
                {products[d.product]} - Qty: {d.quantity} - Price: {d.unit_price} - Tax: {d.taxes} - Total: {d.total_price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SalesByClientPage;
