import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; 
import './SalesByClientPage.css';

const SalesByClientPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState({});
  const [products, setProducts] = useState({});

  useEffect(() => {
    fetchClients();
    fetchEmployees();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axiosInstance.get('clients/');
      setClients(res.data);  // ✅ إصلاح الخطأ هنا
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get('employees/'); 
      const map = {};
      res.data.forEach(e => map[e.id] = e.name);
      setEmployees(map);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('products/'); 
      const map = {};
      res.data.forEach(p => map[p.id] = p.name);
      setProducts(map);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchOrdersByClient = async () => {
    if (!selectedClient) return;
    try {
      const res = await axiosInstance.get(`sales-orders/by-client/${selectedClient}/`); 
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
          <p><strong>Employee:</strong> {employees[order.employee] || 'N/A'}</p>
          <p><strong>Sale Date:</strong> {order.sale_date}</p>
          <p><strong>Delivery Deadline:</strong> {order.delivery_deadline}</p>
          <p><strong>Notes:</strong> {order.notes}</p>
          <p><strong>Total:</strong> {order.total_amount} EGP</p>
          <h5>Products:</h5>
          <ul>
            {order.details.map((d, idx) => (
              <li key={idx}>
                {products[d.product] || 'Product'} - Qty: {d.quantity} - Price: {d.unit_price} - Tax: {d.taxes} - Total: {d.total_price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SalesByClientPage;