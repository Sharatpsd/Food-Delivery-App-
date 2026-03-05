import { Link } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

export default function RestaurantCard({ item }) {

  // default image
  let imgUrl =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500";

  if (item?.logo) {

    // encoded unsplash url fix
    if (item.logo.includes("https%3A")) {
      imgUrl = decodeURIComponent(item.logo.replace("/media/", ""));
    }

    // external image
    else if (item.logo.startsWith("http")) {
      imgUrl = item.logo;
    }

    // django uploaded image
    else {
      imgUrl = `${API_BASE}${item.logo}`;
    }
  }

  const deliveryTime =
    item?.delivery_time_estimate || Math.floor(Math.random() * 20) + 20;

  return (
    <Link to={`/restaurant/${item.id}`}>
      <article className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">

        {/* IMAGE */}
        <div className="h-48 w-full overflow-hidden relative">

          <img
            src={`${imgUrl}?w=500&h=300&fit=crop&auto=format`}
            alt={item?.name || "Restaurant"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500";
            }}
          />

          {/* DELIVERY TIME */}
          <div className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
            {deliveryTime} min
          </div>

        </div>

        {/* BODY */}
        <div className="p-5">

          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
            {item?.name || "Restaurant"}
          </h3>

          <p className="text-sm text-gray-500 mb-3">
            {item?.city || "Near you"}
          </p>

          <div className="flex items-center justify-between">

            {/* rating */}
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold text-gray-900">
                {item?.rating || "4.5"}
              </span>
            </div>

            {/* theme */}
            <span className="text-xs px-3 py-1 rounded-full bg-pink-50 text-pink-700 font-medium">
              {item?.theme || "Restaurant"}
            </span>

          </div>

        </div>

      </article>
    </Link>
  );
}