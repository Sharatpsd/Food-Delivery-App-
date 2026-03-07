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
      <article className="group h-full cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#1a1d24] to-[#151820] shadow-[0_14px_35px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-2 hover:border-orange-400/60 hover:shadow-[0_22px_45px_rgba(249,115,22,0.25)]">

        {/* IMAGE */}
        <div className="relative h-44 w-full overflow-hidden">

          <img
            src={`${imgUrl}?w=500&h=300&fit=crop&auto=format`}
            alt={item?.name || "Restaurant"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500";
            }}
          />

          {/* DELIVERY TIME */}
          <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {deliveryTime} min
          </div>

        </div>

        {/* BODY */}
        <div className="flex min-h-[138px] flex-col p-5">

          <h3 className="mb-1 line-clamp-2 text-xl font-extrabold leading-tight text-white transition-colors group-hover:text-orange-300">
            {item?.name || "Restaurant"}
          </h3>

          <p className="mb-4 text-sm text-gray-300">
            {item?.city || "Near you"}
          </p>

          <div className="mt-auto flex items-center justify-between">

            {/* rating */}
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-400">{"\u2605"}</span>
              <span className="font-bold text-white">
                {item?.rating || "4.5"}
              </span>
            </div>

            {/* theme */}
            <span className="rounded-full border border-orange-300/30 bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-200">
              {item?.theme || "Restaurant"}
            </span>

          </div>

        </div>

      </article>
    </Link>
  );
}

