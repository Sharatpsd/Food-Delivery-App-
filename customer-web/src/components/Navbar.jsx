import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";   // ← IMPORTANT

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Become a Partner", path: "/partner" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();                     // For Sign in / Sign up

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("access");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* TEXT-ONLY "Bite" LOGO */}
          <Link to="/" className="flex items-center">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter 
                           bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 
                           bg-clip-text text-transparent drop-shadow-lg 
                           transition-all duration-500 hover:scale-110">
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

          {/* Right Side */}
          <div className="flex items-center space-x-6">

            {/* Search */}
            <div className="relative">
              {searchOpen && (
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines..."
                  className="w-80 px-5 py-3 pr-12 rounded-full border border-orange-300 
                           outline-none focus:border-orange-500 focus:ring-4 
                           focus:ring-orange-100 transition-all duration-300 
                           shadow-lg text-gray-800"
                  autoFocus
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 
                         rounded-full hover:bg-orange-100 transition-all duration-300"
              >
                <Search size={24} className="text-orange-600" />
              </button>
            </div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden lg:block text-gray-700 font-semibold hover:text-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden lg:block text-gray-700 font-semibold hover:text-orange-600 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="hidden lg:block bg-gradient-to-r from-orange-500 to-red-600 
                           hover:from-orange-600 hover:to-red-700 
                           text-white font-bold px-8 py-3 rounded-full 
                           shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Sign up
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-full hover:bg-orange-50 transition"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-6">
            <div className="px-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-xl font-medium text-gray-700 hover:text-orange-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 space-y-4">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="w-full text-left text-lg font-medium text-red-600">
                    Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="block text-lg font-medium text-gray-700">
                      Sign in
                    </Link>
                    <Link
                      to="/login"
                      className="block w-full bg-gradient-to-r from-orange-500 to-red-600 
                               text-white font-bold py-4 rounded-full text-center shadow-lg"
                    >
                      Sign up
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