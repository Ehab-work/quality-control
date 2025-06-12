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
import AnalisePage from './pages/AnalisePage';
import SalesAnalise from './pages/SalesAnalise';
import EditSalesOrderPage from './pages/EditSalesOrderPage';
import SalesByClientPage from './pages/SalesByClientPage';
import IncompletProduction from './pages/IncompletProduction';
import ColorAnalyzer from './pages/ColorAnalyzer';
import AnalByrequat from './pages/AnalByrequat';
import AnalByemployee from './pages/AnalByemployee';
import AnalByRaw from './pages/AnalByRaw';
import AnalByProduct from './pages/AnalByProduct';
import AnalByrequatTop5 from './pages/AnalByrequatTop5';
import Analcsonyear from './pages/Analcsonyear';
import AnalClientOrderSummaryPage from './pages/AnalClientOrderSummaryPage';
import AnalTotalproduction from './pages/AnalTotalproduction';
import AnalRawMaterialUsagePage from './pages/AnalRawMaterialUsagePage';
import AnalRawMaterialCostPage from './pages/AnalRawMaterialCostPage';
import AnalCostStokRaw from './pages/AnalCostStokRaw';
import Analtopsale from './pages/Analtopsale';
import AnalProductProfit from './pages/AnalProductProfit';
import SalseorderNotcomplet from './pages/SalseorderNotcomplet';
import SalesOrderdone from './pages/SalesOrderdone';
import SigninPage from './pages/Signin';
import PrivateRoute from './utils/privateroute';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/HomeMain" element={
          <PrivateRoute allowedRoles={['ceo', 'purchase', 'sales', 'production']}>
            <HomeMain />
          </PrivateRoute>
        } />

        <Route path="/Sales" element={
          <PrivateRoute allowedRoles={['sales', 'ceo']}>
            <Sales />
          </PrivateRoute>
        } />

        <Route path="/suppliers" element={
          <PrivateRoute allowedRoles={['purchase', 'ceo']}>
            <SupplierPage />
          </PrivateRoute>
        } />

        <Route path="/Purchase" element={
          <PrivateRoute allowedRoles={['purchase', 'ceo']}>
            <Purchase />
          </PrivateRoute>
        } />

        <Route path="/ProductPage" element={
          <PrivateRoute allowedRoles={['production', 'ceo']}>
            <ProductPage />
          </PrivateRoute>
        } />

        <Route path="/raw-materials" element={
          <PrivateRoute allowedRoles={['purchase', 'ceo']}>
            <RawMaterialPage />
          </PrivateRoute>
        } />

        <Route path="/purchase-orders" element={
          <PrivateRoute allowedRoles={['purchase', 'ceo']}>
            <PurchaseOrderPage />
          </PrivateRoute>
        } />

        <Route path="/purchase-orders-list" element={
          <PrivateRoute allowedRoles={['purchase', 'ceo']}>
            <PurchaseOrderListPage />
          </PrivateRoute>
        } />

        <Route path="/Production" element={
          <PrivateRoute allowedRoles={['production', 'ceo']}>
            <Production />
          </PrivateRoute>
        } />

        <Route path="/ProductRatioPage" element={
          <PrivateRoute allowedRoles={['production', 'ceo']}>
            <ProductRatioPage />
          </PrivateRoute>
        } />

        <Route path="/production-orders" element={
          <PrivateRoute allowedRoles={['production', 'ceo']}>
            <ProductionOrderPage />
          </PrivateRoute>
        } />

        <Route path="/production-orders-list" element={
          <PrivateRoute allowedRoles={['production', 'ceo']}>
            <ProductionOrderListPage />
          </PrivateRoute>
        } />

        <Route path="/ClientPage" element={
          <PrivateRoute allowedRoles={['sales', 'ceo']}>
            <ClientPage />
          </PrivateRoute>
        } />

        <Route path="/SalesOrderPage" element={
          <PrivateRoute allowedRoles={['sales', 'ceo']}>
            <SalesOrderPage />
          </PrivateRoute>
        } />

        <Route path="/SalesOrderListPage" element={
          <PrivateRoute allowedRoles={['sales', 'ceo']}>
            <SalesOrderListPage />
          </PrivateRoute>
        } />

        <Route path="/AnalisePage" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalisePage />
          </PrivateRoute>
        } />
        <Route path="/SalesAnalise" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <SalesAnalise />
          </PrivateRoute>
        } />
        <Route path="/IncompletProduction" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <IncompletProduction />
          </PrivateRoute>
        } />
        <Route path="/SalseorderNotcomplet" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <SalseorderNotcomplet />
          </PrivateRoute>
        } />
        <Route path="/SalesOrderdone" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <SalesOrderdone />
          </PrivateRoute>
        } />
        <Route path="/edit-sales-order/:id" element={
          <PrivateRoute allowedRoles={['sales', 'ceo']}>
            <EditSalesOrderPage />
          </PrivateRoute>
        } />
        <Route path="/SalesByClientPage" element={
          <PrivateRoute allowedRoles={['sales', 'ceo']}>
            <SalesByClientPage />
          </PrivateRoute>
        } />
        <Route path="/ColorAnalyzer" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <ColorAnalyzer />
          </PrivateRoute>
        } />
        <Route path="/AnalByrequat" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalByrequat />
          </PrivateRoute>
        } />
        <Route path="/AnalByemployee" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalByemployee />
          </PrivateRoute>
        } />
        <Route path="/AnalByRaw" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalByRaw />
          </PrivateRoute>
        } />
        <Route path="/AnalByProduct" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalByProduct />
          </PrivateRoute>
        } />
        <Route path="/AnalByrequatTop5" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalByrequatTop5 />
          </PrivateRoute>
        } />
        <Route path="/Analcsonyear" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <Analcsonyear />
          </PrivateRoute>
        } />
        <Route path="/AnalClientOrderSummaryPage" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalClientOrderSummaryPage />
          </PrivateRoute>
        } />
        <Route path="/AnalTotalproduction" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalTotalproduction />
          </PrivateRoute>
        } />
        <Route path="/AnalRawMaterialUsagePage" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalRawMaterialUsagePage />
          </PrivateRoute>
        } />
        <Route path="/AnalRawMaterialCostPage" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalRawMaterialCostPage />
          </PrivateRoute>
        } />
        <Route path="/AnalCostStokRaw" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalCostStokRaw />
          </PrivateRoute>
        } />
        <Route path="/Analtopsale" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <Analtopsale />
          </PrivateRoute>
        } />
        <Route path="/AnalProductProfit" element={
          <PrivateRoute allowedRoles={['ceo']}>
            <AnalProductProfit />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;