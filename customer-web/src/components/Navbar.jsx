// src/components/Navbar.jsx – NORMAL STRUCTURE + PERFECT TEXT SIZES
import { useState } from "react";
import { Menu, X, ShoppingCart, ChevronDown, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          
          {/* Logo - Perfect Sizes */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Bite
            </h1>
          </Link>

          {/* Desktop Nav - Professional Text Sizes */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2 lg:space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-gray-700 font-semibold text-sm sm:text-base lg:text-lg xl:text-xl hover:text-orange-600 transition-colors py-2 px-3 lg:px-4"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Partner Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 font-semibold text-sm sm:text-base lg:text-lg xl:text-xl hover:text-orange-600 transition-colors py-2 px-3 lg:px-4">
                Partner <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 lg:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-3">
                <Link 
                  to="/restaurant-owner"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition block w-full text-left text-sm sm:text-base"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">Restaurant Owner</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Add your menu & start selling</p>
                  </div>
                </Link>
                <Link 
                  to="/delivery-partner"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition block w-full text-left text-sm sm:text-base"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">Delivery Partner</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Earn money delivering food</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <button onClick={handleCartClick} className="relative p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition group">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-orange-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs sm:text-sm rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-red-600 font-semibold text-sm sm:text-base lg:text-lg hover:text-red-700 transition py-2 px-4">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 font-semibold text-sm sm:text-base lg:text-lg hover:text-orange-600 py-2 px-3 lg:px-4">
                  Sign In
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-sm sm:text-base lg:text-lg px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-4 sm:px-6 py-6 lg:py-8 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="block py-4 px-4 text-lg sm:text-xl font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 border-l-4 border-transparent hover:border-orange-600"
                  onClick={closeMobileMenu}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/restaurant-owner"
                className="block w-full py-4 px-4 text-xl font-bold text-orange-600 border-l-4 border-orange-600 bg-orange-50 rounded-r-xl text-left transition-all duration-300"
                onClick={closeMobileMenu}
              >
                👨‍🍳 Join as Restaurant Owner
              </Link>
              <Link 
                to="/delivery-partner"
                className="block w-full py-4 px-4 text-xl font-bold text-emerald-600 border-l-4 border-emerald-600 bg-emerald-50 rounded-r-xl text-left transition-all duration-300"
                onClick={closeMobileMenu}
              >
                🚚 Join as Delivery Partner
              </Link>
              <div className="pt-6 border-t border-gray-200 space-y-3">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="w-full text-left py-4 px-4 text-xl font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all">
                    Logout
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block w-full text-center py-4 px-6 text-lg sm:text-xl font-bold text-orange-600 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all"
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="block w-full text-center py-4 px-6 text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
