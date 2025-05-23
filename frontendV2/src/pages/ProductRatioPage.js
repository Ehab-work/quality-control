import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductRatioPage.css';

const ProductRatioPage = () => {
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [ratios, setRatios] = useState([]);
  const [filterProduct, setFilterProduct] = useState('');
  const [formData, setFormData] = useState({
    product: '',
    raw_material: '',
    quantity: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchMaterials();
    fetchRatios();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/products/');
    setProducts(res.data);
  };

  const fetchMaterials = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/raw-materials/');
    setMaterials(res.data);
  };

  const fetchRatios = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/product-ratios/');
    setRatios(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilterProduct(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const qty = parseFloat(formData.quantity);
    if (isNaN(qty) || qty < 0.0001) {
      setError('Quantity must be a number ≥ 0.0001');
      return;
    }

    try {
      if (editingId) {
        await axios.patch(`http://127.0.0.1:8000/api/ratios/${editingId}/update/`, {
          ratio: qty
        });
        setMessage('Ratio updated successfully.');
      } else {
        await axios.post('http://127.0.0.1:8000/api/add-ratio/', {
          product: formData.product,
          raw_material: formData.raw_material,
          ratio: qty
        });
        setMessage('Ratio added successfully.');
      }
      setFormData({ product: '', raw_material: '', quantity: '' });
      setEditingId(null);
      fetchRatios();
    } catch (err) {
      setError('Error occurred while saving.');
    }
  };

  const handleEdit = (r) => {
    setFormData({
      product: r.product,
      raw_material: r.raw_material,
      quantity: r.ratio
    });
    setEditingId(r.id);
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ratio?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/ratios/${id}/delete/`);
      setMessage('Ratio deleted successfully.');
      if (editingId === id) {
        setEditingId(null);
        setFormData({ product: '', raw_material: '', quantity: '' });
      }
      fetchRatios();
    } catch (err) {
      setError('Error occurred while deleting.');
    }
  };

  const getProductName = (id) => products.find(p => p.id === id)?.name || id;
  const getMaterialName = (id) => materials.find(m => m.id === id)?.name || id;

  const displayedRatios = filterProduct
    ? ratios.filter(r => String(r.product) === filterProduct)
    : ratios;

  return (
    <div className="product-ratio-page">
      <h2 className="section-title">{editingId ? 'Edit Production Ratio' : 'Add Production Ratio'}</h2>

     {/* <div className="filter-bar">
        <label>Filter by Product: </label>
        <select value={filterProduct} onChange={handleFilterChange}>
          <option value="">All Products</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div> */}

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <form onSubmit={handleSubmit} className="ratio-form">
        <select name="product" value={formData.product} onChange={handleChange} required>
          <option value="">-- Select Product --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select name="raw_material" value={formData.raw_material} onChange={handleChange} required>
          <option value="">-- Select Raw Material --</option>
          {materials.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0.0001"
          step="0.0001"
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <h3 className="sub-title">Current Ratios</h3>
      <table className="ratio-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Raw Material</th>
            <th>Ratio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedRatios.map(r => (
            <tr key={r.id}>
              <td>{getProductName(r.product)}</td>
              <td>{getMaterialName(r.raw_material)}</td>
              <td>{r.ratio}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(r)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductRatioPage;
