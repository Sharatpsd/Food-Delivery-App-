// src/pages/Home.jsx – ULTRA MODERN CINEMATIC HOME PAGE (2025 Ready)
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { Search, MapPin, User, ShoppingCart, ArrowRight, ChefHat, Bike } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Categories from "../components/Categories";
import RestaurantGrid from "../components/RestaurantGrid";
import { getRestaurants } from "../utils/api";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
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
      const res = await getRestaurants({ category, search });
      setRestaurants(res.data || []);
    } catch (err) {
      console.error("Failed to load restaurants", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [category, search]);

  return (
    <>
      {/* HERO – Cinematic Parallax + Spring Text + Premium Search */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Zoom */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        >
          <img
            src=" https://images.deliveryhero.io/image/fd-bd/LH/lfxp-listing.jpg"

       
            alt="Dhaka Night Food Delivery"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Main Title - Spring Bounce + Gradient */}
          <motion.h1
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3, type: "spring", stiffness: 90, damping: 14 }}
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFB74D, #FF8A65, #FF5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            data-aos="fade-down"
          >
            Bite
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-4 text-2xl sm:text-3xl font-bold text-orange-100"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Hot & Fresh Food Delivered in Minutes
          </motion.p>

          {/* Premium Search Bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 w-full max-w-2xl mx-auto"
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-4 flex items-center gap-4 border border-white/20"
            >
              <MapPin className="w-6 h-6 text-orange-600" />
              <input
                type="text"
                placeholder="Search biryani, pizza, burgers in your area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchRestaurants()}
                className="flex-1 outline-none text-gray-800 text-lg placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchRestaurants}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-12 text-white"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="text-center">
              <div className="text-5xl font-black text-orange-400">100+</div>
              <p className="text-sm mt-2 opacity-90">Partner Restaurants</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-orange-400">0%</div>
              <p className="text-sm mt-2 opacity-90">Commission (Beta)</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-orange-400">Live</div>
              <p className="text-sm mt-2 opacity-90">Across Bangladesh</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES – Staggered Fade In */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
            data-aos="fade-up"
          >
            Explore by Category
          </motion.h2>
          <div data-aos="fade-up" data-aos-delay="200">
            <Categories onSelect={setCategory} selected={category} />
          </div>
        </div>
      </section>

      {/* RESTAURANTS GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-16 text-gray-900"
            data-aos="fade-up"
          >
            {category ? `${category} Specials` : "Trending Near You"}
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

      {/* JOIN PLATFORM – Premium Cards with Lift */}
      <section className="py-24 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            Grow With Bite
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-700 mb-16 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Join thousands of restaurants and riders earning more with zero commission
          </motion.p>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Restaurant Owner */}
            <motion.div
              whileHover={{ y: -12, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <div className="p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <ChefHat className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Restaurant Owner?</h3>
                <p className="text-gray-600 mb-6">Add your menu, get orders, keep 100% profit</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/restaurant-owner")}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 mx-auto hover:shadow-xl transition"
                >
                  Become a Partner <ArrowRight />
                </motion.button>
              </div>
            </motion.div>

            {/* Delivery Partner */}
            <motion.div
              whileHover={{ y: -12, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100"
              data-aos="zoom-in"
              data-aos-delay="600"
            >
              <div className="p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <Bike className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Want to Deliver?</h3>
                <p className="text-gray-600 mb-6">Earn daily, flexible hours, fast payouts</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/delivery-partner")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 mx-auto hover:shadow-xl transition"
                >
                  Join as Rider <ArrowRight />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}