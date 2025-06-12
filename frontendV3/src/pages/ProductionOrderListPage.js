import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; 
import './ProductionOrderListPage.css';

const ProductionOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [employees, setEmployees] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orderRes, productRes, employeeRes] = await Promise.all([
        axiosInstance.get('production-orders/'),
        axiosInstance.get('products/'),
        axiosInstance.get('employees/')
      ]);

      setOrders(orderRes.data);

      const productMap = {};
      productRes.data.forEach(p => { productMap[p.id] = p.name; });
      setProducts(productMap);

      const employeeMap = {};
      employeeRes.data.forEach(e => { employeeMap[e.id] = e.name; });
      setEmployees(employeeMap);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axiosInstance.patch(`${orderId}/update-status/`, {
        status: newStatus
      });
      alert(res.data.message || 'Order status updated successfully.');
      fetchData();
    } catch (err) {
      console.error('Order status update error:', err.response || err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert(`Error updating order: ${msg}`);
    }
  };

  const updateProductStatus = async (detailId, newStatus) => {
    try {
      const res = await axiosInstance.patch(`${detailId}/update-status/`, {
        status: newStatus
      });
      alert(res.data.message || 'Product status updated successfully.');
      fetchData();
    } catch (err) {
      console.error('Product status update error:', err.response || err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert(`Error updating product: ${msg}`);
    }
  };

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="production-list-page">
      <h2 className="section-title">Production Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <h4>Order #{order.id}</h4>
          <p><strong>Employee:</strong> {employees[order.employee]}</p>
          <p><strong>From:</strong> {order.start_date} <strong>To:</strong> {order.expected_end_date}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <button className="complete-btn" onClick={() => updateOrderStatus(order.id, 'completed')}>
            Mark as Completed
          </button>
          <p><strong>Notes:</strong> {order.notes}</p>

          <h5>Product Details:</h5>
          <ul className="product-list">
            {order.details.map(detail => (
              <li key={detail.id}>
                {products[detail.product]} – Quantity: {detail.quantity} – Status:
                <select
                  value={detail.status}
                  onChange={e => updateProductStatus(detail.id, e.target.value)}
                  className="status-select"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProductionOrderListPage;
