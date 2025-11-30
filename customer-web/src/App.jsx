// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useCart } from "./context/CartContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

function Navbar() {
  const { cart } = useCart();
  const location = useLocation();

  
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          FoodExpress
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">
            Home
          </Link>
          <Link to="/orders" className="text-gray-700 hover:text-orange-600 font-medium">
            My Orders
          </Link>
          <Link to="/cart" className="relative">
            <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("access");
              localStorage.removeItem("refresh");
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const token = localStorage.getItem("access");

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
  

              {/* Protected Routes */}
              <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
              <Route path="/restaurant/:id" element={token ? <RestaurantDetail /> : <Navigate to="/login" />} />
              <Route path="/cart" element={token ? <Cart /> : <Navigate to="/login" />} />
              <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/login" />} />
              <Route path="/orders" element={token ? <Orders /> : <Navigate to="/login" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;