export default function RestaurantCard({ item }) {
  const imgUrl = item.logo
    ? item.logo.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_500,h_300,ar_4:3,c_fill/"
      )
    : "https://via.placeholder.com/500x300/FF6B6B/F8F9FA?text=Restaurant";

  return (
    <article className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="h-48 w-full overflow-hidden relative">
        <img
          src={imgUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
          25 min
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {item.city || "Near you"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold text-gray-900">
              {item.rating || "4.5"}
            </span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-pink-50 text-pink-700 font-medium">
            {item.theme || "Restaurant"}
          </span>
        </div>
      </div>
    </article>
  );
}
