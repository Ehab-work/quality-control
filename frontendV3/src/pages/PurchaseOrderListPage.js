import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './PurchaseOrderListPage.css';

const PurchaseOrderListPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('list_purchase_orders/');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase order?')) return;
    try {
      await axiosInstance.delete(`purchase-orders/${id}/delete/`);
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const handleEdit = (id) => {
    window.location.href = `purchase-orders/${id}/update/`; // أو استخدم useNavigate من React Router إذا متاح
  };

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank');
    const content = 
      <html>
        <head>
          <title>Purchase Order #${order.id}</title>
          
        </head>
        <body>
          <h2>Purchase Order #${order.id}</h2>
          <p><strong>Supplier:</strong> ${order.supplier_name}</p>
          <p><strong>Employee:</strong> ${order.employee_name}</p>
          <p><strong>Date:</strong> ${order.order_date}</p>
          <p><strong>Total:</strong> ${order.total_amount} EGP</p>
          <h3>Details</h3>
          <table>
            <thead>
              <tr><th>Raw Material</th><th>Quantity</th><th>Unit Price</th></tr>
            </thead>
            <tbody>
              ${order.details.map(item => 
                <tr>
                  <td>${item.raw_material_name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit_price}</td>
                </tr>
              ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    ;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
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
          <div style={{ marginTop: '15px' }}>
            <button className="edit-btn" onClick={() => handleEdit(order.id)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(order.id)}>Delete</button>
            <button className="print-btn" onClick={() => handlePrint(order)}>Print</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchaseOrderListPage;