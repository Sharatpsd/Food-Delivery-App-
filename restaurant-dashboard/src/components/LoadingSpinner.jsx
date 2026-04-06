export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin">
          <div className="border-4 border-gray-300 border-t-orange-600 rounded-full h-12 w-12"></div>
        </div>
        <p className="mt-4 text-gray-600 font-semibold">Loading orders...</p>
      </div>
    </div>
  );
}
