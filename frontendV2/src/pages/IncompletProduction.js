import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IncompletProduction.css';

const IncompleteProductionOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncompleteOrders();
  }, []);

  const fetchIncompleteOrders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/analytics/production/incomplete/');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching incomplete production orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (orderId) => {
    if (window.confirm('Are you sure you want to mark this order as completed?')) {
      try {
        await axios.patch(`http://127.0.0.1:8000/api/production-orders/${orderId}/update-status/`, {
          status: 'completed',
        });
        alert('Order marked as completed.');
        fetchIncompleteOrders();
      } catch (err) {
        console.error('Failed to update status:', err);
        alert('An error occurred while updating the status.');
      }
    }
  };

  return (
    <div className="incomplete-orders-page">
      <h2 className="section-title">Incomplete Production Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No incomplete orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Employee</th>
              <th>Start Date</th>
              <th>Expected End Date</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Product Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.employee}</td>
                <td>{order.start_date}</td>
                <td>{order.expected_end_date}</td>
                <td>{order.status}</td>
                <td>{order.notes}</td>
                <td>
                  <ul className="product-list">
                    {order.details.map((detail, idx) => (
                      <li key={idx}>
                        Product: {detail.product} | Quantity: {detail.quantity} | Status: {detail.status}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button className="complete-btn" onClick={() => markAsCompleted(order.id)}>
                    Mark as Completed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IncompleteProductionOrdersPage;
