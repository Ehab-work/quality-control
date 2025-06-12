import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // 🔁 استخدم instance الموحد
import './ClientPage.css';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone_number: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchClients = async () => {
    try {
      const res = await axiosInstance.get('clients/');
      setClients(res.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.patch(`clients/${editingId}/update/`, form);
        setMessage('Client updated successfully');
        setEditingId(null);
      } else {
        await axiosInstance.post('add-client/', form);
        setMessage('Client added successfully');
      }
      setForm({ name: '', address: '', phone_number: '', email: '' });
      fetchClients();
    } catch (err) {
      console.error('Error:', err);
      setMessage('Something went wrong');
    }
  };

  const handleEdit = (client) => {
    setForm(client);
    setEditingId(client.id);
    setMessage('');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this client?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`clients/${id}/delete/`);
      setMessage('Client deleted successfully');
      fetchClients();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Failed to delete client');
    }
  };

  return (
    <div className="client-page">
      <h2 className="section-title">{editingId ? 'Edit Client' : 'Add New Client'}</h2>

      {message && <p className="message">{message}</p>}

      <form className="client-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="Phone" value={form.phone_number} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <h3 className="section-subtitle">Client List</h3>

      <div className="table-wrapper">
        <table className="client-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.address}</td>
                <td>{client.phone_number}</td>
                <td>{client.email}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(client)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(client.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientPage;
