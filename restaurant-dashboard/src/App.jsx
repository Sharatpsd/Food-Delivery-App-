import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Foods from "./pages/Foods";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedPage>
              <Orders />
            </ProtectedPage>
          }
        />
        <Route
          path="/orders-simple"
          element={<Navigate to="/orders" replace />}
        />
        <Route
          path="/foods"
          element={
            <ProtectedPage>
              <Foods />
            </ProtectedPage>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
