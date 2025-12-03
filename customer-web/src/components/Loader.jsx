export default function Loader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-200 h-64 rounded-xl" />
      ))}
    </div>
  );
}
