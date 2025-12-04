// src/pages/Register.jsx – ULTRA PREMIUM SIGN UP
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password2: formData.password2,
      });
      alert("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed. Try another username/email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1920&q=80"
          alt="Food"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-4xl p-10 w-full max-w-lg border border-white/40"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-7xl font-black tracking-tighter inline-block"
            style={{
              background: "linear-gradient(135deg, #FFB74D, #FF8A65, #FF7043)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bite
          </motion.h1>
          <p className="text-gray-600 mt-3 text-lg">Join thousands of food lovers</p>
        </div>

        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (01xxxxxxxxx)"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-16 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-5 text-gray-500 hover:text-orange-600"
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-16 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-5 top-5 text-gray-500 hover:text-orange-600"
            >
              {showConfirm ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 
                     text-white font-black text-2xl py-6 rounded-2xl shadow-2xl hover:shadow-orange-500/60 
                     transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-70"
          >
            {loading ? "Creating Account..." : (
              <>
                Sign Up Free <ArrowRight className="w-8 h-8" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-10 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 font-bold hover:underline text-lg">
            Log in
          </a>
        </p>

        <div className="text-center mt-8 text-sm text-gray-500 flex items-center justify-center gap-2">
          <ChefHat className="w-5 h-5 text-orange-600" />
          <span>© 2025 Bite – Made with love in Bangladesh</span>
        </div>
      </motion.div>

      {/* Floating Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}