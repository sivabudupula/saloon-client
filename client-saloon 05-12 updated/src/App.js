import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewAppointment from "./components/pages/newappointment";
import Appointments from "./components/pages/appointments";
import AddProduct from "./components/pages/AddProduct";
import ProductList from "./components/pages/ProductList";
import PurchaseProduct from "./components/pages/PurchaseProduct";
import InventoryList from "./components/pages/InventoryList";
import Suppliers from "./components/pages/Suppliers";
import EditAppointments from "./components/pages/EditAppointments";
import React, { useState, createContext } from "react";
import LoginPage from "./components/pages/LoginPage";
import Dashboard from "./components/pages/Dashboard";
import AddSupplier from "./components/pages/AddSupplier";
import AddService from "./components/pages/AddService";
import BillingForm from "./components/pages/Billing";
import ServiceForm from "./components/pages/Service";
import Inventory from "./components/pages/InventoryLogic";
import AddCustomer from "./components/pages/AddCustomer";
import CustomerTable from "./components/pages/CustomerTable";
import CustomerDetails from "./components/pages/CustomerDetails";
import CustomerDetailsPopup from "./components/pages/CustomerDetailsEdit";
import StockSelfUse from "./components/pages/StockSelfUse";

export const store = createContext();
function App() {
  const [token, setToken] = useState(null);
  return (
    <div>
      <store.Provider value={[token, setToken]}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* <Route path='/Login' element={<Login/>}/>  */}
            {/* <Route path='/register' element={<Register/>}/> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            <Route path="/ProductList" element={<ProductList />} />
            <Route path="/PurchaseProduct" element={<PurchaseProduct />} />
            <Route path="/InventoryList" element={<InventoryList />} />
            <Route path="/Suppliers" element={<Suppliers />} />
            <Route path="/EditAppointments" element={<EditAppointments />} />
            <Route path="/AddSupplier" element={<AddSupplier />} />

            <Route path="/AddService" element={<AddService />} />
            <Route path="/Billing" element={<BillingForm />} />
            <Route path="/Service" element={<ServiceForm />} />
            <Route path="/InventoryLogic" element={<Inventory />} />
            <Route path="/AddCustomer" element={<AddCustomer />} />
            <Route path="/CustomerTable" element={<CustomerTable />} />
            <Route path="/NewAppointment" element={<NewAppointment />} />
            <Route path="/CustomerDetails" element={<CustomerDetails />} />
            <Route
              path="/CustomerDetailsEdit"
              element={<CustomerDetailsPopup />}
            />
            <Route path="/StockSelfUSe" element={<StockSelfUse />} />
          </Routes>
        </Router>
      </store.Provider>
    </div>
  );
}

export default App;
