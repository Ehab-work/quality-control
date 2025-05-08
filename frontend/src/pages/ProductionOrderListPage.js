import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductionOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [employees, setEmployees] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orderRes, productRes, employeeRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/production-orders/'),
        axios.get('http://127.0.0.1:8000/api/products/'),
        axios.get('http://127.0.0.1:8000/api/employees/')
      ]);

      setOrders(orderRes.data);

      const productMap = {};
      productRes.data.forEach(p => { productMap[p.id] = p.name; });
      setProducts(productMap);

      const employeeMap = {};
      employeeRes.data.forEach(e => { employeeMap[e.id] = e.name; });
      setEmployees(employeeMap);
    } catch (err) {
      console.error('خطأ أثناء جلب البيانات:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const url = `http://127.0.0.1:8000/api/production-orders/${orderId}/update-status/`;
    console.log('PATCH URL:', url, 'Payload:', { status: newStatus });
    try {
      const res = await axios.patch(url, { status: newStatus });
      alert(res.data.message || 'تم تحديث الحالة بنجاح');
      fetchData();
    } catch (err) {
      console.error('خطأ أثناء تحديث حالة الطلب:', err.response || err);
      const msg = err.response?.data?.error ||  err.response?.data?.message || err.message;
      alert('حدث خطأ أثناء تحديث الحالة: ${msg}');
    }
  };

  const updateProductStatus = async (detailId, newStatus) => {
    const url = `http://127.0.0.1:8000/api/production-orders/details/${detailId}/update-status/`;
    console.log('PATCH URL:', url, 'Payload:', { status: newStatus });
    try {
      await axios.patch(url, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('خطأ أثناء تحديث حالة المنتج:', err.response || err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert('حدث خطأ أثناء تحديث حالة المنتج: ${msg}');
    }
  };

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>أوامر التصنيع</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          <h4>أمر #{order.id}</h4>
          <p><strong>الموظف:</strong> {employees[order.employee]}</p>
          <p><strong>من:</strong> {order.start_date} <strong>إلى:</strong> {order.expected_end_date}</p>
          <p><strong>الحالة العامة:</strong> {order.status}</p>
          <button onClick={() => updateOrderStatus(order.id, 'completed')}>
            إتمام الأمر
          </button>
          <p><strong>ملاحظات:</strong> {order.notes}</p>

          <h5>تفاصيل المنتجات:</h5>
          <ul>
            {order.details.map(detail => (
              <li key={detail.id}>
                {products[detail.product]} – كمية: {detail.quantity} – حالة:
                <select
                  value={detail.status}
                  onChange={e => {
                    console.log('تفاصيل المنتج:', detail.id, detail.status);
                    updateProductStatus(detail.id, e.target.value);
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProductionOrderListPage;