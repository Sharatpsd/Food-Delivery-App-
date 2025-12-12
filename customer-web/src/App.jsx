import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Stats from "./components/Stats";
import Features from "./components/Features";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import RestaurantOwner from "./pages/RestaurantOwner";
import DeliveryPartner from "./pages/DeliveryPartner";

// Auth Protectors
function RequireAuth({ children }) {
  return localStorage.getItem("access") ? children : <Navigate to="/login" replace />;
}

function RedirectIfLoggedIn({ children }) {
  return localStorage.getItem("access") ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <ScrollToTop />
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Home />
                    <Stats />
                    <Features />
                  </>
                }
              />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/restaurant-owner" element={<RestaurantOwner />} />
              <Route path="/delivery-partner" element={<DeliveryPartner />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />

              <Route
                path="/login"
                element={
                  <RedirectIfLoggedIn>
                    <Login />
                  </RedirectIfLoggedIn>
                }
              />

              <Route
                path="/register"
                element={
                  <RedirectIfLoggedIn>
                    <Register />
                  </RedirectIfLoggedIn>
                }
              />

              <Route
                path="/cart"
                element={
                  <RequireAuth>
                    <Cart />
                  </RequireAuth>
                }
              />

              <Route
                path="/checkout"
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />

              <Route
                path="/orders"
                element={
                  <RequireAuth>
                    <Orders />
                  </RequireAuth>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}
