import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import './SalesOrderListPage.css';

const SalesOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState({});
  const [employees, setEmployees] = useState({});
  const [products, setProducts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, clientsRes, employeesRes, productsRes] = await Promise.all([
        axiosInstance.get('sales-orders/unconfirmed/'),
        axiosInstance.get('clients/'),
        axiosInstance.get('employees/'),
        axiosInstance.get('products/')
      ]);

      setOrders(ordersRes.data);
      console.log("Fetched Orders:", ordersRes.data); // debug

      const mapById = (list) => list.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});
      setClients(mapById(clientsRes.data));
      setEmployees(mapById(employeesRes.data));
      setProducts(mapById(productsRes.data));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axiosInstance.delete(`sales-orders/${id}/delete/`);
        alert('Invoice deleted successfully');
        fetchData();
      } catch (err) {
        alert('Failed to delete invoice');
        console.error(err);
      }
    }
  };

  const updateStatus = async (id) => {
    try {
      
      await axiosInstance.patch(`sales-orders/${id}/client-confirm/`, {
        client_status: 'confirmed'
      });
      alert('Status updated successfully');
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleEdit = (id) => {
    navigate(`sales-orders/${id}/update/`);
  };

  const printInvoice = (order) => {
    alert(`Printing invoice #${order.id}`);
  };

  return (
    <div className="sales-list-page">
      <h2 className="section-title">Sales Invoices</h2>

      {orders.length === 0 ? (
        <p>No sales orders available.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <h4>Invoice #{order.id}</h4>
            <p><strong>Employee:</strong> {employees[order.employee]}</p>
            <p><strong>Client:</strong> {clients[order.client]}</p>
            <p><strong>Sale Date:</strong> {order.sale_date}</p>
            <p><strong>Delivery Deadline:</strong> {order.delivery_deadline}</p>
            <p><strong>Client Status:</strong> {order.client_status}</p>
            <p><strong>Order Status:</strong> {order.status}</p>
            <p><strong>Notes:</strong> {order.notes}</p>
            <p><strong>Total:</strong> {order.total_amount} EGP</p>

            <h5>Product Details:</h5>
            <ul>
              {order.details.map((d, idx) => (
                <li key={idx}>
                  {products[d.product]} | Qty: {d.quantity} | Price: {d.unit_price} | Tax: {d.taxes} | Total: {d.total_price}
                </li>
              ))}
            </ul>

            <div className="order-actions">
              <button className="delete-btn" onClick={() => deleteOrder(order.id)}>Delete</button>
              <button className="status-btn" onClick={() => updateStatus(order.id)}>Confirm</button>
              <button className="print-btn" onClick={() => printInvoice(order)}>Print</button>
              <button className="edit-btn" onClick={() => handleEdit(order.id)}>Edit</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SalesOrderListPage;