const categories = [
  { name: "All", icon: "🍽️" },
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Biryani", icon: "🍛" },
  { name: "Chinese", icon: "🍜" },
  { name: "Fast Food", icon: "🌮" },
  { name: "Grill", icon: "🥩" },
  { name: "Drinks", icon: "🥤" },
  { name: "Offers", icon: "🔥" }
];

export default function Categories({ selected, onSelect }) {
  return (
    <section className="px-4 py-16 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black mb-12 text-center text-gray-900 tracking-tight">
          What are you craving today?
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name === "All" ? "" : cat.name)}
              className={`group flex items-center gap-3 px-6 py-4 rounded-3xl text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl border-2 backdrop-blur-sm hover:scale-105 hover:-translate-y-1 ${
                selected === cat.name || (!selected && cat.name === "All")
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-orange-500/40"
                  : "bg-white/80 text-gray-800 border-gray-200 hover:border-orange-400 hover:bg-orange-50/80 hover:text-orange-800"
              }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </span>
              <span className="tracking-wide">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
