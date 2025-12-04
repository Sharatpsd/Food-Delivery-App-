// src/pages/Login.jsx – PREMIUM BITE LOGIN
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/token/", {
        username,
        password,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/");
      window.location.reload();
    } catch (err) {
      alert("Wrong username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80"
          alt="Food background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl p-10 w-full max-w-md border border-white/30"
      >
        {/* Bite Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <h1
              className="text-7xl font-black tracking-tighter"
              style={{
                background: "linear-gradient(135deg, #FFB74D, #FF8A65, #FF7043)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Bite
            </h1>
          </motion.div>
          <p className="text-gray-600 mt-3 text-lg font-medium">Welcome back! Order your favorites</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all duration-300 placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all duration-300 placeholder-gray-500 pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition"
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xl py-6 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Login to Bite <ArrowRight className="w-7 h-7" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-10 text-center space-y-4">
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

      {/* Decorative Element */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
      />
    </div>
  );
}