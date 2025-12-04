// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";           // New
import Contact from "./pages/Contact";       // New
import Partner from "./pages/Partner";       // New (Become a Partner)
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Auth Guard
function RequireAuth({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const token = localStorage.getItem("access");

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 pt-20 bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />

            {/* Login Route - Redirect if already logged in */}
            <Route
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" replace />}
            />

            {/* Protected Routes - Need Login */}
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <Cart />
                </RequireAuth>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <Orders />
                </RequireAuth>
              }
            />

            {/* 404 - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}