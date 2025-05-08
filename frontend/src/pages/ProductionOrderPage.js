import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductionOrderPage = () => {
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    employee: '',
    start_date: '',
    expected_end_date: '',
    status: 'planned',
    notes: '',
    details: []
  });
  const [newDetail, setNewDetail] = useState({ product: '', quantity: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchProducts();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/employees/');
    setEmployees(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/products/');
    setProducts(res.data);
  };

  const handleDetailAdd = () => {
    if (!newDetail.product , !newDetail.quantity , parseInt(newDetail.quantity) <= 0) {
      setError('كل الحقول مطلوبة والكمية يجب أن تكون عددًا صحيحًا موجبًا');
      return;
    }

    setFormData(prev => ({
      ...prev,
      details: [...prev.details, {
        product: parseInt(newDetail.product),
        quantity: parseInt(newDetail.quantity)
      }]
    }));

    setNewDetail({ product: '', quantity: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee , !formData.start_date , !formData.expected_end_date || formData.details.length === 0) {
      setError('يرجى تعبئة كافة الحقول وإضافة تفاصيل الإنتاج');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/create-production-order/', formData);
      alert('تم إنشاء أمر التصنيع بنجاح');
      setFormData({ employee: '', start_date: '', expected_end_date: '', status: 'planned', notes: '', details: [] });
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الإرسال');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>إضافة أمر تصنيع</h2>
      <form onSubmit={handleSubmit}>
        <select name="employee" value={formData.employee} onChange={e => setFormData({ ...formData, employee: e.target.value })} required>
          <option value="">-- اختر الموظف --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select><br /><br />

        <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} required />
        <input type="date" value={formData.expected_end_date} onChange={e => setFormData({ ...formData, expected_end_date: e.target.value })} required /><br /><br />

        <textarea placeholder="ملاحظات" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea><br /><br />

        <h4>تفاصيل المنتجات</h4>
        <select value={newDetail.product} onChange={e => setNewDetail({ ...newDetail, product: e.target.value })}>
          <option value="">-- اختر المنتج --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input type="number" placeholder="الكمية" value={newDetail.quantity} onChange={e => setNewDetail({ ...newDetail, quantity: e.target.value })} />
        <button type="button" onClick={handleDetailAdd}>إضافة</button><br /><br />

        <ul>
          {formData.details.map((d, i) => (
            <li key={i}>منتج #{d.product} - كمية: {d.quantity}</li>
          ))}
        </ul>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">حفظ أمر التصنيع</button>
      </form>
    </div>
  );
};

export default ProductionOrderPage;