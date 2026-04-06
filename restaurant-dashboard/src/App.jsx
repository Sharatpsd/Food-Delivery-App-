import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import OrdersSimple from "./pages/OrdersSimple";
import Foods from "./pages/Foods";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element=(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )
        />
        <Route
          path="/orders"
          element=(
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          )
        />
        <Route
          path="/orders-simple"
          element=(
            <ProtectedRoute>
              <OrdersSimple />
            </ProtectedRoute>
          )
        />
        <Route
          path="/foods"
          element=(
            <ProtectedRoute>
              <Foods />
            </ProtectedRoute>
          )
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;