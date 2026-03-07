import { motion } from "framer-motion";
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
      <article className="group h-full cursor-pointer overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-[#1c2029] to-[#141820] shadow-[0_20px_48px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-3 hover:border-orange-400/70 hover:shadow-[0_30px_60px_rgba(249,115,22,0.22)]">
        {/* IMAGE */}
        <div className="relative h-56 w-full overflow-hidden">
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
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />

          {/* DELIVERY TIME */}
          <motion.div
            className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {deliveryTime} min
          </motion.div>
        </div>

        {/* BODY */}
        <div className="relative flex min-h-[170px] flex-col p-6">
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 top-0 h-full w-12 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["0%", "850%"] }}
            transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          />

          <h3 className="mb-1 line-clamp-2 text-3xl font-extrabold leading-[1.08] text-white transition-colors group-hover:text-orange-300 sm:text-[1.9rem]">
            {item?.name || "Restaurant"}
          </h3>

          <p className="mb-5 text-base text-gray-300">
            {item?.city || "Near you"}
          </p>

          <div className="mt-auto flex items-center justify-between">
            {/* rating */}
            <div className="flex items-center gap-1.5 text-base">
              <span className="text-yellow-400">{"\u2605"}</span>
              <span className="font-black text-white">
                {item?.rating || "4.5"}
              </span>
            </div>

            {/* theme */}
            <span className="rounded-full border border-orange-300/35 bg-orange-500/15 px-3.5 py-1.5 text-xs font-semibold text-orange-200">
              {item?.theme || "Restaurant"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
