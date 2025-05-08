import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    notes: '',
    added_by: 1, // مؤقتًا نستخدم ID ثابت حتى يتم ربطه بجلسة تسجيل الدخول لاحقًا
  });
  const [error, setError] = useState('');

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/suppliers/');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // تحقق من صحة رقم الهاتف: يجب أن يكون 11 رقمًا ويبدأ بـ 01
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('رقم الهاتف يجب أن يبدأ بـ 01 ويحتوي على 11 رقمًا.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/add-supplier/', formData);
      setSuppliers([...suppliers, response.data]);
      setFormData({ name: '', address: '', phone: '', notes: '' });
    } catch (err) {
      if (err.response?.data) {
        const errorMsg = Object.values(err.response.data).flat().join(', ');
        setError(errorMsg);
      } else {
        setError('حدث خطأ أثناء الإرسال.');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>إضافة مورد جديد</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="الاسم"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="address"
            placeholder="العنوان"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="phone"
            placeholder="رقم الهاتف"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <textarea
            name="notes"
            placeholder="ملاحظات"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit">إضافة</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h3>قائمة الموردين</h3>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>العنوان</th>
            <th>الهاتف</th>
            <th>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.address}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierPage;