
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Purchase from './pages/Purchase';
import SupplierPage from './pages/SupplierPage';
import RawMaterialPage from './pages/RawMaterialPage';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import PurchaseOrderListPage from './pages/PurchaseOrderListPage';
import ProductPage from './pages/ProductPage';
import Sales from './pages/Sales';
import HomeMain from './pages/HomeMain';
import Production from './pages/Production';
import ProductRatioPage from './pages/ProductRatioPage';
import ProductionOrderPage from './pages/ProductionOrderPage';
import ProductionOrderListPage from './pages/ProductionOrderListPage';
import ClientPage from './pages/ClientPage';
import SalesOrderPage from './pages/SalesOrderPage';
import SalesOrderListPage from './pages/SalesOrderListPage';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeMain />} />
        <Route path="/Sales" element={< Sales/>} />
        <Route path="/suppliers" element={<SupplierPage />} />
        <Route path="/Purchase" element={<Purchase />} />
        <Route path="/ProductPage" element={<ProductPage />} />
        <Route path="/raw-materials" element={<RawMaterialPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrderPage />} />
        <Route path="/purchase-orders-list" element={<PurchaseOrderListPage />} />
        <Route path="/Production" element={<Production/>} />
        <Route path="/ProductRatioPage" element={<ProductRatioPage/>} />
        <Route path="/production-orders" element={<ProductionOrderPage />} />
        <Route path="/production-orders-list" element={<ProductionOrderListPage />} />
        <Route path="/ClientPage" element={<ClientPage />} />
        <Route path="/SalesOrderPage" element={<SalesOrderPage />} />
        <Route path="/SalesOrderListPage" element={<SalesOrderListPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;


