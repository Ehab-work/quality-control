import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PurchaseOrderListPage.css';

const PurchaseOrderListPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/list_purchase_orders/');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <div className="purchase-order-list-page">
      <h2 className="section-title">Purchase Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <h4>Order #{order.id}</h4>
          <p><strong>Supplier:</strong> {order.supplier_name}</p>
          <p><strong>Employee:</strong> {order.employee_name}</p>
          <p><strong>Date:</strong> {order.order_date}</p>
          <p><strong>Total:</strong> {order.total_amount} EGP</p>
          <h5>Details:</h5>
          <ul>
            {order.details.map((item, i) => (
              <li key={i}>
                {item.raw_material_name} - Qty: {item.quantity} - Price: {item.unit_price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PurchaseOrderListPage;
