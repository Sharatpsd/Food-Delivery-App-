import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, Star, Truck } from "lucide-react";
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

  // Filter & Search Logic
  const filteredRestaurants = list.filter((restaurant) => {
    const matchesSearch = restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
                         restaurant.type?.toLowerCase() === filterType ||
                         restaurant.cuisine?.toLowerCase() === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Loading States
  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-2xl mb-8">
              <Search className="w-6 h-6" />
              Finding best restaurants near you...
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl animate-pulse border border-gray-200"
              >
                <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-300 rounded-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-orange-100 rounded-3xl mx-auto mb-8 flex items-center justify-center">
            <Search className="w-12 h-12 text-orange-500" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            No restaurants found
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Try adjusting your search or explore different categories
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            Explore Popular Restaurants
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-orange-600 bg-clip-text text-transparent mb-6">
            {title || "Best Restaurants Near You"}
          </h2>
          {category && (
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-6 py-3 rounded-full text-lg font-semibold">
              <MapPin className="w-5 h-5" />
              {category} Restaurants
            </div>
          )}
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search restaurants or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Fast Food", value: "fastfood" },
              { label: "Bengali", value: "bengali" },
              { label: "Chinese", value: "chinese" },
              { label: "Pizza", value: "pizza" },
            ].map(({ label, value }) => (
              <motion.button
                key={value}
                onClick={() => setFilterType(value)}
                className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  filterType === value
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white/50 border border-gray-200 hover:bg-orange-50 text-gray-700 hover:shadow-md"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 text-center"
        >
          {[
            { icon: Star, label: "4.8+", num: "1,247" },
            { icon: Truck, label: "Min Delivery", num: "25" },
            { icon: Clock, label: "Restaurants", num: filteredRestaurants.length.toLocaleString() },
          ].map(({ icon: Icon, label, num }, i) => (
            <div key={i} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-200/50 backdrop-blur-sm">
              <Icon className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{num}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Restaurant Grid */}
        <AnimatePresence>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${
            filteredRestaurants.length === 0 ? "grid-cols-1" : ""
          }`}>
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  layout
                >
                  <RestaurantCard item={item} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No restaurants match your search
                </h3>
                <p className="text-gray-600 mb-8">
                  Try different keywords or clear filters
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <motion.button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("all");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    Clear All Filters
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>

        {/* Load More (if needed) */}
        {filteredRestaurants.length > 0 && filteredRestaurants.length < list.length && (
          <div className="text-center mt-16">
            <motion.button
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Load More Restaurants
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
