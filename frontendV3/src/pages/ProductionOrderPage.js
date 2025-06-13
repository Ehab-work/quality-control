import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './ProductionOrderPage.css';

const ProductionOrderPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    start_date: '',
    expected_end_date: '',
    notes: '',
    details: []
  });
  const [newDetail, setNewDetail] = useState({ product: '', quantity: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('products/');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
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
    setError('');
    setSuccess('');

    if (!formData.start_date || !formData.expected_end_date || formData.details.length === 0) {
      setError('Please fill in all required fields and add at least one product.');
      return;
    }

    try {
      const payload = {
        start_date: formData.start_date,
        expected_end_date: formData.expected_end_date,
        notes: formData.notes,
        input_details: formData.details
      };

      await axiosInstance.post('create-production-order/', payload);
      setSuccess('Production order created successfully.');

      setFormData({
        start_date: '',
        expected_end_date: '',
        notes: '',
        details: []
      });
    } catch (err) {
      console.error('Response:', err.response?.data);
      console.error('Status:', err.response?.status);
      setError(
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        'An error occurred while submitting.'
      );
    }
  };

  return (
    <div className="production-order-page">
      <h2 className="section-title">Create Production Order</h2>
      <form onSubmit={handleSubmit} className="production-form">
        <label>Start Date:</label>
        <input
          type="date"
          value={formData.start_date}
          onChange={e => setFormData({ ...formData, start_date: e.target.value })}
          required
        />

        <label>Expected End Date:</label>
        <input
          type="date"
          value={formData.expected_end_date}
          onChange={e => setFormData({ ...formData, expected_end_date: e.target.value })}
          required
        />

        <label>Notes:</label>
        <textarea
          placeholder="Notes"
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        ></textarea>

        <h4 className="sub-title">Production Details</h4>
        <div className="detail-row">
          <select value={newDetail.product} onChange={e => setNewDetail({ ...newDetail, product: e.target.value })}>
            <option value="">--Select Product--</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newDetail.quantity}
            onChange={e => setNewDetail({ ...newDetail, quantity: e.target.value })}
            min="1"
          />
          <button type="button" onClick={handleDetailAdd}>Add</button>
        </div>

        <ul className="detail-list">
          {formData.details.map((d, i) => {
            const productName = products.find(p => p.id === d.product)?.name || `#${d.product}`;
            return (
              <li key={i}>
                Product: {productName} - Quantity: {d.quantity}
                <button className="edit-btn" onClick={() => handleDetailEdit(i)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDetailDelete(i)}>Delete</button>
              </li>
            );
          })}
        </ul>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <button type="submit" className="submit-btn">Save Production Order</button>
      </form>
    </div>
  );
};

export default ProductionOrderPage;
          