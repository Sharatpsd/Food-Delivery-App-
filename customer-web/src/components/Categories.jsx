const categories = [
  { name: "All", icon: "🍽️" },
  { name: "Search", icon: "🔍" },
  { name: "Offers", icon: "🔥" },
  { name: "Burger", icon: "🍔" },
  { name: "Pizza", icon: "🍕" },
  { name: "Biryani", icon: "🍛" },
  { name: "Drinks", icon: "🥤" },
];

export default function Categories({ selected, onSelect }) {
  return (
    <section className="px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          What are you craving today?
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name === "All" ? "" : cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                selected === cat.name
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30 scale-105"
                  : "bg-white border border-gray-200 text-gray-800 hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
