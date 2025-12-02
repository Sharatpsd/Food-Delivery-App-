// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Login page এ navbar দেখাবো না
  if (location.pathname === "/login") return null;

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-extrabold text-orange-600 tracking-tight"
          >
            FoodExpress
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-medium hover:text-orange-600 ${
                location.pathname === "/" ? "text-orange-600" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/orders"
              className={`font-medium hover:text-orange-600 ${
                location.pathname.startsWith("/orders")
                  ? "text-orange-600"
                  : "text-gray-700"
              }`}
            >
              My Orders
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <svg
                className="w-7 h-7 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center gap-4">
            {/* Cart (mobile) */}
            <Link to="/cart" className="relative">
              <svg
                className="w-7 h-7 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {open ? (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block text-gray-700 font-medium hover:text-orange-600"
            >
              Home
            </Link>
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="block text-gray-700 font-medium hover:text-orange-600"
            >
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
