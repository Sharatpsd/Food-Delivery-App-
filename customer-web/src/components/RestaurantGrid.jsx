// src/components/RestaurantGrid.jsx â€“ ZEN MODE (NO "Not Found" EVER)
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, Star, Truck, X } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import { useState } from "react";

export default function RestaurantGrid({ 
  list = [], 
  loading = false, 
  title = "Restaurants",
  category 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // ZEN FILTER LOGIC - ALWAYS SHOWS RESULTS
  const filteredRestaurants = list.filter((restaurant) => {
    // Always match search (fallback to show all if no exact match)
    const matchesSearch = !searchTerm || 
      restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
      restaurant.type?.toLowerCase() === filterType.toLowerCase() ||
      restaurant.cuisine?.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Loading States - Premium Glassmorphism
  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-2xl text-white px-10 py-5 rounded-3xl font-black text-2xl shadow-2xl border border-white/30"
            >
              <Search className="w-7 h-7" />
              Finding best restaurants near you...
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-gradient-to-br from-white/70 to-orange-50/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 animate-pulse hover:scale-[1.02] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-full h-48 bg-gradient-to-br from-orange-100/60 to-red-100/60 rounded-3xl mb-6 shadow-xl" />
                <div className="h-6 bg-white/50 rounded-xl mb-3 mx-auto w-4/5" />
                <div className="h-5 bg-[#1b1f27]/40 rounded-lg w-3/5 mx-auto" />
                <div className="mt-4 flex gap-2 justify-center">
                  <div className="w-3 h-3 bg-orange-300 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-orange-300 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-orange-300 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-orange-300 rounded-full animate-pulse delay-150" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // NO EMPTY STATE - Always show something
  const displayRestaurants = filteredRestaurants.length > 0 ? filteredRestaurants : list.slice(0, 8);

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="mb-6 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-4xl font-black leading-tight tracking-tight text-transparent md:text-6xl lg:text-7xl">
            {title || "Best Restaurants Near You"}
          </h2>
          {category && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-3 rounded-3xl border border-orange-400/40 bg-gradient-to-r from-orange-500/15 to-red-500/15 px-8 py-4 text-xl font-bold text-orange-200 shadow-lg backdrop-blur-xl"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="w-6 h-6" />
              {category} Specials
            </motion.div>
          )}
        </motion.div>

        {/* ZEN FILTERS & SEARCH - NEVER EMPTY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-[#14171c]/95 via-[#171b22]/95 to-[#1b2028]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-3xl lg:mb-20 lg:flex-row lg:items-center"
        >
          {/* Zen Search */}
          <div className="relative flex-1 max-w-lg group">
            <Search className="w-6 h-6 text-orange-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 group-hover:text-orange-500 transition-all duration-300" />
            <input
              type="text"
              placeholder="Search Restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-3xl border-2 border-white/10 bg-[#0f1115]/90 py-5 pl-14 pr-6 text-xl font-semibold text-white placeholder-gray-400 shadow-xl transition-all duration-500 hover:border-orange-400/60 hover:shadow-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-500/30"
            />
          </div>

          {/* Zen Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "All", value: "all", emoji: "\u{1F31F}" },
              { label: "Fast Food", value: "fastfood", emoji: "\u{1F354}" },
              { label: "Bengali", value: "bengali", emoji: "\u{1F35B}" },
              { label: "Chinese", value: "chinese", emoji: "\u{1F961}" },
              { label: "Pizza", value: "pizza", emoji: "\u{1F355}" },
            ].map(({ label, value, emoji }) => (
              <motion.button
                key={value}
                onClick={() => setFilterType(value)}
                whileHover={{ 
                  scale: 1.1, 
                  y: -4, 
                  boxShadow: "0 15px 35px rgba(255, 107, 0, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 rounded-2xl border-2 px-5 py-3 text-sm font-bold transition-all duration-300 backdrop-blur-xl shadow-lg ${
                  filterType === value
                    ? "border-orange-400 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/45"
                    : "border-white/10 bg-[#1b1f27]/95 text-gray-200 hover:border-orange-400/70 hover:bg-[#232833] hover:text-orange-200 hover:shadow-xl"
                }`}
              >
                <span className="text-base">{emoji}</span>
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>


        {/* ZEN RESTAURANT GRID - NEVER EMPTY */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8">
            {displayRestaurants.map((item, index) => (
              <motion.div
                key={`${item.id}-${searchTerm}-${filterType}-${index}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.04,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                layout
                whileHover={{ y: -8 }}
              >
                <RestaurantCard item={item} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Zen Load More */}
        {displayRestaurants.length < list.length && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-24 lg:mt-32"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="px-16 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-orange-400/50 backdrop-blur-xl"
            >
              Load More Delicious Spots \u2728
            </motion.button>
          </motion.div>
        )}

        {/* Search Results Counter */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white px-10 py-4 rounded-3xl font-bold text-xl shadow-2xl backdrop-blur-xl border border-white/30">
              \u2728 {displayRestaurants.length} perfect matches found!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}



