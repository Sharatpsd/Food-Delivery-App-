// src/pages/Home.jsx – ULTRA MODERN CINEMATIC HOME PAGE (2026 Ready)
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, ChefHat, Bike, Star, Clock, Users, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Categories from "../components/Categories";
import RestaurantGrid from "../components/RestaurantGrid";
import { getRestaurants } from "../utils/api";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await getRestaurants({ category });
      setRestaurants(res.data || []);
    } catch (err) {
      console.error("Failed to load restaurants", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [category]);

  return (
    <>
      {/* HERO – Cinematic Parallax + Location Only */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Zoom */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        >
          <img
            src="https://images.deliveryhero.io/image/fd-bd/LH/lfxp-listing.jpg"
            alt="Dhaka Night Food Delivery"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Main Title - Spring Bounce + Gradient */}
          <motion.h1
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3, type: "spring", stiffness: 90, damping: 14 }}
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-6"
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFB74D, #FF8A65, #FF5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            data-aos="fade-down"
          >
            Bite
          </motion.h1>

          {/* Location Only - No Search */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="w-full max-w-xl mx-auto"
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 flex items-center gap-4 border border-white/20"
            >
              <MapPin className="w-7 h-7 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">📍Dhaka Division</p>
                <p className="text-lg font-semibold text-gray-900">Best restaurants near you</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats - Tight & Emoji */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-20 flex flex-col sm:flex-row justify-center items-center gap-8 text-white text-center"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div>
              <div className="text-4xl sm:text-5xl font-black text-orange-400 mb-1">⭐ 4.9</div>
              <p className="text-lg opacity-90">Rating</p>
            </div>
            <div className="w-px h-12 bg-white/30 hidden sm:block" />
            <div>
              <div className="text-4xl sm:text-5xl font-black text-orange-400 mb-1">⏱️ 15</div>
              <p className="text-lg opacity-90">Min Delivery</p>
            </div>
            <div className="w-px h-12 bg-white/30 hidden sm:block" />
            <div>
              <div className="text-4xl sm:text-5xl font-black text-orange-400 mb-1">👥 500+</div>
              <p className="text-lg opacity-90">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-white/30 hidden sm:block" />
            <div>
              <div className="text-4xl sm:text-5xl font-black text-orange-400 mb-1">🏪 100+</div>
              <p className="text-lg opacity-90">Restaurants</p>
            </div>
          </motion.div>
        </div>
      </section>

  

      {/* RESTAURANTS GRID – Tighter Spacing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-10 text-gray-900"
            data-aos="fade-up"
          >
           
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <RestaurantGrid title="" list={restaurants} loading={loading} />
          </motion.div>
        </div>
      </section>

      {/* JOIN PLATFORM – Enhanced with Features */}
      <section className="py-24 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            🚀 Grow With Bite
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Join 1000+ restaurants & riders. Zero commission, instant payouts, real-time order tracking 📱
          </motion.p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
              <Star className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Zero Commission</h4>
              <p className="text-gray-600">Keep 100% of your profits 💰</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100">
              <Clock className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-gray-600">15 min average delivery ⏱️</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">500+ Customers</h4>
              <p className="text-gray-600">Growing daily 👥</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
              <Store className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Live Tracking</h4>
              <p className="text-gray-600">Real-time GPS 📍</p>
            </motion.div>
          </div>

          {/* Partner Cards */}
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Restaurant Owner */}
            <motion.div
              whileHover={{ y: -12, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <div className="p-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <ChefHat className="w-14 h-14 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">🍽️ Restaurant Owner?</h3>
                <p className="text-xl text-gray-600 mb-8">Add menu, get orders, keep 100% profit</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/restaurant-owner")}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-5 rounded-full font-bold flex items-center gap-3 mx-auto text-lg hover:shadow-2xl transition-all"
                >
                  Become Partner <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>

            {/* Delivery Partner */}
            <motion.div
              whileHover={{ y: -12, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 hover:shadow-2xl transition-all"
              data-aos="zoom-in"
              data-aos-delay="600"
            >
              <div className="p-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Bike className="w-14 h-14 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">🚀 Want to Deliver?</h3>
                <p className="text-xl text-gray-600 mb-8">Earn daily, flexible hours, fast payouts</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/delivery-partner")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-5 rounded-full font-bold flex items-center gap-3 mx-auto text-lg hover:shadow-2xl transition-all"
                >
                  Join as Rider <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
