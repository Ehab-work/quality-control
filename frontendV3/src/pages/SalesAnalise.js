import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // 🔁 استبدل axios بـ axiosInstance
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AnalysisPage = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get('api/products/')
      .then((res) => {
        setAllProducts(res.data);
      })
      .catch((err) => {
        console.error("خطأ في جلب المنتجات:", err);
      });
  }, []);

  useEffect(() => {
    const url = selectedProduct
      ? `product_name=${selectedProduct}`
      : 'sales-summary/';

    axiosInstance.get(url) // 🔁 استبدل axios بـ axiosInstance
      .then((res) => {
        const labels = res.data.map(item => item.product__name);
        const data = res.data.map(item => item.total_quantity);

        setChartData({
          labels,
          datasets: [{
            label: 'إجمالي الكمية المباعة',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        });
      })
      .catch((err) => {
        console.error("خطأ أثناء تحميل البيانات:", err);
      });
  }, [selectedProduct]);

  return (
    <div style={{ width: '80%', margin: 'auto', textAlign: 'center' }}>
      <h2>تحليل المبيعات حسب المنتج</h2>

      {/* فلتر اختيار المنتج */}
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="productFilter">اختار المنتج:</label>{' '}
        <select
          id="productFilter"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">-- كل المنتجات --</option>
          {allProducts.map((product) => (
            <option key={product.id} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* الجراف */}
      {chartData ? (
        <Bar data={chartData} />
      ) : (
        <p>جاري تحميل البيانات...</p>
      )}
    </div>
  );
};

export default AnalysisPage;