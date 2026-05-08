import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Restaurants from "./pages/Restaurants";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import DeliveryAgents from "./pages/DeliveryAgents";
import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: "Dashboard", path: "/", icon: "\u{1F4CA}" },
    { label: "Users", path: "/users", icon: "\u{1F465}" },
    { label: "Restaurants", path: "/restaurants", icon: "\u{1F3EA}" },
    { label: "Orders", path: "/orders", icon: "\u{1F4E6}" },
    { label: "Payments", path: "/payments", icon: "\u{1F4B3}" },
    { label: "Delivery Agents", path: "/delivery-agents", icon: "\u{1F69A}" },
    { label: "Reports", path: "/reports", icon: "\u{1F4C8}" },
  ];

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } flex flex-col bg-gray-900 text-white transition-all duration-300`}
        >
          <div className="flex items-center justify-between p-4">
            {sidebarOpen && <h1 className="text-2xl font-bold">Admin</h1>}
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="rounded p-1 hover:bg-gray-700"
            >
              {sidebarOpen ? "\u2190" : "\u2192"}
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-4 rounded p-3 transition hover:bg-gray-700"
              >
                <span className="text-2xl">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-700 p-4">
            {sidebarOpen && (
              <button
                type="button"
                className="w-full rounded bg-red-600 p-2 transition hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <header className="bg-white p-4 shadow">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          </header>

          <main className="p-8">
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
    </BrowserRouter>
  );
}
