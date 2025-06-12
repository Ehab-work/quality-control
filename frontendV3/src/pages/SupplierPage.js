import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './SupplierPage.css';

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    address: '',
    phone: '',
    notes: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchSuppliers = async () => {
    const res = await axiosInstance.get('api/suppliers/');
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.patch(`${editingId}/update/`, newSupplier);
        setMessage('Supplier updated successfully.');
        setEditingId(null);
      } else {
        await axiosInstance.post('add-supplier/', newSupplier);
        setMessage('Supplier added successfully.');
      }
      setNewSupplier({ name: '', address: '', phone: '', notes: '' });
      fetchSuppliers();
    } catch (error) {
      setMessage('Error while saving.');
    }
  };

  const handleEdit = (supplier) => {
    setNewSupplier(supplier);
    setEditingId(supplier.id);
    setMessage('');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this supplier?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`api/suppliers/${id}/delete/`);
      setMessage('Supplier deleted successfully.');
      fetchSuppliers();
    } catch {
      setMessage('Error while deleting.');
    }
  };

  return (
    <div className="supplier-page">
      <h2 className="section-title">Supplier Management</h2>

      {message && <div className="message">{message}</div>}

      <form className="supplier-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Supplier Name" value={newSupplier.name} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={newSupplier.address} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={newSupplier.phone} onChange={handleChange} required />
        <input type="text" name="notes" placeholder="Notes" value={newSupplier.notes} onChange={handleChange} />
        <button type="submit">{editingId ? "Update Supplier" : "Add Supplier"}</button>
      </form>

      <table className="supplier-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.phone}</td>
              <td>{s.notes}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(s)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierPage;
