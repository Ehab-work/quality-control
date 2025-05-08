import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone_number: '',
    email: ''
  });

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/clients/');
      setClients(res.data);
    } catch (err) {
      console.error('خطأ في جلب العملاء:', err);
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
      await axios.post('http://127.0.0.1:8000/api/add-client/', form);
      alert('تمت إضافة العميل بنجاح');
      setForm({ name: '', address: '', phone_number: '', email: '' });
      fetchClients();
    } catch (err) {
      console.error('خطأ في إضافة العميل:', err);
      alert('حدث خطأ، تأكد من صحة البيانات');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>إضافة عميل جديد</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="الاسم" value={form.name} onChange={handleChange} required />
        <input type="text" name="address" placeholder="العنوان" value={form.address} onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="رقم الهاتف" value={form.phone_number} onChange={handleChange} required />
        <input type="email" name="email" placeholder="البريد الإلكتروني" value={form.email} onChange={handleChange} required />
        <button type="submit">إضافة</button>
      </form>

      <h3 style={{ marginTop: '30px' }}>قائمة العملاء</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>العنوان</th>
            <th>الهاتف</th>
            <th>الإيميل</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.address}</td>
              <td>{client.phone_number}</td>
              <td>{client.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientPage;