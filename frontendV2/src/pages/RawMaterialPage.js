// src/pages/RawMaterialPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RawMaterialPage.css';

const RawMaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: '',
    avg_price: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/raw-materials/');
      setMaterials(res.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      if (editingId) {
        await axios.patch(`http://127.0.0.1:8000/api/raw-materials/${editingId}/update/`, formData);
        setMessage('Raw material updated successfully.');
      } else {
        await axios.post('http://127.0.0.1:8000/api/add-raw-material/', formData);
        setMessage('Raw material added successfully.');
      }
      setFormData({ name: '', quantity: '', unit: '', avg_price: '' });
      setEditingId(null);
      fetchMaterials();
    } catch (err) {
      console.error('Error saving material:', err);
      setMessage('Error occurred while saving. Please check your input.');
    }
  };

  const handleEdit = material => {
    setFormData({
      name: material.name,
      quantity: material.quantity,
      unit: material.unit,
      avg_price: material.avg_price,
    });
    setEditingId(material.id);
    setMessage('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this raw material?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/raw-materials/${id}/delete/`);
      setMessage('Raw material deleted successfully.');
      fetchMaterials();
    } catch (err) {
      console.error('Error deleting material:', err);
      setMessage('Error occurred while deleting.');
    }
  };

  return (
    <div className="raw-material-page">
      <h2 className="section-title">{editingId ? 'Edit Raw Material' : 'Add New Raw Material'}</h2>

      {message && <p className="message">{message}</p>}

      <form className="material-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Material Name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} min="0" step="any" required />
        <input type="text" name="unit" placeholder="Unit (e.g. kg)" value={formData.unit} onChange={handleChange} required />
        <input type="number" name="avg_price" placeholder="Average Price" value={formData.avg_price} onChange={handleChange} min="0" step="any" required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <h3 className="sub-title">Raw Materials List</h3>
      <table className="material-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Avg Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(mat => (
            <tr key={mat.id}>
              <td>{mat.name}</td>
              <td>{mat.quantity}</td>
              <td>{mat.unit}</td>
              <td>{mat.avg_price}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(mat)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(mat.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RawMaterialPage;
