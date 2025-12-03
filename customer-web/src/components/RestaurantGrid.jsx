import RestaurantCard from "./RestaurantCard";

export default function RestaurantGrid({ title, list, loading }) {
  const safeList = Array.isArray(list) ? list : [];

  if (loading) {
    return (
      <section className="px-4 py-16 max-w-6xl mx-auto">
        {/* shimmer cards */}
      </section>
    );
  }

  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
        {title}
      </h2>

      {safeList.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-600">No restaurants found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeList.map((item) => (
            <RestaurantCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
