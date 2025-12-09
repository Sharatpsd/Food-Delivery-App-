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
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Bite
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-gray-700 font-medium text-sm hover:text-orange-600 transition"
              >
                {link.name}
              </Link>
            ))}
            {/* Partner Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 font-medium text-sm hover:text-orange-600 transition">
                Partner <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
                <Link 
                  to="/restaurant-owner"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition block w-full text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Restaurant Owner</h4>
                    <p className="text-xs text-gray-600">Add your menu & start selling</p>
                  </div>
                </Link>
                <Link 
                  to="/delivery-partner"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition block w-full text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Delivery Partner</h4>
                    <p className="text-xs text-gray-600">Earn money delivering food</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-3">
            <button onClick={handleCartClick} className="relative p-2 hover:bg-gray-100 rounded-xl transition group">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-red-600 font-medium text-sm hover:text-red-700 transition">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 font-medium text-sm hover:text-orange-600">
                  Sign In
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium px-5 py-2 text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="block py-3 text-base font-medium text-gray-700 hover:text-orange-600 border-l-4 border-transparent hover:border-orange-600 transition-all"
                  onClick={closeMobileMenu}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/restaurant-owner"
                className="block w-full py-3 text-base font-bold text-orange-600 border-l-4 border-orange-600 bg-orange-50 p-3 rounded-r-lg text-left"
                onClick={closeMobileMenu}
              >
                👨‍🍳 Join as Restaurant Owner
              </Link>
              <Link 
                to="/delivery-partner"
                className="block w-full py-3 text-base font-bold text-green-600 border-l-4 border-green-600 bg-green-50 p-3 rounded-r-lg text-left"
                onClick={closeMobileMenu}
              >
                🚚 Join as Delivery Partner
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="w-full text-left py-3 text-red-600 font-semibold">
                    Logout
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block w-full text-center bg-gray-100 text-orange-600 py-3 rounded-xl font-semibold"
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold"
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
