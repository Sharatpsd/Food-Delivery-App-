import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, Star, ShoppingCart } from "lucide-react";
import { getRestaurantDetail, getRestaurantFoods } from "../utils/api";

export default function RestaurantDetail() {

  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {

    const fetchData = async () => {
      try {

        const res = await getRestaurantDetail(id);
        setRestaurant(res.data);

        const foodsRes = await getRestaurantFoods(id);
        setFoods(foodsRes.data);

      } catch (err) {
        console.error("Restaurant load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading restaurant...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Restaurant not found
      </div>
    );
  }

  // 🔥 FIXED IMAGE LOGIC
  const imageUrl = restaurant.logo?.startsWith("http")
    ? restaurant.logo
    : `http://localhost:8000${restaurant.logo}`;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">

          <Link
            to="/"
            className="flex items-center gap-2 text-white/90 hover:text-white"
          >
            <ArrowLeft size={20} />
            Back
          </Link>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* RESTAURANT HERO */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">

          <img
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            }
            alt={restaurant.name}
            className="w-full h-80 object-cover"
          />

          <div className="p-8">

            <h1 className="text-4xl font-bold mb-2">
              {restaurant.name}
            </h1>

            <p className="text-gray-600 mb-3">
              {restaurant.city}
            </p>

            <div className="flex items-center gap-2">

              <Star
                className="text-yellow-400"
                fill="currentColor"
              />

              <span className="font-semibold">
                {restaurant.rating}
              </span>

            </div>

            <p className="mt-3 text-gray-600">
              {restaurant.theme}
            </p>

          </div>

        </div>

        {/* MENU */}
        <h2 className="text-3xl font-bold mb-6">
          Menu
        </h2>

        {foods.length === 0 && (
          <p className="text-gray-500">
            No food available
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {foods.map((item) => {

            const foodImage = item.image?.startsWith("http")
              ? item.image
              : `http://localhost:8000${item.image}`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >

                <img
                  src={
                    foodImage ||
                    "https://images.unsplash.com/photo-1606755962773-d324e0a13086"
                  }
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />

                <h3 className="text-xl font-bold mb-2">
                  {item.name}
                </h3>

                <p className="text-gray-500 mb-4">
                  {item.category || "Food"}
                </p>

                <div className="flex justify-between items-center">

                  <span className="text-orange-600 font-bold">
                    ৳ {item.price}
                  </span>

                  <button
                    onClick={() =>
                      addToCart({
                        ...item,
                        restaurant: restaurant.id,
                      })
                    }
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                  >
                    <ShoppingCart size={16} />
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}