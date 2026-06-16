import { BrowserRouter, Routes, Route } from "react-router-dom";
import Customer from "./Customer";
import Kitchen from "./Kitchen";
import Waiter from "./Waiter";
import Admin from "./Admin";
import Cashier from "./Cashier";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import OrderHistory from "./OrderHistory";
import SalesReport from "./SalesReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Customer />} />
        <Route path="/customer" element={<Customer />} />

        <Route path="/login" element={<Login />} />

        <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <Admin />
    </ProtectedRoute>
  }
/>
<Route
  path="/kitchen"
  element={
    <ProtectedRoute role="kitchen">
      <Kitchen />
    </ProtectedRoute>
  }
/>

<Route
  path="/waiter"
  element={
    <ProtectedRoute role="waiter">
      <Waiter />
    </ProtectedRoute>
  }
/>

<Route
  path="/cashier"
  element={
    <ProtectedRoute role="cashier">
      <Cashier />
    </ProtectedRoute>
  }
/> 
<Route path="/history" element={<OrderHistory />} />
<Route path="/sales" element={<SalesReport />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;