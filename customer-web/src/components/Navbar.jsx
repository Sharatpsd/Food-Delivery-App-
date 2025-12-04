// src/components/Navbar.jsx – FIXED & PREMIUM
import { useState } from "react";
import { Search, Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Become a Partner", path: "/partner" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* Bite Logo */}
          <Link to="/" className="flex items-center">
            <h1
              className="text-5xl lg:text-6xl font-black tracking-tighter
                         bg-gradient-to-r from-orange-500 via-red-500 to-orange-600
                         bg-clip-text text-transparent drop-shadow-lg
                         transition-all duration-500 hover:scale-110"
            >
              Bite
            </h1>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-10">
            <ul className="flex space-x-12">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-700 font-semibold text-lg
                               hover:text-orange-600 transition-all duration-300
                               relative after:absolute after:bottom-[-8px] after:left-0
                               after:w-0 after:h-1 after:bg-orange-500
                               after:transition-all after:duration-300
                               hover:after:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side – Auth + Search */}
          <div className="flex items-center space-x-6">

            {/* Search */}
            <div className="relative hidden md:block">
              {searchOpen && (
                <input
                  type="text"
                  placeholder="Search restaurants, biryani, pizza..."
                  className="w-80 px-6 py-4 pr-14 rounded-full border-2 border-orange-300
                             outline-none focus:border-orange-500 focus:ring-4
                             focus:ring-orange-100 transition-all duration-300
                             shadow-xl text-gray-800"
                  autoFocus
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3
                           rounded-full hover:bg-orange-100 transition-all duration-300"
              >
                <Search size={28} className="text-orange-600" />
              </button>
            </div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-600
                           text-white font-bold px-8 py-4 rounded-full shadow-xl
                           hover:scale-105 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            ) : (
              <>
                {/* Sign In */}
                <Link
                  to="/login"
                  className="hidden lg:block text-gray-700 font-bold text-lg
                             hover:text-orange-600 transition-all duration-300"
                >
                  Sign In
                </Link>

                {/* Sign Up – FIXED TO GO TO /register */}
                <Link
                  to="/register"
                  className="hidden lg:block bg-gradient-to-r from-orange-500 to-red-600
                             hover:from-orange-600 hover:to-red-700
                             text-white font-bold px-10 py-4 rounded-full
                             shadow-2xl hover:shadow-orange-500/50 hover:scale-105
                             transition-all duration-300 text-lg"
                >
                  Sign Up Free
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-full hover:bg-orange-50 transition"
            >
              {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu – Also Fixed */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-orange-200 bg-white">
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-2xl font-medium text-gray-700 hover:text-orange-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-6 space-y-5 border-t-2 border-gray-200">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-5 rounded-2xl font-bold text-xl"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-center bg-gray-100 text-orange-600 py-5 rounded-2xl font-bold text-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-600
                                     text-white py-5 rounded-2xl font-bold text-xl shadow-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up Free
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