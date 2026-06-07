import { BrowserRouter, Routes, Route } from "react-router-dom";
import Customer from "./Customer";
import Kitchen from "./Kitchen";
import Waiter from "./Waiter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Customer />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/waiter" element={<Waiter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;