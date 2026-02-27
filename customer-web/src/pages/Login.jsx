// src/pages/Login.jsx – PREMIUM BITE LOGIN + GOOGLE LOGIN (no jwt-decode dependency)
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../utils/api";
import { decodeJwt } from "../utils/jwt";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // =====================================================
  // GOOGLE LOGIN HANDLER
  // =====================================================
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      alert("Google credential not received.");
      return;
    }

    // decode locally (no external package)
    const data = decodeJwt(credentialResponse.credential);
    if (!data) {
      alert("Failed to decode Google token.");
      return;
    }

    // prepare payload expected by your backend
    const payload = {
      token: credentialResponse.credential,
      email: data.email,
      name: data.name || data.email?.split("@")[0],
      avatar: data.picture || "",
      google_id: data.sub || "",
    };

    try {
      // call your backend endpoint that verifies Google token and returns JWT pair
      // adjust the path if your backend expects something else (e.g. /auth/google/ or /users/google-login/)
      const res = await api.post("/auth/google/", payload);

      localStorage.setItem("access", res.data.access);
      if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed.");
    }
  };

  // =====================================================
  // NORMAL LOGIN HANDLER
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://:8000/api/auth/token/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Login error:", err);
      alert("Wrong username or password");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl p-10 w-full max-w-md border border-white/30"
      >

        {/* Logo */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-7xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #FFB74D, #FF8A65, #FF7043)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bite
          </motion.h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            Welcome back! Order your favorites
          </p>
        </div>

        {/* Normal Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            placeholder="Username"
            className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 
            focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg 
            placeholder-gray-500 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 
              focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg pr-14 
              placeholder-gray-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white 
            font-black text-xl py-6 rounded-2xl shadow-xl hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login to Bite"}
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google login failed")}
          />
        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-2">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-orange-600 font-bold hover:underline">
              Sign up free
            </a>
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <ChefHat className="w-5 h-5" />
            <span className="text-sm">Powered by Bite • Bangladesh</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
