export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 py-28 flex flex-col items-center text-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="text-white/80 text-xs tracking-[4px] uppercase mb-4 font-semibold">
          Lightning fast delivery
        </p>

        <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
          Get Food{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Delivered
          </span>
        </h1>

        <p className="text-white/90 text-lg sm:text-xl mb-10 leading-relaxed">
          Order from 5000+ restaurants. Fresh meals at your doorstep in 30 minutes.
        </p>

        <div className="max-w-xl mx-auto">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              📍
            </span>
            <input
              type="text"
              placeholder="Enter your location or restaurant name"
              className="w-full rounded-2xl py-4 pl-11 pr-4 shadow-2xl outline-none border-0 bg-white/95 text-gray-800 font-medium text-base focus:ring-4 focus:ring-white/50 transition"
            />
          </div>
          <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-[2px] transition-all">
            Find Food Now
          </button>
        </div>
      </div>
    </section>
  );
}
