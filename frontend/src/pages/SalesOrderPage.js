import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesOrderPage = () => {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    employee: '',
    client: '',
    delivery_deadline: '',
    notes: '',
    details: []
  });
  const [detail, setDetail] = useState({
    product: '',
    quantity: '',
    unit_price: '',
    taxes: 0
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/clients/').then(res => setClients(res.data));
    axios.get('http://127.0.0.1:8000/api/employees/').then(res => setEmployees(res.data));
    axios.get('http://127.0.0.1:8000/api/products/').then(res => setProducts(res.data));
  }, []);

  const handleAddDetail = () => {
    if (!detail.product || !detail.quantity || !detail.unit_price) return alert("أكمل بيانات المنتج");

    const total_price = detail.quantity * detail.unit_price + parseFloat(detail.taxes || 0);
    setForm({
      ...form,
      details: [...form.details, { ...detail, total_price }]
    });
    setDetail({ product: '', quantity: '', unit_price: '', taxes: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sale_date = new Date().toISOString().split('T')[0];
    try {
      await axios.post('http://127.0.0.1:8000/api/create-sales-order/', {
        ...form,
        sale_date
      });
      alert('تم تسجيل عملية البيع بنجاح');
      setForm({ employee: '', client: '', delivery_deadline: '', notes: '', details: [] });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>تسجيل عملية بيع</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>الموظف:</label>
          <select name="employee" value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })}>
            <option value="">اختر</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>العميل:</label>
          <select name="client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}>
            <option value="">اختر</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>ميعاد التسليم:</label>
          <input type="date" value={form.delivery_deadline} onChange={e => setForm({ ...form, delivery_deadline: e.target.value })} />
        </div>

        <div>
          <label>ملاحظات:</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}></textarea>
        </div>

        <hr />
        <h4>إضافة منتج للفاتورة</h4>
        <select value={detail.product} onChange={e => setDetail({ ...detail, product: e.target.value })}>
          <option value="">اختر منتج</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input type="number" placeholder="الكمية" value={detail.quantity} onChange={e => setDetail({ ...detail, quantity: parseInt(e.target.value) })} />
        <input type="number" placeholder="السعر" value={detail.unit_price} onChange={e => setDetail({ ...detail, unit_price: parseFloat(e.target.value) })} />
        <input type="number" placeholder="الضريبة" value={detail.taxes} onChange={e => setDetail({ ...detail, taxes: parseFloat(e.target.value) })} />
        <button type="button" onClick={handleAddDetail}>إضافة المنتج</button>

        <ul>
          {form.details.map((d, idx) => (
            <li key={idx}>
              منتج: {products.find(p => p.id == d.product)?.name} | كمية: {d.quantity} | السعر: {d.unit_price} | إجمالي: {d.total_price}
            </li>
          ))}
        </ul>
        <button type="submit">حفظ الفاتورة</button>
      </form>
    </div>
  );
};

export default SalesOrderPage;