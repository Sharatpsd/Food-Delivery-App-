// src/pages/Partner.jsx – ULTRA COMPACT + MOBILE-FIRST + CLEAN VERSION
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { ChefHat, Bike, Users, ArrowRight, CheckCircle, Phone, Mail } from "lucide-react";

export default function Partner() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  return (
    <>
      {/* HERO – Compact */}
      <section className="relative py-20 bg-gradient-to-br from-orange-600 to-red-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80"
          alt="Partner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-orange-200 to-yellow-100 bg-clip-text text-transparent"
          >
            Partner with Bite
          </motion.h1>
          <p className="mt-3 text-lg md:text-2xl font-medium text-orange-100">
            Grow Your Restaurant Faster
          </p>
        </div>
      </section>

      {/* WHY PARTNER – 3 Cards Compact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
            Why Partner with Bite?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "More Orders", desc: "Reach thousands daily", icon: Users },
              { title: "Zero Risk", desc: "No fee • Launch in 24h", icon: CheckCircle },
              { title: "Best Earnings", desc: "Top commission in BD", icon: Bike },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <item.icon className="w-12 h-12 mx-auto text-orange-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM – Super Compact & Fast */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
              Register Your Restaurant
            </h2>
            <p className="text-center text-gray-600 text-sm mb-8">
              We'll call you within 2 hours
            </p>

            <form
              action="https://formspree.io/f/xblrjwpz"
              method="POST"
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="restaurant_name"
                  placeholder="Restaurant Name *"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                />
                <input
                  type="text"
                  name="owner_name"
                  placeholder="Your Name *"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Area/City *"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                />
              </div>

              <textarea
                name="message"
                rows="3"
                placeholder="Cuisine / Special dishes (optional)"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm resize-none"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-base"
              >
                Submit Application <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">Or contact directly:</p>
              <div className="flex justify-center gap-6 mt-3">
                <a href="tel:01783720914" className="flex items-center gap-2 text-orange-600 font-semibold hover:underline">
                  <Phone className="w-4 h-4" /> 01783-720914
                </a>
                <a href="mailto:sharatacharjee6@gmail.com" className="flex items-center gap-2 text-orange-600 font-semibold hover:underline">
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA – Compact */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-700 text-white text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-4">Ready to Grow?</h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Join Bangladesh’s fastest-growing platform
        </p>
        <button className="bg-white text-orange-600 px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition shadow-xl">
          Start Earning Today
        </button>
      </section>
    </>
  );
}  