// src/pages/Register.jsx – ULTRA PREMIUM SIGN UP (FULLY UPDATED)
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
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

  // Handle Input Change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      await axios.post("http://127.0.0.1:8000/api/auth/register/", payload);

      alert("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.username?.[0] ||
          err.response?.data?.detail ||
          "Registration failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1920&q=80"
          alt="Food bg"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl p-10 w-full max-w-lg border border-white/40"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="text-7xl font-black tracking-tighter inline-block"
            style={{
              background: "linear-gradient(135deg, #FFB74D, #FF8A65, #FF7043)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bite
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Join thousands of food lovers</p>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Create Your Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg"
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
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg"
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
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-lg outline-none"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-lg outline-none"
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
              className="w-full pl-14 pr-16 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-lg outline-none"
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
              className="w-full pl-14 pr-16 py-5 rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-lg outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-5 top-5 text-gray-500 hover:text-orange-600"
            >
              {showConfirm ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-2xl py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? "Creating Account..." : <>Sign Up <ArrowRight className="w-7 h-7" /></>}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-8 text-gray-700">
          Already have an account?{" "}
          <a href="/login" className="text-orange-700 font-bold hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
