import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; 
import './EditPurchaseOrderPage.css';

const EditPurchaseOrderPage = () => { const { orderId } = useParams(); const navigate = useNavigate();

const [orderData, setOrderData] = useState(null); const [details, setDetails] = useState([]); const [supplier, setSupplier] = useState(''); const [message, setMessage] = useState('');

useEffect(() => { fetchOrder(); }, []);

const fetchOrder = async () => { try { const res = await axiosInstance.get(`purchase-orders/${orderId}/`); // API to get one order
setOrderData(res.data); 
setSupplier(res.data.supplier); 
setDetails(res.data.details); } 
catch (err) { console.error('Error fetching order:', err); }
 };

const handleDetailChange = (index, field, value) => { const updated = [...details]; updated[index][field] = value; setDetails(updated); };

const handleSubmit = async (e) => { e.preventDefault(); setMessage('');

try {
  const payload = {
    supplier,
    details: details.map(item => ({
      raw_material: item.raw_material_id || item.raw_material,
      quantity: item.quantity,
      unit_price: item.unit_price
    }))
  };
  await axiosInstance.patch(purchase-orders/${orderId}/update/, payload);
  setMessage('Purchase order updated successfully.');
  navigate('/purchase-orders');
} catch (err) {
  console.error('Error updating order:', err);
  setMessage('Failed to update order.');
}

};

if (!orderData) return <div className="edit-order-page">Loading...</div>;

return ( <div className="edit-order-page"> <h2 className="section-title">Edit Purchase Order #{orderId}</h2> {message && <p className="message">{message}</p>}

<form className="edit-form" onSubmit={handleSubmit}>
    <label>Supplier:</label>
    <input
      type="text"
      value={supplier}
      onChange={(e) => setSupplier(e.target.value)}
      required
    />

    <h4>Details</h4>
    {details.map((item, index) => (
      <div key={index} className="detail-row">
        <input
          type="text"
          value={item.raw_material_name || ''}
          readOnly
        />
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
          min="0"
          required
        />
        <input
          type="number"
          value={item.unit_price}
          onChange={(e) => handleDetailChange(index, 'unit_price', e.target.value)}
          min="0"
          required
        />
      </div>
    ))}

    <button type="submit" className="primary-btn">Update</button>
  </form>
</div>

); };

export default EditPurchaseOrderPage;