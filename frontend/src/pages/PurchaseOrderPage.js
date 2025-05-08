import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseOrderPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    employee: 1,
    supplier: '',
    order_date: '',
    details: []
  });
  const [newDetail, setNewDetail] = useState({
    raw_material: '',
    quantity: '',
    unit_price: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
    fetchMaterials();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/suppliers/');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/raw-materials/');
      setMaterials(res.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  const handleAddDetail = () => {
    if (!newDetail.raw_material , !newDetail.quantity , !newDetail.unit_price) {
      setError('يجب ملء كل الحقول قبل الإضافة.');
      return;
    }

    const newItem = {
      raw_material: newDetail.raw_material,
      quantity: parseFloat(newDetail.quantity),
      unit_price: parseFloat(newDetail.unit_price)
    };

    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, newItem]
    }));

    setNewDetail({ raw_material: '', quantity: '', unit_price: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier , !formData.order_date , formData.details.length === 0) {
      setError('يرجى استكمال البيانات.');
      return;
    }

    const total = formData.details.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

    try {
      await axios.post('http://127.0.0.1:8000/api/add-purchase-order/', {
        ...formData,
        total_amount: total.toFixed(2)
      });
      alert('تم حفظ أمر الشراء بنجاح!');
      setFormData({ employee: 1, supplier: '', order_date: '', details: [] });
    } catch (err) {
      console.error(err);
      setError('فشل في إرسال البيانات.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>إضافة عملية شراء</h2>
      <form onSubmit={handleSubmit}>
        <label>اختر المورد:</label><br />
        <select
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          required
        >
          <option value="">-- اختر --</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select><br /><br />

        <label>تاريخ العملية:</label><br />
        <input
          type="date"
          value={formData.order_date}
          onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
          required
        /><br /><br />

        <h4>تفاصيل المواد:</h4>
        <select
          value={newDetail.raw_material}
          onChange={(e) => setNewDetail({ ...newDetail, raw_material: e.target.value })}
        >
          <option value="">-- اختر مادة خام --</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="الكمية"
          value={newDetail.quantity}
          onChange={(e) => setNewDetail({ ...newDetail, quantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="السعر للوحدة"
          value={newDetail.unit_price}
          onChange={(e) => setNewDetail({ ...newDetail, unit_price: e.target.value })}
        />
        <button type="button" onClick={handleAddDetail}>إضافة</button>
        <ul>
          {formData.details.map((d, index) => (
            <li key={index}>
              مادة #{d.raw_material} | كمية: {d.quantity} | سعر: {d.unit_price}
            </li>
          ))}
        </ul>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <br />
        <button type="submit">حفظ الطلب</button>
      </form>
    </div>
  );
};

export default PurchaseOrderPage;