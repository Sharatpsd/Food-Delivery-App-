// restaurant-dashboard/src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  if (location.pathname === "/login") return null;

  return (
    <nav className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-2xl fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold flex items-center gap-3">
          <span className="text-5xl">Restaurant</span> Bite Partner
        </Link>

        <div className="flex items-center gap-8 text-lg">
          <Link to="/" className="hover:text-orange-200 font-medium">Dashboard</Link>
          <Link to="/foods" className="hover:text-orange-200 font-medium">Menu</Link>
          <Link to="/orders" className="hover:text-orange-200 font-medium">Orders</Link>
          
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}