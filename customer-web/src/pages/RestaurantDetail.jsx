import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";  // ✅ FIXED: ../ not ../../
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart } from "lucide-react";
import { getRestaurantDetail } from "../utils/api";  // ✅ FIXED: ../ not ../../

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getRestaurantDetail(id);
        setRestaurant(res.data);
      } catch (err) {
        console.error("Restaurant load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
          <Link to="/" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium mb-4"
          >
            <ArrowLeft size={24} />
            Back to Restaurants
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Restaurant Hero */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-80 object-cover"
          />
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-2xl text-gray-600">{restaurant.city}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-2xl text-yellow-500 mb-1">
                  <Star fill="currentColor" className="w-7 h-7" />
                  <span className="font-bold">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <Clock className="w-5 h-5" />
                  {restaurant.time}
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-700 mb-6">{restaurant.theme}</p>
            <p className="text-lg font-semibold text-orange-600 mb-2">Must Try: {restaurant.must_try}</p>
          </div>
        </div>

        {/* Menu Grid */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Menu</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurant.menu.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-orange-600">${item.price}</span>
                  <button
                    onClick={() => addToCart({ ...item, restaurant: restaurant.name })}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
