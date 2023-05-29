import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ItemGroup from "./components/Items/ItemGroup";
import Items from "./components/Items/Items";
import InventoryAdj from "./components/Items/InventoryAdj";
import ItemAdjDatewise from "./components/Items/ItemAdjDatewise";
import NavBar from "./components/Navigation/NavBar";
import Home from "./components/Navigation/Home";
import Customer from "./components/Sales/Customer";
import SalesOrder from "./components/Sales/SalesOrder";
import SalesOrderDatewise from "./components/Sales/SalesOrderDatewise";
import Package from "./components/Sales/Package";
import DeliveryChallan from "./components/Sales/DeliveryChallan";
import Invoice from "./components/Sales/Invoice";
import PaymentReceived from './components/Sales/PaymentsReceived';
import PaymentReceivedDatewise from './components/Sales/PaymentReceivedDatewise';
import PaymentsRecTab from "./components/Sales/PaymentsRecTab";
import SalesReturn from "./components/Sales/SalesReturn";
import CreditNote from "./components/Sales/CreditNote";
import Vendor from "./components/Purchase/Vendor";
import PurchaseOrder from "./components/Purchase/PurchaseOrder";
import PurchaseOrderDatewise from "./components/Purchase/PurchaseOrderVendorDatewise";
import Bill from "./components/Purchase/BillsPayable";
import BillPayment from "./components/Purchase/BillPayment";
import BillPaymentDatewise from "./components/Purchase/BillPaymentsDatewise";
import VendorCreditNote from "./components/Purchase/VendorCreditNote";
import ReportViewer from "./components/Reports/ReportViewer";
import CreateUser from "./components/Admin/CreateUser";

function App() {
  const location = useLocation();

  

  return (
    <div>
      <NavBar  />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item-group" element={<ItemGroup />} />
        <Route path="/item" element={<Items />} />
        <Route
          path="/inv-adjustment"
          element={<PaymentsRecTab tab1={<InventoryAdj />} tab2={<ItemAdjDatewise />} />}
        />
        <Route path="/customer" element={<Customer />} />
        <Route path="/sales-order" element={<SalesOrder />} />
        <Route path="/view-so" element={<SalesOrderDatewise />} />
        <Route path="/package" element={<Package />} />
        <Route path="/challan" element={<DeliveryChallan />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route
          path="/payments-rec"
          element={<PaymentsRecTab tab1={<PaymentReceived />} tab2={<PaymentReceivedDatewise />} />}
        />
        <Route path="/sales-returns" element={<SalesReturn />} />
        <Route path="/credit-note" element={<CreditNote />} />
        <Route path="/vendor" element={<Vendor />} />
        <Route
          path="/purchase-order"
          element={<PaymentsRecTab tab1={<PurchaseOrder />} tab2={<PurchaseOrderDatewise />} />}
        />
        <Route path="/bills" element={<Bill />} />
        <Route
          path="/bill-payment"
          element={<PaymentsRecTab tab1={<BillPayment />} tab2={<BillPaymentDatewise />} />}
        />
        <Route path="/vendor-credit" element={<VendorCreditNote />} />
        <Route path="/reports" element={<ReportViewer />} />
      </Routes>
    </div>
  );
}

export default App;
