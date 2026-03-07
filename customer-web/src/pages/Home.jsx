import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bike, ChefHat, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RestaurantGrid from "../components/RestaurantGrid";
import { getRestaurants } from "../utils/api";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImageError, setHeroImageError] = useState(false);
  const navigate = useNavigate();
  const chefEmoji = "\u{1F468}\u200D\u{1F373}";
  const burgerEmoji = "\u{1F354}";

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await getRestaurants();
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden bg-[#111214]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,0.2),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(245,158,11,0.16),transparent_40%)]" />

        <div className="relative mx-auto grid min-h-[92vh] max-w-[1600px] items-center gap-4 px-8 py-10 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
            className="text-white"
          >
            <p className="mb-4 inline-flex rounded-full border border-orange-400/40 bg-orange-500/15 px-4 py-1 text-sm font-semibold tracking-wide text-orange-200">
              DHAKA FOOD DELIVERY
            </p>

            <h1 className="text-7xl font-black tracking-tight sm:text-8xl xl:text-[9.5rem]">
              <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.45)]">
                BITE
              </span>
            </h1>

            <h2 className="mt-3 text-5xl font-black leading-[1.04] sm:text-6xl xl:text-[4.9rem]">
            Explore Popular Restaurants in Dhaka
             
            </h2>

            <p className="mt-6 max-w-2xl text-2xl text-gray-300">
              Explore top-rated restaurants in Dhaka, discover delicious meals,
              and order instantly with fast delivery by Bite.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#restaurants"
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-2xl transition hover:bg-orange-600"
              >
                Explore Restaurants
                <ArrowRight className="h-5 w-5" />
              </a>

              <button
                type="button"
                onClick={() => navigate("/restaurant-owner")}
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-[#1b1f27]/20"
              >
                Join as Partner
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative mx-auto h-[560px] w-full max-w-[760px] sm:h-[700px]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-orange-300/25"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute inset-16 rounded-full border border-orange-300/20"
            />

            <motion.div
              animate={{
                y: [0, -20, 0],
                boxShadow: [
                  "0 12px 30px rgba(0,0,0,0.25)",
                  "0 22px 55px rgba(249,115,22,0.30)",
                  "0 12px 30px rgba(0,0,0,0.25)",
                ],
              }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-0 z-10 flex h-[560px] w-[500px] items-center justify-center overflow-visible rounded-none bg-transparent sm:h-[700px] sm:w-[620px]"
            >
              {!heroImageError ? (
                <img
                  src="/chef-hero.png"
                  alt="Bite chef hero"
                  className="h-[110%] w-[110%] object-contain drop-shadow-[0_24px_42px_rgba(0,0,0,0.55)]"
                  onError={() => setHeroImageError(true)}
                />
              ) : (
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [-3, 3, -3], scale: [1, 1.04, 1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <span className="absolute left-1/2 top-[56%] -z-10 h-52 w-52 -translate-x-1/2 rounded-full bg-black/40 blur-3xl sm:h-72 sm:w-72" />
                  <span className="absolute left-1/2 top-1/2 -z-10 h-60 w-60 -translate-x-1/2 rounded-full bg-orange-100/45 blur-[90px] sm:h-80 sm:w-80" />
                  <span className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 text-[230px] opacity-35 blur-md sm:text-[300px]">
                    {chefEmoji}
                  </span>
                  <span className="relative text-[230px] leading-none drop-shadow-[0_22px_32px_rgba(0,0,0,0.5)] sm:text-[300px]">
                    {chefEmoji}
                  </span>
                </motion.div>
              )}
            </motion.div>

        
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-0 z-20 flex items-center gap-3 rounded-2xl bg-[#1b1f27]/95 px-5 py-3 shadow-xl"
            >
              <span className="text-5xl">{burgerEmoji}</span>
              <div>
                <p className="text-base font-bold text-white">Best Delicious Food</p>
                <p className="text-sm text-gray-400">5000+ happy customers</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="restaurants" className="bg-[#111214] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <RestaurantGrid title="Popular Restaurants In Dhaka" list={restaurants} loading={loading} />
        </div>
      </section>

      <section className="bg-[#111214] py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-black text-white">Grow With Bite</h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300">
            Join Bite as a restaurant or rider and scale your business with real-time
            orders, smart operations, and fast payouts.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div whileHover={{ y: -8 }} className="rounded-3xl border border-white/10 bg-[#1b1d21] p-8 shadow-xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 text-white">
                <ChefHat className="h-10 w-10" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">Restaurant Owner</h3>
              <p className="mb-6 text-gray-300">Add menu, receive orders, and manage everything from one dashboard.</p>
              <button
                onClick={() => navigate("/restaurant-owner")}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Start Selling
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="rounded-3xl border border-white/10 bg-[#1b1d21] p-8 shadow-xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-600 text-white">
                <Bike className="h-10 w-10" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">Delivery Partner</h3>
              <p className="mb-6 text-gray-300">Work flexible hours, deliver quickly, and earn daily through Bite.</p>
              <button
                onClick={() => navigate("/delivery-partner")}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Join as Rider
                <Store className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}


