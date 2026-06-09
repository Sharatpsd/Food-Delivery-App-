import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Restaurants from "./pages/Restaurants";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import DeliveryAgents from "./pages/DeliveryAgents";
import Login from "./pages/Login";

function SidebarLink({ item, isActive, sidebarOpen }) {
  return (
    <Link
      to={item.path}
      className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200
        ${isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
          : "hover:bg-gray-800 text-gray-300 hover:text-white"
        }`}
    >
      <span className="text-2xl transition-transform group-hover:scale-110">
        {item.icon}
      </span>
      <span
        className={`transition-all duration-200 whitespace-nowrap overflow-hidden
          ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
      >
        {item.label}
      </span>
    </Link>
  );
}

function AppContent({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: "📊" },
    { label: "Users", path: "/users", icon: "👥" },
    { label: "Restaurants", path: "/restaurants", icon: "🍽️" },
    { label: "Orders", path: "/orders", icon: "📦" },
    { label: "Payments", path: "/payments", icon: "💳" },
    { label: "Delivery Agents", path: "/delivery-agents", icon: "🛵" },
    { label: "Reports", path: "/reports", icon: "📈" },
  ];

  const currentPage = menuItems.find((m) => m.path === location.pathname)?.label || "Dashboard";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            A
          </div>
          {sidebarOpen && (
            <h1 className="text-3xl font-bold tracking-tight text-white">
              AdminHub
            </h1>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </nav>

        {/* User & Logout Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-gray-800/50 rounded-2xl">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-semibold text-xl">
              SA
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-semibold text-white">Super Admin</p>
                <p className="text-xs text-gray-400">admin@foodhub.com</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-400 font-medium py-3.5 rounded-2xl transition-all"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-5 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            {currentPage} Management
          </h2>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search orders, users, restaurants..."
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-2xl py-3 pl-12 focus:outline-none focus:border-blue-500 transition-all"
              />
              <span className="absolute left-5 top-3.5 text-gray-400">🔍</span>
            </div>

            {/* Notification */}
            <button className="relative p-3 hover:bg-gray-800 rounded-2xl transition-all text-2xl">
              🛎️
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-xs flex items-center justify-center rounded-full font-medium">
                3
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-white">Shahin Alam</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  ● Online
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold ring-2 ring-blue-500/30">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-950 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/delivery-agents" element={<DeliveryAgents />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user has a token
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AppContent onLogout={handleLogout} />
      )}
    </BrowserRouter>
  );
}