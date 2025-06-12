import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  //  حماية الدخول حسب التوكن والدور
  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  useEffect(() => {
  fetchProducts();
}, []);

if (!accessToken) return <Navigate to="/" />;



  if (!['sales', 'ceo'].includes(role.toLowerCase())) {
    return <Navigate to="/unauthorized" />;
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/products/');
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
        await axios.patch(`http://127.0.0.1:8000/api/products/${editingId}/update/`, formData);
        setMessage('Product updated successfully.');
      } else {
        await axios.post('http://127.0.0.1:8000/api/add-product/', formData);
        setMessage('Product added successfully.');
      }
      setFormData({
        name: '',
        type: '',
        unit: '',
        price: '',
        worst_price: '',
        stock_quantity: '',
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
    });
    setEditingId(product.id);
    setMessage('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}/delete/`);
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
