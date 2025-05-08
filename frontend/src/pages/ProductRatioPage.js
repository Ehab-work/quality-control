import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductRatioPage = () => {
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [ratios, setRatios] = useState([]);
  const [formData, setFormData] = useState({
    product: '',
    raw_material: '',
    quantity: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchMaterials();
    fetchRatios();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/products/');
      setProducts(res.data);
    } catch (err) {
      console.error('خطأ في جلب المنتجات:', err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/raw-materials/');
      setMaterials(res.data);
    } catch (err) {
      console.error('خطأ في جلب المواد الخام:', err);
    }
  };

  const fetchRatios = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/product-ratios/');
      setRatios(res.data);
    } catch (err) {
      console.error('خطأ في جلب نسب التصنيع:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const quantityValue = parseFloat(formData.quantity);
    if (isNaN(quantityValue) || quantityValue < 0.0001) {
      setError('الكمية يجب أن تكون رقمًا أكبر من أو يساوي 0.0001');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/add-ratio/', {
        product: formData.product,
        raw_material: formData.raw_material,
        ratio: quantityValue
      });
      fetchRatios();
      setFormData({ product: '', raw_material: '', quantity: '' });
    } catch (err) {
      setError('حدث خطأ أثناء حفظ البيانات');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>تحديد كميات المواد الخام للمنتج</h2>
      <form onSubmit={handleSubmit}>
        <select name="product" value={formData.product} onChange={handleChange} required>
          <option value="">-- اختر المنتج --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select name="raw_material" value={formData.raw_material} onChange={handleChange} required>
          <option value="">-- اختر المادة الخام --</option>
          {materials.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="الكمية"
          value={formData.quantity}
          onChange={handleChange}
          min="0.0001"
          step="0.0001"
          required
        />
        <button type="submit">إضافة الكمية</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h3 style={{ marginTop: '30px' }}>الكميات الحالية:</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>المنتج</th>
            <th>المادة الخام</th>
            <th>الكمية</th>
          </tr>
        </thead>
        <tbody>
          {ratios.map((r, index) => (
            <tr key={index}>
              <td>{r.product_name}</td>
              <td>{r.raw_material_name}</td>
              <td>{r.ratio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductRatioPage;