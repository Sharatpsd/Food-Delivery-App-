// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: "Hungry? You're in the right place", subtitle: "Order food from top-rated restaurants near you." },
    { title: "Fast delivery, hot food", subtitle: "We deliver your food in 30 minutes or less." },
    { title: "Craving burgers or biryani?", subtitle: "Find your favorite dishes in seconds." },
  ];

  const categories = ["All", "Burger", "Pizza", "Biryani", "Chicken", "Others"];

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/restaurants/")
      .then((res) => {
        setRestaurants(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const getCategory = (r) => {
    const name = (r.name || "").toLowerCase();
    if (name.includes("pizza")) return "Pizza";
    if (name.includes("burger")) return "Burger";
    if (name.includes("biryani")) return "Biryani";
    if (name.includes("kfc") || name.includes("chicken")) return "Chicken";
    return "Others";
  };

  useEffect(() => {
    let data = [...restaurants];

    if (activeCategory !== "All") {
      data = data.filter((r) => getCategory(r) === activeCategory);
    }

    if (query.trim()) {
      data = data.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFiltered(data);
  }, [restaurants, query, activeCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-orange-600 rounded-full"></div>
      </div>
    );
  }

  const activeSlide = slides[currentSlide];

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-wide text-sm md:text-base mb-3 font-semibold">
            Food Delivery App
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {activeSlide.title}
          </h1>
          <p className="text-lg md:text-xl text-orange-100 mb-8">
            {activeSlide.subtitle}
          </p>

          <div className="max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants..."
              className="w-full px-5 py-4 rounded-full shadow-xl text-gray-800 text-lg outline-none border-2 border-transparent focus:border-white"
            />
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full ${
                  idx === currentSlide ? "bg-white" : "bg-orange-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                activeCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Popular Restaurants
        </h2>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-xl mt-10">
            No restaurants found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to={`/restaurant/${r.id}`}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={`http://127.0.0.1:8000${r.logo}`}
                  alt={r.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold">{r.name}</h3>
                  <p className="text-gray-600">{r.address}</p>

                  {/* NEW FIELDS
                  <p className="text-gray-700 mt-2 text-sm">
                    <strong>Avg Cost:</strong> {r.avg_cost}
                  </p>

                  <p className="text-gray-700 mt-1 text-sm">
                    <strong>Theme:</strong> {r.theme}
                  </p>

                  <p className="text-gray-700 mt-1 text-sm">
                    <strong>City:</strong> {r.city}
                  </p>

                  <a
                    href={r.website}
                    target="_blank"
                    className="text-blue-600 underline mt-2 block text-sm"
                  >
                    Visit Website
                  </a> */}

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-yellow-500 font-bold">
                      ⭐ {r.rating || "New"}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                      {getCategory(r)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
