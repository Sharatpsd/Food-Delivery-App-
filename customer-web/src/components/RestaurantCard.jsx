import { Link } from "react-router-dom";

export default function RestaurantCard({ data }) {
  (
  <Link
    to={`/restaurant/${data.id}`}
    className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
  >
    <div className="relative overflow-hidden">
      <img
        src={`http://127.0.0.1:8000${data.logo}`}
        alt={data.name}
        className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition"></div>
    </div>

    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800">{data.name}</h3>
      <p className="text-gray-600 mt-1">{data.address}</p>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-2xl">Star</span>
        <span className="text-yellow-600 font-bold text-lg">
          {data.rating || "New"}
        </span>
      </div>
    </div>
  </Link>
);