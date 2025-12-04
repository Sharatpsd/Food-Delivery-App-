// src/pages/Home.jsx  (Full fixed + ultra premium version)
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Search,
  Bike,
  Shield,
  Star,
  MapPin,
  ChevronDown
} from "lucide-react";

import Categories from "../components/Categories";
import RestaurantGrid from "../components/RestaurantGrid";
import { getRestaurants } from "../utils/api";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [location] = useState("Dhaka, Bangladesh");

  const fetchRestaurants = useCallback(async (cat = "") => {
    try {
      setLoading(true);
      const data = await getRestaurants({ category: cat });
      setRestaurants(data.data?.results || data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    fetchRestaurants(category);
  }, [category, fetchRestaurants]);

  return (
    <>
      {/* EXACT DESIGN YOU SHOWED – SUPER EYE-CATCHING */}
      <section className="relative h-screen overflow-hidden">
        {/* Full Background Pizza */}
        <img
          src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1920&q=80"
          alt="Delicious pizza"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

          {/* Big Creamy Orange Bite Logo */}
          <motion.h1
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 80 }}
            className="text-8xl md:text-9xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFB74D, #FF8A65)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))"
            }}
          >
            Bite
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-2xl md:text-4xl font-light text-orange-100 tracking-wide"
          >
            Food delivered in minutes • Hot & Fresh
          </motion.p>

          {/* Premium Glass Search Bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 w-full max-w-4xl"
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-5 flex items-center gap-4 border border-white/50">
              <div className="flex items-center gap-3 flex-1">
                <MapPin className="w-8 h-8 text-orange-600" />
                <span className="text-xl font-semibold text-gray-800">{location}</span>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <input
                type="text"
                placeholder="Search biryani, pizza, burger..."
                className="flex-1 text-xl outline-none text-gray-700 placeholder-gray-500"
              />
              <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 
                               text-white p-5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110">
                <Search size={32} />
              </button>
            </div>
          </motion.div>

          {/* Glowing Glassmorphism Trust Cards – Now Super Eye-Catching */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col sm:flex-row gap-8"
          >
            {[
              { icon: Bike, text: "30 min delivery", color: "from-orange-400/30 to-red-400/30" },
              { icon: Shield, text: "100% Secure", color: "from-emerald-400/30 to-teal-400/30" },
              { icon: Star, text: "4.8 Rating", color: "from-yellow-400/30 to-amber-400/30" }
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${item.color} backdrop-blur-xl 
                         rounded-3xl px-10 py-8 border border-white/30 
                         shadow-2xl hover:scale-110 transition-all duration-500 
                         flex items-center gap-5 min-w-[220px]`}
              >
                <item.icon className="w-14 h-14 text-white drop-shadow-lg" />
                <div className="text-left">
                  <div className="text-3xl font-black text-white drop-shadow-md">
                    {item.text.split(" ")[0]} <span className="text-xl">{item.text.split(" ").slice(1).join(" ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10"
          >
            <ChevronDown className="w-12 h-12 text-white/80" />
          </motion.div>
        </div>
      </section>

      {/* Rest of your page – keep everything below */}
      <Categories onSelect={setCategory} selected={category} />
      
      <RestaurantGrid
        title={category ? `${category} Specials` : "Trending Near You"}
        list={restaurants}
        loading={loading}
      />

      {/* You can keep your final CTA or any other section */}
    </>
  );
}