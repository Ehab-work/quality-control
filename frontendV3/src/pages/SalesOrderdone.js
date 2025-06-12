import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // 🔁 استبدل axios بـ axiosInstance
import './SalesOrderdone.css';

const ConfirmedSalesOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('sales-orders/ready-to-archive/'); // 🔁 استبدل axios بـ axiosInstance
      setOrders(res.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsReceived = async (orderId) => {
    try {
      await axiosInstance.patch(`sales-orders/${orderId}/mark-delivered/`); // 🔁 استبدل axios بـ axiosInstance
      alert(`Order #${orderId} marked as "Delivered"`);
      fetchOrders();
    } catch (err) {
      alert('An error occurred while updating the order');
      console.error(err);
    }
  };

  return (
    <div className="confirmed-orders-page">
      <h2 className="section-title">Orders Ready for Delivery</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="loading-text">No orders available.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <h4>Invoice #{order.id}</h4>
            <p><strong>Employee:</strong> {order.employee}</p>
            <p><strong>Client:</strong> {order.client}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Sale Date:</strong> {order.sale_date}</p>
            <p><strong>Delivery Deadline:</strong> {order.delivery_deadline}</p>
            <p><strong>Notes:</strong> {order.notes}</p>
            <h5>Product Details:</h5>
            <ul>
              {order.details.map(detail => (
                <li key={detail.id}>
                  Product: {detail.product} | Qty: {detail.quantity} | Price: {detail.unit_price} | Tax: {detail.taxes}
                </li>
              ))}
            </ul>
            <button className="confirm-btn" onClick={() => markAsReceived(order.id)}>
              Confirm Delivery
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ConfirmedSalesOrdersPage;