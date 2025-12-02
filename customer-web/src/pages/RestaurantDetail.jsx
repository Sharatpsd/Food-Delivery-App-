// src/pages/RestaurantDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "../components/FoodCard";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const r = await axios.get(`http://127.0.0.1:8000/api/restaurants/${id}/`);
      setRestaurant(r.data);

      const f = await axios.get(`http://127.0.0.1:8000/api/foods/?restaurant=${id}`);
      setFoods(f.data);

      setLoading(false);
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-orange-600 rounded-full"></div>
      </div>
    );

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="text-center py-12 bg-white shadow-xl">
        <img
          src={`http://127.0.0.1:8000${restaurant.logo}`}
          className="mx-auto w-40 h-40 rounded-full object-cover shadow-xl border-4 border-orange-300"
        />
        <h1 className="text-5xl font-bold mt-6">{restaurant.name}</h1>
        <p className="text-xl text-gray-600 mt-3">{restaurant.address}</p>

        {/* NEW INFO SECTION */}
        <div className="mt-8 max-w-3xl mx-auto text-left bg-gray-100 p-6 rounded-2xl shadow">
          <p className="text-lg"><strong>Theme:</strong> {restaurant.theme}</p>
          <p className="text-lg mt-2"><strong>Avg Cost:</strong> {restaurant.avg_cost}</p>
          <p className="text-lg mt-2"><strong>Must Try:</strong> {restaurant.must_try}</p>
          <p className="text-lg mt-2"><strong>Timings:</strong> {restaurant.timings}</p>
          <p className="text-lg mt-2"><strong>City:</strong> {restaurant.city}</p>
          <p className="text-lg mt-2"><strong>Social:</strong> {restaurant.social}</p>

          <a
            href={restaurant.website}
            target="_blank"
            className="text-blue-600 underline mt-3 inline-block text-lg"
          >
            Visit Website
          </a>
        </div>
      </div>

      {/* MENU */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <h2 className="text-4xl font-bold text-center mb-12">Menu</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
}
