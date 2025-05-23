// src/pages/ProductionOrderPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductionOrderPage.css';

const ProductionOrderPage = () => {
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    employee: '',
    start_date: '',
    expected_end_date: '',
    status: 'planned',
    notes: '',
    details: []
  });
  const [newDetail, setNewDetail] = useState({ product: '', quantity: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchProducts();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/employees/');
    setEmployees(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/products/');
    setProducts(res.data);
  };

  const handleDetailAdd = () => {
    if (!newDetail.product || !newDetail.quantity || parseInt(newDetail.quantity) <= 0) {
      setError('All fields are required and quantity must be a positive integer.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      details: [...prev.details, {
        product: parseInt(newDetail.product),
        quantity: parseInt(newDetail.quantity)
      }]
    }));

    setNewDetail({ product: '', quantity: '' });
    setError('');
  };

  const handleDetailEdit = (index) => {
    const item = formData.details[index];
    setNewDetail({ product: item.product.toString(), quantity: item.quantity.toString() });

    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData(prev => ({ ...prev, details: updatedDetails }));
  };

  const handleDetailDelete = (index) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData(prev => ({ ...prev, details: updatedDetails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee || !formData.start_date || !formData.expected_end_date || formData.details.length === 0) {
      setError('Please fill in all required fields and add at least one product.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/create-production-order/', {
        employee: formData.employee,
        start_date: formData.start_date,
        expected_end_date: formData.expected_end_date,
        status: formData.status,
        notes: formData.notes,
        input_details: formData.details
      });

      alert('Production order created successfully.');
      setFormData({
        employee: '',
        start_date: '',
        expected_end_date: '',
        status: 'planned',
        notes: '',
        details: []
      });
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting.');
    }
  };

  return (
    <div className="production-order-page">
      <h2 className="section-title">Create Production Order</h2>
      <form onSubmit={handleSubmit} className="production-form">

        <label>Employee:</label>
        <select
          name="employee"
          value={formData.employee}
          onChange={e => setFormData({ ...formData, employee: e.target.value })}
          required
        >
          <option value="">-- Select Employee --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>

        <label>Start Date:</label>
        <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} required />

        <label>Expected End Date:</label>
        <input type="date" value={formData.expected_end_date} onChange={e => setFormData({ ...formData, expected_end_date: e.target.value })} required />

        <label>Notes:</label>
        <textarea
          placeholder="Notes"
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        ></textarea>

        <h4 className="sub-title">Production Details</h4>
        <div className="detail-row">
          <select value={newDetail.product} onChange={e => setNewDetail({ ...newDetail, product: e.target.value })}>
            <option value="">-- Select Product --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newDetail.quantity}
            onChange={e => setNewDetail({ ...newDetail, quantity: e.target.value })}
          />
          <button type="button" onClick={handleDetailAdd}>Add</button>
        </div>

        <ul className="detail-list">
          {formData.details.map((d, i) => (
            <li key={i}>
              Product #{d.product} - Quantity: {d.quantity}
              <button className="edit-btn" onClick={() => handleDetailEdit(i)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDetailDelete(i)}>Delete</button>
            </li>
          ))}
        </ul>

        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="submit-btn">Save Production Order</button>
      </form>
    </div>
  );
};

export default ProductionOrderPage;
