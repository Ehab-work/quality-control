
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
//<Route path="/" element={< />} />
//import  from './pages/';
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
import Signin from './pages/Signin';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/HomeMain" element={<HomeMain />} />
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
        <Route path="/AnalisePage" element={<AnalisePage />} />
        <Route path="/SalesAnalise" element={<SalesAnalise />} />
        <Route path="/IncompletProduction" element={<IncompletProduction />} />
        <Route path="/SalseorderNotcomplet" element={<SalseorderNotcomplet />} />
        <Route path="/SalesOrderdone" element={<SalesOrderdone />} />



        
        <Route path="/edit-sales-order/:id" element={<EditSalesOrderPage />} />
        <Route path="/SalesByClientPage" element={<SalesByClientPage />} />
        <Route path="/ColorAnalyzer" element={<ColorAnalyzer />} />
        <Route path="/AnalByrequat" element={<AnalByrequat />} />
        <Route path="/AnalByemployee" element={<AnalByemployee />} />
        <Route path="/AnalByRaw" element={<AnalByRaw />} />
        <Route path="/AnalByProduct" element={<AnalByProduct />} />
        <Route path="/AnalByrequatTop5" element={<AnalByrequatTop5 />} />
        <Route path="/Analcsonyear" element={<Analcsonyear />} />
        <Route path="/AnalClientOrderSummaryPage" element={<AnalClientOrderSummaryPage />} />
        <Route path="/AnalTotalproduction" element={<AnalTotalproduction />} />
        <Route path="/AnalRawMaterialUsagePage" element={<AnalRawMaterialUsagePage />} />
        <Route path="/AnalRawMaterialCostPage" element={<AnalRawMaterialCostPage />} />
        <Route path="/AnalCostStokRaw" element={<AnalCostStokRaw />} />
        <Route path="/Analtopsale" element={<Analtopsale />} />
        <Route path="/AnalProductProfit" element={<AnalProductProfit />} />
          
        

        
      </Routes>
    </Router>
  );
}



export default App;


