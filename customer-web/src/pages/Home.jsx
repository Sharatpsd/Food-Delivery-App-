// src/pages/Home.jsx – FINAL FULLY UPDATED VERSION
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { Search, MapPin, ChevronDown, Bike, Shield, Star } from "lucide-react";

import Categories from "../components/Categories";
import RestaurantGrid from "../components/RestaurantGrid";
import { getRestaurants } from "../utils/api";
import { useLocation } from "react-router-dom";

export default function Home() {
  const locationHook = useLocation(); // 👈 Navbar search URL detect করবে

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [location] = useState("Dhaka, Bangladesh");

  // Extract "?search=xxx" from URL
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const query = params.get("search") || "";
    setSearchText(query);
    fetchRestaurants(query, category);
  }, [locationHook.search]);

  const fetchRestaurants = useCallback(async (search = "", cat = "") => {
    try {
      setLoading(true);

      const params = {};
      if (search) params.search = search;
      if (cat) params.category = cat;

      const data = await getRestaurants(params);
      setRestaurants(data.data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    fetchRestaurants(searchText, category);
  }, [category]);

  const handleSearch = () => fetchRestaurants(searchText, category);

  return (
    <>
      <section className="relative h-screen overflow-hidden">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">

          {/* Premium Logo */}
          <motion.h1
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-8xl md:text-9xl font-extrabold tracking-tight drop-shadow-xl"
            style={{
              background: "linear-gradient(135deg, #FFEEC9, #FFBE5A, #FF8A36)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bite
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-3xl md:text-5xl font-semibold text-white drop-shadow-lg"
          >
            Food delivered in minutes • Hot & Fresh
          </motion.p>

          {/* Search Bar in Hero */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 w-full max-w-4xl"
          >
            <div className="bg-white/95 rounded-3xl shadow-2xl p-5 flex items-center gap-4 border-2 border-orange-300">

              <MapPin className="w-8 h-8 text-orange-600" />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search restaurants, biryani, pizza..."
                className="flex-1 text-xl outline-none"
              />

              <button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg"
              >
                <Search size={28} />
              </button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10"
          >
            <ChevronDown className="w-12 h-12 text-white opacity-80" />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <Categories onSelect={setCategory} selected={category} />

      {/* Restaurant List */}
      <RestaurantGrid
        title={category ? `${category} Specials` : "Trending Near You"}
        list={restaurants}
        loading={loading}
      />
    </>
  );
}
