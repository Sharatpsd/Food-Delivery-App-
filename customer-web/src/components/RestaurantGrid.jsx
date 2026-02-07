import RestaurantCard from "./RestaurantCard";

export default function RestaurantGrid({ list = [], loading }) {
  // 🔍 Debug (চাইলে পরে remove করবি)
  console.log("GRID LIST 👉", list);

  if (loading) {
    return (
      <div className="text-center text-gray-500">
        Loading restaurants...
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No restaurants found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {list.map((item) => (
        <RestaurantCard key={item.id} item={item} />
      ))}
    </div>
  );
}

