import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // ✅ يستخدم التوكن تلقائيًا
import './SalesOrderPage.css';

const SalesOrderPage = () => {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    employee: '',
    client: '',
    delivery_deadline: '',
    notes: '',
    details: []
  });
  const [detail, setDetail] = useState({
    product: '',
    quantity: '',
    unit_price: '',
    taxes: 0
  });

  useEffect(() => {
    axiosInstance.get('clients/').then(res => setClients(res.data));
    axiosInstance.get('employees/').then(res => setEmployees(res.data));
    axiosInstance.get('products/').then(res => setProducts(res.data));
  }, []);

  const handleAddDetail = () => {
    if (!detail.product || !detail.quantity || !detail.unit_price)
      return alert("Please fill in all product details");

    const total_price = detail.quantity * detail.unit_price + parseFloat(detail.taxes || 0);
    setForm({
      ...form,
      details: [...form.details, { ...detail, total_price }]
    });
    setDetail({ product: '', quantity: '', unit_price: '', taxes: 0 });
  };

  const handleDeleteDetail = (index) => {
    const updatedDetails = [...form.details];
    updatedDetails.splice(index, 1);
    setForm({ ...form, details: updatedDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sale_date = new Date().toISOString().split('T')[0];
    try {
      await axiosInstance.post('sales-orders/create/', {
        ...form,
        sale_date
      });
      alert('Sales order recorded successfully');
      setForm({ employee: '', client: '', delivery_deadline: '', notes: '', details: [] });
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving');
    }
  };

  return (
    <div className="sales-page">
      <h2 className="section-title">Create Sales Order</h2>
      <form onSubmit={handleSubmit} className="sales-form">
        <div className="form-row">
          <label>Employee:</label>
          <select value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })}>
            <option value="">Select</option>
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>Client:</label>
          <select value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}>
            <option value="">Select</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>Delivery Deadline:</label>
          <input type="date" value={form.delivery_deadline} onChange={e => setForm({ ...form, delivery_deadline: e.target.value })} />
        </div>

        <div className="form-row">
          <label>Notes:</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}></textarea>
        </div>

        <hr />
        <h4>Add Product to Invoice</h4>
        <div className="detail-form">
          <select value={detail.product} onChange={e => setDetail({ ...detail, product: e.target.value })}>
            <option value="">Select Product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="number" placeholder="Quantity" value={detail.quantity} onChange={e => setDetail({ ...detail, quantity: parseInt(e.target.value) })} />
          <input type="number" placeholder="Unit Price" value={detail.unit_price} onChange={e => setDetail({ ...detail, unit_price: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Taxes" value={detail.taxes} onChange={e => setDetail({ ...detail, taxes: parseFloat(e.target.value) })} />
          <button type="button" onClick={handleAddDetail}>Add Product</button>
        </div>

        <table className="detail-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Taxes</th>
              <th>Total</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {form.details.map((d, idx) => (
              <tr key={idx}>
                <td>{products.find(p => p.id == d.product)?.name}</td>
                <td>{d.quantity}</td>
                <td>{d.unit_price}</td>
                <td>{d.taxes}</td>
                <td>{d.total_price}</td>
                <td>
                  <button className="delete-detail-btn" onClick={() => handleDeleteDetail(idx)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="submit-btn">Save Invoice</button>
      </form>
    </div>
  );
};

export default SalesOrderPage;
