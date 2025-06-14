import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './PurchaseOrderPage.css';

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
  const [editIndex, setEditIndex] = useState(null); // <== NEW STATE
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
    fetchMaterials();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axiosInstance.get('suppliers/');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axiosInstance.get('raw-materials/');
      setMaterials(res.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  const handleAddOrUpdateDetail = () => {
    if (!newDetail.raw_material || !newDetail.quantity || !newDetail.unit_price) {
      setError('All material fields must be filled.');
      return;
    }

    const item = {
      raw_material: newDetail.raw_material,
      quantity: parseFloat(newDetail.quantity),
      unit_price: parseFloat(newDetail.unit_price)
    };

    let updatedDetails = [...formData.details];

    if (editIndex !== null) {
      updatedDetails[editIndex] = item;
      setEditIndex(null);
    } else {
      updatedDetails.push(item);
    }

    setFormData((prev) => ({
      ...prev,
      details: updatedDetails
    }));

    setNewDetail({ raw_material: '', quantity: '', unit_price: '' });
    setError('');
  };

  const handleEditDetail = (index) => {
    const item = formData.details[index];
    setNewDetail({
      raw_material: item.raw_material,
      quantity: item.quantity,
      unit_price: item.unit_price
    });
    setEditIndex(index);
  };

  const handleDeleteDetail = (index) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData({ ...formData, details: updatedDetails });

    // Reset edit mode if deleted item was being edited
    if (editIndex === index) {
      setEditIndex(null);
      setNewDetail({ raw_material: '', quantity: '', unit_price: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier || !formData.order_date || formData.details.length === 0) {
      setError('Please complete all required fields.');
      return;
    }

    const total = formData.details.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    try {
      await axiosInstance.post('add-purchase-order/', {
        ...formData,
        total_amount: total.toFixed(2)
      });
      alert('Purchase order saved successfully!');
      setFormData({ employee: 1, supplier: '', order_date: '', details: [] });
      setNewDetail({ raw_material: '', quantity: '', unit_price: '' });
      setEditIndex(null);
    } catch (err) {
      console.error(err);
      setError('Failed to submit order.');
    }
  };

  return (
    <div className="purchase-order-page">
      <h2 className="section-title">Add Purchase Order</h2>
      <form onSubmit={handleSubmit} className="purchase-form">
        <label>Supplier:</label>
        <select
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          required
        >
          <option value="">-- Select Supplier --</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <label>Order Date:</label>
        <input
          type="date"
          value={formData.order_date}
          onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
          required
        />

        <h4 className="sub-title">Material Details:</h4>
        <div className="material-detail-row">
          <select
            value={newDetail.raw_material}
            onChange={(e) => setNewDetail({ ...newDetail, raw_material: e.target.value })}
          >
            <option value="">-- Select Material --</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newDetail.quantity}
            onChange={(e) => setNewDetail({ ...newDetail, quantity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Unit Price"
            value={newDetail.unit_price}
            onChange={(e) => setNewDetail({ ...newDetail, unit_price: e.target.value })}
          />
          <button type="button" onClick={handleAddOrUpdateDetail}>
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
        </div>

        <ul className="material-list">
          {formData.details.map((d, index) => (
            <li key={index}>
              Material #{d.raw_material} | Qty: {d.quantity} | Price: {d.unit_price}
              <button onClick={() => handleEditDetail(index)} className="edit-detail-btn">Edit</button>

              <button onClick={() => handleDeleteDetail(index)} className="delete-detail-btn">Delete</button>
            </li>
          ))}
        </ul>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="submit-btn">Save Order</button>
      </form>
    </div>
  );
};

export default PurchaseOrderPage;
