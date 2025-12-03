// src/pages/Home.jsx
import { useEffect, useState, useCallback } from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import RestaurantGrid from "../components/RestaurantGrid";
import { getRestaurants } from "../utils/api";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async (cat = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRestaurants({ category: cat });
      setRestaurants(data.data?.results || data.data || []);
    } catch (err) {
      setError("Failed to load restaurants. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants(category);
  }, [category, fetchRestaurants]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <Hero />
      <Categories onSelect={setCategory} selected={category} />

      {error ? (
        <div className="px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {error}
            </h3>
            <button
              onClick={() => fetchRestaurants(category)}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <RestaurantGrid
          title={
            category ? `${category} Restaurants` : "Popular Restaurants Near You"
          }
          list={restaurants}
          loading={loading}
        />
      )}
    </div>
  );
}
