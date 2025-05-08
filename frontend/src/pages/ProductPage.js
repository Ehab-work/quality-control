import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/products/');
      setProducts(res.data);
    } catch (err) {
      console.error('فشل في جلب المنتجات', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://127.0.0.1:8000/api/add-product/', formData);
      fetchProducts();
      setFormData({ name: '', type: '', unit: '', price: '', worst_price: '', stock_quantity: '' });
    } catch (err) {
      console.error(err);
      setError('تأكد من أن كل القيم موجبة وصحيحة');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>إضافة منتج</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="اسم المنتج" value={formData.name} onChange={handleChange} required /><br />
        <input type="text" name="type" placeholder="النوع" value={formData.type} onChange={handleChange} required /><br />
        <input type="text" name="unit" placeholder="الوحدة (kg/pcs/m...)" value={formData.unit} onChange={handleChange} required /><br />
        <input type="number" name="price" placeholder="السعر" value={formData.price} onChange={handleChange} required /><br />
        <input type="number" name="worst_price" placeholder="سعر التكلفة الأدنى" value={formData.worst_price} onChange={handleChange} required /><br />
        <input type="number" name="stock_quantity" placeholder="الكمية في المخزن" value={formData.stock_quantity} onChange={handleChange} required /><br />
        <button type="submit">إضافة</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h3>المنتجات المسجلة</h3>
      <table border="1" cellPadding="8" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>النوع</th>
            <th>الوحدة</th>
            <th>السعر</th>
            <th>سعر التكلفة الأدنى</th>
            <th>الكمية في المخزن</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;