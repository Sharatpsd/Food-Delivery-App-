import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  buildImageSources,
  getImageFromSources,
  getLocalRestaurantFallback,
} from "../utils/image";

export default function RestaurantCard({ item }) {
  const imageSources = buildImageSources(
    [item?.logo_url, item?.logo_final, item?.logo],
    getLocalRestaurantFallback(item?.name, item?.id)
  );

  const deliveryTime =
    item?.delivery_time_estimate || Math.floor(Math.random() * 20) + 20;

  return (
    <Link to={`/restaurant/${item.id}`}>
      <article className="group h-full cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#1c2029] to-[#141820] shadow-[0_16px_38px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-400/70 hover:shadow-[0_24px_50px_rgba(249,115,22,0.2)]">
        <div className="relative h-46 w-full overflow-hidden sm:h-48">
          <img
            src={getImageFromSources(imageSources)}
            alt={item?.name || "Restaurant"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const currentIndex = Number(e.currentTarget.dataset.idx || 0);
              const nextSrc = imageSources[currentIndex + 1];
              if (!nextSrc) return;
              e.currentTarget.dataset.idx = String(currentIndex + 1);
              e.currentTarget.src = nextSrc;
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />

          <motion.div
            className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {deliveryTime} min
          </motion.div>
        </div>

        <div className="relative flex min-h-[138px] flex-col p-5">
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 top-0 h-full w-12 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["0%", "850%"] }}
            transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          />

          <h3 className="mb-1 line-clamp-2 text-xl font-extrabold leading-tight text-white transition-colors group-hover:text-orange-300 sm:text-2xl">
            {item?.name || "Restaurant"}
          </h3>

          <p className="mb-4 text-sm text-gray-300">
            {item?.city || "Near you"}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-400">{"\u2605"}</span>
              <span className="font-black text-white">
                {item?.rating || "4.5"}
              </span>
            </div>

            <span className="rounded-full border border-orange-300/35 bg-orange-500/15 px-3 py-1 text-[11px] font-semibold text-orange-200">
              {item?.theme || "Restaurant"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
