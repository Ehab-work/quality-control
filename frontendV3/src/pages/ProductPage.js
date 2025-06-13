import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './ProductPage.css';
import { Navigate } from 'react-router-dom';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    unit: '',
    price: '',
    worst_price: '',
    stock_quantity: '',
    lower_limit: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!accessToken) return <Navigate to="/" />;
  if (!['production', 'ceo'].includes(role?.toLowerCase())) {
    return <Navigate to="/unauthorized" />;
  }

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('products/');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      if (editingId) {
        await axiosInstance.patch(`products/${editingId}/update/`, formData);
        setMessage('Product updated successfully.');
      } else {
        await axiosInstance.post('add-product/', formData);
        setMessage('Product added successfully.');
      }
      setFormData({
        name: '',
        type: '',
        unit: '',
        price: '',
        worst_price: '',
        stock_quantity: '',
        lower_limit: '',
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setMessage('An error occurred. Make sure all fields are valid.');
    }
  };

  const handleEdit = product => {
    setFormData({
      name: product.name,
      type: product.type,
      unit: product.unit,
      price: product.price,
      worst_price: product.worst_price,
      stock_quantity: product.stock_quantity,
      lower_limit: product.lower_limit,
    });
    setEditingId(product.id);
    setMessage('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axiosInstance.delete(`products/${id}/delete/`);
      setMessage('Product deleted successfully.');
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          name: '',
          type: '',
          unit: '',
          price: '',
          worst_price: '',
          stock_quantity: '',
          lower_limit: '',
        });
      }
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setMessage('An error occurred while deleting the product.');
    }
  };

  return (
    <div className="product-page">
      <h2 className="section-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="product-form">
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
        <input type="text" name="unit" placeholder="Unit (e.g. kg/pcs)" value={formData.unit} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} min="0" step="any" required />
        <input type="number" name="worst_price" placeholder="Minimum Cost Price" value={formData.worst_price} onChange={handleChange} min="0" step="any" required />
        <input type="number" name="stock_quantity" placeholder="Stock Quantity" value={formData.stock_quantity} onChange={handleChange} min="0" step="any" required />
        <input type="number" name="lower_limit" placeholder="Lower Limit" value={formData.lower_limit} onChange={handleChange} min="0.01" step="any" required />
        <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
      </form>

      <h3 className="sub-title">Registered Products</h3>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Min Cost Price</th>
            <th>Quantity</th>
            <th>Lower Limit</th>
            <th>Alert</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.unit}</td>
              <td>{p.price}</td>
              <td>{p.worst_price}</td>
              <td>{p.stock_quantity}</td>
              <td>{p.lower_limit}</td>
              <td>
        {parseFloat(p.stock_quantity) < parseFloat(p.lower_limit) ? (
          <span style={{ color: 'red', fontWeight: 'bold' }}>🔴 Below limit</span>
        ) : (
          <span style={{ color: 'lightgreen', fontWeight: 'bold' }}>✅ OK</span>
        )}
      </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;