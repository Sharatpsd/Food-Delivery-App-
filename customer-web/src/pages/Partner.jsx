// src/pages/Partner.jsx – PREMIUM & WORKING
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { ChefHat, Bike, Users, ArrowRight, CheckCircle, Phone, Mail } from "lucide-react";

export default function Partner() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <>
      {/* HERO – Premium Partner Header */}
      <section className="relative py-40 overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-orange-700">
        <div className="absolute inset-0 bg-black/50" />
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80"
          alt="Restaurant partnership"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 text-center text-white px-6">
          <motion.h1
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-7xl md:text-9xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFB74D, #FF8A65)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.7))"
            }}
          >
            Partner with Bite
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-3xl md:text-5xl font-light text-orange-100"
          >
            Grow Your Restaurant Faster
          </motion.p>
        </div>
      </section>

      {/* WHY PARTNER – Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-gray-900" data-aos="fade-up">
            Why Thousands Choose Bite
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "More Orders", desc: "Reach thousands of new customers daily", icon: Users },
              { title: "Zero Risk", desc: "No setup fee • Launch in 24 hours", icon: CheckCircle },
              { title: "Highest Earnings", desc: "Best commission rates in Bangladesh", icon: Bike }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -15, scale: 1.05 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 border-2 border-orange-200 hover:shadow-3xl transition-all duration-500"
                data-aos="fade-up"
                data-aos-delay={i * 200}
              >
                <item.icon className="w-20 h-20 mx-auto text-orange-600 mb-6" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-lg text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER FORM – Sends to YOUR EMAIL */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-3xl p-12 border border-gray-200">
            <h2 className="text-5xl font-black text-center mb-4 text-gray-900">
              Register Your Restaurant
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              We’ll contact you within 2 hours
            </p>

            {/* Formspree Form – 100% WORKING (Emails to sharatacharjee6@gmail.com) */}
            <form
              action="https://formspree.io/f/xblrjwpz"
              method="POST"
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <input
                  type="text"
                  name="restaurant_name"
                  placeholder="Restaurant Name *"
                  required
                  className="w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition"
                />
                <input
                  type="text"
                  name="owner_name"
                  placeholder="Your Name *"
                  required
                  className="w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  required
                  className="w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Area/City (e.g. Gulshan, Dhaka)"
                  required
                  className="w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition"
                />
              </div>

              <textarea
                name="message"
                rows="5"
                placeholder="Tell us about your restaurant (cuisine, special dishes, etc.)"
                className="w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg resize-none transition"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 
                         text-white font-black text-2xl py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/50 
                         hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4"
              >
                Submit Application <ArrowRight className="w-8 h-8" />
              </button>
            </form>

            <div className="mt-10 text-center text-gray-600">
              <p className="text-lg">
                Or contact us directly:
              </p>
              <div className="flex justify-center gap-8 mt-6">
                <a href="tel:01783720914" className="flex items-center gap-3 text-orange-600 font-bold text-lg hover:scale-110 transition">
                  <Phone className="w-6 h-6" /> 01783-720914
                </a>
                <a href="mailto:sharatacharjee6@gmail.com" className="flex items-center gap-3 text-orange-600 font-bold text-lg hover:scale-110 transition">
                  <Mail className="w-6 h-6" /> Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-r from-orange-600 to-red-700 text-white text-center">
        <h2 className="text-6xl md:text-8xl font-black mb-8">
          Ready to Grow?
        </h2>
        <p className="text-3xl mb-12 opacity-90">
          Join Bite — Bangladesh’s fastest-growing food delivery platform
        </p>
        <button className="bg-white text-orange-600 px-24 py-10 rounded-full text-4xl font-black 
                         hover:scale-110 transition-all duration-500 shadow-3xl">
          Start Earning Today
        </button>
      </section>
    </>
  );
}