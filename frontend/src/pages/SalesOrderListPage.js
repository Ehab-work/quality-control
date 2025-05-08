import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState({});
  const [employees, setEmployees] = useState({});
  const [products, setProducts] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, clientsRes, employeesRes, productsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/sales-orders/'),
        axios.get('http://127.0.0.1:8000/api/clients/'),
        axios.get('http://127.0.0.1:8000/api/employees/'),
        axios.get('http://127.0.0.1:8000/api/products/'),
      ]);

      setOrders(ordersRes.data);

      const clientMap = {};
      clientsRes.data.forEach(c => clientMap[c.id] = c.name);
      setClients(clientMap);

      const empMap = {};
      employeesRes.data.forEach(e => empMap[e.id] = e.name);
      setEmployees(empMap);

      const productMap = {};
      productsRes.data.forEach(p => productMap[p.id] = p.name);
      setProducts(productMap);

    } catch (err) {
      console.error("خطأ أثناء جلب البيانات:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>فواتير المبيعات</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #aaa', padding: 10, marginBottom: 20, borderRadius: 5 }}>
          <h4>فاتورة #{order.id}</h4>
          <p><strong>الموظف:</strong> {employees[order.employee]}</p>
          <p><strong>العميل:</strong> {clients[order.client]}</p>
          <p><strong>التاريخ:</strong> {order.sale_date}</p>
          <p><strong>التوصيل قبل:</strong> {order.delivery_deadline}</p>
          <p><strong>ملاحظات:</strong> {order.notes}</p>
          <p><strong>إجمالي الفاتورة:</strong> {order.total_amount} جنيه</p>

          <h5>تفاصيل المنتجات:</h5>
          <ul>
            {order.details.map((d, idx) => (
              <li key={idx}>
                {products[d.product]} | كمية: {d.quantity} | سعر: {d.unit_price} | ضريبة: {d.taxes} | إجمالي: {d.total_price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SalesOrderListPage;