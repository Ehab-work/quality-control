import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PurchaseOrderListPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/list_purchase_orders/');
      setOrders(res.data);
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>عرض أوامر الشراء</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', marginBottom: '15px', padding: '10px' }}>
          <h4>أمر شراء #{order.id}</h4>
          <p><strong>المورد:</strong> {order.supplier_name}</p>
          <p><strong>الموظف:</strong> {order.employee_name}</p>
          <p><strong>التاريخ:</strong> {order.order_date}</p>
          <p><strong>الإجمالي:</strong> {order.total_amount} جنيه</p>
          <h5>تفاصيل:</h5>
          <ul>
            {order.details.map((item, i) => (
              <li key={i}>
                {item.raw_material_name} - كمية: {item.quantity} - سعر: {item.unit_price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PurchaseOrderListPage;