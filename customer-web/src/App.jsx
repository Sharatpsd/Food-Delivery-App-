// src/App.jsx – FINAL & PERFECT VERSION
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import Login from "./pages/Login";
import Register from "./pages/Register";        // ADDED
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Auth Guard Component
function RequireAuth({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
}

// Redirect logged-in users away from auth pages
function RedirectIfLoggedIn({ children }) {
  const token = localStorage.getItem("access");
  return token ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <RedirectIfLoggedIn>
                  <Login />
                </RedirectIfLoggedIn>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectIfLoggedIn>
                  <Register />
                </RedirectIfLoggedIn>
              }
            />

            {/* Protected Routes (Require Login) */}
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