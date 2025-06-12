import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // 🔁 استبدل axios بـ axiosInstance

const EditSalesOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    client: '',
    sale_date: '',
    delivery_deadline: '',
    notes: '',
    details: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [orderRes, clientsRes, productsRes] = await Promise.all([
        axiosInstance.get(`sales-orders/${id}/`), // 🔁 استبدل axios بـ axiosInstance
        axiosInstance.get('api/clients/'), // 🔁 استبدل axios بـ axiosInstance
        axiosInstance.get('api/products/'), // 🔁 استبدل axios بـ axiosInstance
      ]);

      setOrder(orderRes.data);
      setClients(clientsRes.data);
      setProducts(productsRes.data);

      setForm({
        client: orderRes.data.client,
        sale_date: orderRes.data.sale_date,
        delivery_deadline: orderRes.data.delivery_deadline,
        notes: orderRes.data.notes,
        details: orderRes.data.details,
      });
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...form.details];
    newDetails[index][field] = value;
    setForm((prev) => ({ ...prev, details: newDetails }));
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.patch(`${id}/update-all/`, form); // 🔁 استبدل axios بـ axiosInstance
      alert('تم تعديل الفاتورة بنجاح');
      navigate('/Sales');
    } catch (err) {
      console.error('Error updating invoice:', err);
      alert('حدث خطأ أثناء التحديث');
    }
  };

  if (!order) return <div>جاري التحميل...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>تعديل الفاتورة رقم #{id}</h2>

      <h3>البيانات الأساسية</h3>
      <label>العميل:</label>
      <select name="client" value={form.client} onChange={handleMainChange}>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <br />
      <label>تاريخ البيع:</label>
      <input type="date" name="sale_date" value={form.sale_date} onChange={handleMainChange} />
      <br />
      <label>تاريخ التوصيل:</label>
      <input type="date" name="delivery_deadline" value={form.delivery_deadline} onChange={handleMainChange} />
      <br />
      <label>ملاحظات:</label>
      <textarea name="notes" value={form.notes} onChange={handleMainChange} />

      <h3>تفاصيل المنتجات</h3>
      {form.details.map((detail, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <label>المنتج:</label>
          <select
            value={detail.product}
            onChange={(e) => handleDetailChange(idx, 'product', e.target.value)}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <br />
          <label>الكمية:</label>
          <input
            type="number"
            value={detail.quantity}
            onChange={(e) => handleDetailChange(idx, 'quantity', e.target.value)}
          />
          <br />
          <label>السعر:</label>
          <input
            type="number"
            value={detail.unit_price}
            onChange={(e) => handleDetailChange(idx, 'unit_price', e.target.value)}
          />
          <br />
          <label>الضريبة:</label>
          <input
            type="number"
            value={detail.taxes}
            onChange={(e) => handleDetailChange(idx, 'taxes', e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>حفظ التعديلات</button>
    </div>
  );
};

export default EditSalesOrderPage;