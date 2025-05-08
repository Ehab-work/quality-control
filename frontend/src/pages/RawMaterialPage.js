import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RawMaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unit: '',
    avg_price: '',
  });
  const [error, setError] = useState('');

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/raw-materials/');
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/add-raw-material/', formData);
      setMaterials([...materials, response.data]);
      setFormData({ name: '', quantity: 0, unit: '', avg_price: '' });
    } catch (err) {
      setError('حدث خطأ أثناء الإضافة. تحقق من البيانات.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>إضافة مادة خام</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="اسم المادة"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="unit"
          placeholder="وحدة القياس (مثل kg أو m)"
          value={formData.unit}
          onChange={handleChange}
          required
        /><br />
        <input
          type="number"
          step="0.01"
          name="avg_price"
          placeholder="متوسط السعر"
          value={formData.avg_price}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">إضافة</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h3>قائمة المواد الخام</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الكمية</th>
            <th>الوحدة</th>
            <th>متوسط السعر</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.id}>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>{material.unit}</td>
              <td>{material.avg_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RawMaterialPage;