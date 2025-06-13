import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './RawMaterialPage.css';

const RawMaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: '',
    avg_price: '',
    lower_limit: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchMaterials = async () => {
    try {
      const res = await axiosInstance.get('raw-materials/');
      setMaterials(res.data);
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
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
        await axiosInstance.patch(`raw-materials/${editingId}/update/`, formData);
        setMessage('Raw material updated successfully.');
      } else {
        await axiosInstance.post('add-raw-material/', formData);
        setMessage('Raw material added successfully.');
      }
      setFormData({ name: '', quantity: '', unit: '', avg_price: '',lower_limit: '' });
      setEditingId(null);
      fetchMaterials();
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
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
      await axiosInstance.delete(`raw-materials/${id}/delete/`);
      setMessage('Raw material deleted successfully.');
      fetchMaterials();
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
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
        <input type="number" name="lower_limit" placeholder="Lower Limit" value={formData.lower_limit} onChange={handleChange} min="0" step="any" required/>
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {formData.quantity && formData.lower_limit &&
  parseFloat(formData.quantity) < parseFloat(formData.lower_limit) && (
    <p style={{ color: 'red', marginTop: '10px' }}>
      ⚠️ Warning: Quantity is below the defined lower limit!
    </p>
)}




      </form>

      <h3 className="sub-title">Raw Materials List</h3>
      <table className="material-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Avg Price</th>
            <th>Status</th> 
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
              <td>{mat.lower_limit}</td>
              <td>
        {parseFloat(mat.quantity) < parseFloat(mat.lower_limit) ? (
          <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Low Stock</span>
        ) : (
          <span style={{ color: 'lightgreen' }}>✔️ OK</span>
        )}
      </td>
              
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
