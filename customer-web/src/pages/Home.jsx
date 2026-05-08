import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bike, ChefHat, MessageCircle, Store, Star, Clock, Shield } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RestaurantGrid from "../components/RestaurantGrid";
import { getRestaurants } from "../utils/api";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImageError, setHeroImageError] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const globalQuery = searchParams.get("q") || "";
  const chefEmoji = "\u{1F468}\u200D\u{1F373}";
  const burgerEmoji = "\u{1F354}";
  const floatingFood = ["\u{1F354}", "\u{1F355}", "\u{1F35F}", "\u{1F964}", "\u{1F32E}", "\u{1F9C6}"];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await getRestaurants({ search: globalQuery });
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [globalQuery]);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[#0d0f12]">

        {/* ── BG LAYER 1: Animated breathing orbs ── */}
        <motion.div
          className="pointer-events-none absolute left-[-12%] top-[-12%] h-[650px] w-[650px] rounded-full bg-orange-500/14 blur-[130px]"
          animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-[-12%] right-[-8%] h-[550px] w-[550px] rounded-full bg-amber-400/12 blur-[110px]"
          animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="pointer-events-none absolute left-[38%] top-[25%] h-[380px] w-[380px] rounded-full bg-red-500/8 blur-[90px]"
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* extra accent — deep right */}
        <motion.div
          className="pointer-events-none absolute right-[5%] top-[10%] h-[300px] w-[300px] rounded-full bg-orange-600/8 blur-[80px]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />

        {/* ── BG LAYER 2: Animated dot grid ── */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* ── BG LAYER 3: Diagonal scanlines ── */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, #f97316 0px, #f97316 1px, transparent 1px, transparent 40px)",
          }}
        />

        {/* ── BG LAYER 4: Floating sparkle particles ── */}
        {[
          { x: "15%", y: "20%", size: 3, dur: 4.2, delay: 0 },
          { x: "80%", y: "15%", size: 2, dur: 3.8, delay: 0.7 },
          { x: "60%", y: "70%", size: 4, dur: 5.1, delay: 1.2 },
          { x: "25%", y: "75%", size: 2, dur: 3.5, delay: 0.4 },
          { x: "90%", y: "55%", size: 3, dur: 4.6, delay: 1.8 },
          { x: "45%", y: "12%", size: 2, dur: 3.2, delay: 0.9 },
          { x: "70%", y: "85%", size: 3, dur: 4.9, delay: 2.1 },
          { x: "8%",  y: "50%", size: 2, dur: 3.7, delay: 1.5 },
          { x: "55%", y: "45%", size: 2, dur: 5.3, delay: 0.3 },
          { x: "35%", y: "88%", size: 3, dur: 4.0, delay: 2.5 },
        ].map(({ x, y, size, dur, delay }, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute rounded-full bg-orange-400"
            style={{ left: x, top: y, width: size, height: size }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], y: [0, -18, 0] }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
          />
        ))}

        {/* ── BG LAYER 5: Horizontal light streak ── */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{ top: "48%", background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.25), transparent)" }}
          animate={{ opacity: [0, 0.6, 0], scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{ top: "52%", background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.15), transparent)" }}
          animate={{ opacity: [0, 0.4, 0], scaleX: [0.2, 0.8, 0.2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />

        <div className="relative mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-10 lg:py-0">

          {/* ── LEFT COPY ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white lg:pr-6"
          >
            {/* Badge */}
            <motion.p
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/35 bg-orange-500/12 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-300"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
              Dhaka's #1 Food Delivery
            </motion.p>

            {/* Brand name */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="text-[5.5rem] font-black leading-none tracking-tight sm:text-[7rem] xl:text-[9rem]"
              >
                <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(249,115,22,0.5)]">
                  BITE
                </span>
              </motion.h1>
            </div>

            {/* Sub-headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="mt-4 text-xl font-bold leading-snug text-white/90 sm:text-3xl xl:text-[2.5rem]"
            >
              Explore Popular Foods &amp; Top
              <br />
              <span className="text-orange-400">Restaurants in Dhaka</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base"
            >
              Discover top-rated restaurants, delicious meals, and lightning-fast delivery — all in one place.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-3 sm:gap-4"
            >
              <a
                href="#restaurants"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all hover:shadow-[0_0_45px_rgba(249,115,22,0.6)] hover:scale-[1.03] sm:px-7 sm:py-4 sm:text-base"
              >
                Explore Restaurants
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <button
                type="button"
                onClick={() => navigate("/restaurant-owner")}
                className="rounded-2xl border border-white/20 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/12 hover:border-white/35 sm:px-7 sm:py-4 sm:text-base"
              >
                Join as Partner
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="mt-10 flex flex-wrap gap-6 sm:gap-10"
            >
              {[
                { icon: <Star className="h-4 w-4 text-amber-400" />, value: "4.9★", label: "Avg Rating" },
                { icon: <Clock className="h-4 w-4 text-orange-400" />, value: "25 min", label: "Avg Delivery" },
                { icon: <Shield className="h-4 w-4 text-green-400" />, value: "5000+", label: "Happy Customers" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  {s.icon}
                  <div>
                    <p className="text-sm font-bold text-white">{s.value}</p>
                    <p className="text-[11px] text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: HERO IMAGE — clean floating card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[560px]"
          >
            {/* Ambient glow behind card */}
            <div className="pointer-events-none absolute inset-[-10%] rounded-3xl bg-orange-500/12 blur-3xl" />

            {/* Main floating image card */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(249,115,22,0.15)]"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, #2a1606, #110c03)",
              }}
            >
              <img
                src="/chef-hero.png"
                alt="Bite chef hero"
                className="w-full object-contain"
                onError={() => setHeroImageError(true)}
              />

              {/* Bottom gradient overlay */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0f12] to-transparent" />
            </motion.div>

            {/* Decorative corner glow dots */}
            <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-orange-500 opacity-70 blur-md" />
            <div className="absolute -bottom-3 -left-3 h-5 w-5 rounded-full bg-amber-400 opacity-50 blur-md" />

            {/* ─ Floating badge: ~25 min (top-left) ─ */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="absolute -left-4 -top-4 z-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#1a1d24]/95 px-3 py-2 shadow-xl backdrop-blur-md"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                <Clock className="h-3.5 w-3.5 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">~25 min</p>
                <p className="text-[10px] text-gray-400">Fast Delivery</p>
              </div>
            </motion.div>

            {/* ─ Floating badge: 4.9★ (top-right) ─ */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="absolute -right-4 -top-4 z-20 flex items-center gap-2 rounded-2xl border border-orange-400/25 bg-[#1a1d24]/95 px-3 py-2 shadow-xl backdrop-blur-md"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">4.9 / 5</p>
                <p className="text-[10px] text-gray-400">Top Rated</p>
              </div>
            </motion.div>

            {/* ─ Floating card: Best Food (bottom-left) ─ */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="absolute -bottom-4 -left-4 z-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#1a1d24]/95 px-3 py-2.5 shadow-2xl backdrop-blur-md"
            >
              <span className="text-2xl">{burgerEmoji}</span>
              <div>
                <p className="text-xs font-bold text-white">Best Delicious Food</p>
                <p className="text-[10px] text-gray-400">5000+ happy customers</p>
              </div>
            </motion.div>

            {/* Floating food emojis */}
            {[
              { emoji: "🍕", x: "92%", y: "25%", delay: 0, dur: 3.2 },
              { emoji: "🍔", x: "-6%", y: "55%", delay: 0.4, dur: 3.8 },
              { emoji: "🍟", x: "88%", y: "70%", delay: 0.8, dur: 2.9 },
              { emoji: "🧋", x: "50%", y: "-8%", delay: 0.3, dur: 4.1 },
            ].map(({ emoji, x, y, delay, dur }) => (
              <motion.span
                key={emoji}
                className="pointer-events-none absolute z-30 text-xl drop-shadow-lg"
                style={{ left: x, top: y }}
                animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── RESTAURANTS ─── */}
      <section id="restaurants" className="bg-[#0d0f12] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <RestaurantGrid
            title="Popular Restaurants In Dhaka"
            list={restaurants}
            loading={loading}
            initialSearch={globalQuery}
          />
        </div>
      </section>

      {/* ─── GROW WITH BITE ─── */}
      <section className="bg-[#0d0f12] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-14 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-3 inline-block rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-300"
            >
              Partner With Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-white sm:text-5xl"
            >
              Grow With Bite
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-4 max-w-2xl text-sm text-gray-400 sm:text-base"
            >
              Join Bite as a restaurant or rider and scale your business with real-time orders, smart operations, and fast payouts.
            </motion.p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Restaurant Owner card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="group relative overflow-hidden rounded-3xl border border-white/8 bg-[#161820] p-8 shadow-2xl"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange-500/10 blur-2xl transition-all group-hover:bg-orange-500/20" />
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30">
                <ChefHat className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Restaurant Owner</h3>
              <p className="mb-7 text-sm text-gray-400 leading-relaxed">Add your menu, receive live orders, and manage everything from a powerful single dashboard.</p>
              <button
                onClick={() => navigate("/restaurant-owner")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-orange-500/50 hover:scale-[1.03]"
              >
                Start Selling <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Delivery Partner card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-white/8 bg-[#161820] p-8 shadow-2xl"
              style={{ transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange-600/10 blur-2xl transition-all group-hover:bg-orange-600/20" />
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-red-500/25">
                <Bike className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Delivery Partner</h3>
              <p className="mb-7 text-sm text-gray-400 leading-relaxed">Work flexible hours, deliver quickly across Dhaka, and earn daily payouts through Bite.</p>
              <button
                onClick={() => navigate("/delivery-partner")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:shadow-red-500/45 hover:scale-[1.03]"
              >
                Join as Rider <Store className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHATSAPP FLOATING BUTTON ─── */}
      <a
        href="https://wa.me/8801783720914?text=Hello%20Bite%2C%20I%20need%20help."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group fixed bottom-6 right-5 z-[80] inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#25D366] px-5 py-3 font-bold text-white shadow-[0_0_25px_rgba(37,211,102,0.65)] transition hover:scale-105 hover:shadow-[0_0_40px_rgba(37,211,102,0.85)]"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-70 blur-md" />
        <span className="absolute inset-0 -z-20 animate-ping rounded-full bg-[#25D366]/40" />
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </>
  );
}