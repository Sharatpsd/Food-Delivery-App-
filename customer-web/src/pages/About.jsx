// src/pages/About.jsx – 100% WORKING & REALISTIC (Demo Ready)
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { ChefHat, Bike, Clock, Star, Users, ArrowRight, MapPin, Sparkles } from "lucide-react";

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1920&q=80"
          alt="Fresh food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />

        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          <motion.h1
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="text-8xl md:text-9xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFB74D, #FF8A65)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 15px 40px rgba(0,0,0,0.7))"
            }}
          >
            About Bite
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-3xl md:text-5xl font-light text-orange-100"
          >
            Coming Soon to Bangladesh
          </motion.p>

          {/* Realistic Stats */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              { number: "150+", label: "Restaurants in Beta" },
              { number: "5", label: "Cities Testing" },
              { number: "2025", label: "Nationwide Launch" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-7xl md:text-8xl font-black text-orange-300">
                  {stat.number}
                </div>
                <p className="text-xl md:text-2xl mt-4 text-orange-100 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OUR VISION – With WORKING Team Image */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div data-aos="fade-right">
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
              Food Delivery,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                Done Right
              </span>
            </h2>
            <p className="mt-10 text-xl text-gray-700 leading-relaxed">
              We’re a small passionate team from Bangladesh building <strong>Bite</strong> — the food delivery app we always wished existed.
            </p>
            <p className="mt-6 text-lg text-gray-600">
              Fast. Fair. Local. That’s our promise.
            </p>

            <div className="mt-16 grid grid-cols-2 gap-10">
              <div className="text-center bg-orange-50 rounded-3xl p-10 border-2 border-orange-200">
                <Bike className="w-20 h-20 mx-auto text-orange-600 mb-4" />
                <div className="text-5xl font-black text-orange-600">Target</div>
                <p className="text-gray-700 font-medium mt-2">&lt; 30 min delivery</p>
              </div>
              <div className="text-center bg-yellow-50 rounded-3xl p-10 border-2 border-yellow-200">
                <Star className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
                <div className="text-5xl font-black text-orange-600">Goal</div>
                <p className="text-gray-700 font-medium mt-2">5.0 Experience</p>
              </div>
            </div>
          </div>

          {/* THIS IMAGE WORKS 100% – Fast & Professional */}
          <div data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&fit=crop"
              alt="Bite team working together"
              className="rounded-3xl shadow-3xl hover:scale-105 transition-all duration-700 border-12 border-white object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* WHY BITE – Realistic & Honest */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-6xl font-black mb-20 text-gray-900" data-aos="fade-up">
            Why Bite Will Be Different
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Clock, title: "Real Speed", desc: "Live tracking from kitchen to door", color: "from-orange-400 to-red-500" },
              { icon: Users, title: "Rider First", desc: "Better pay & support for delivery heroes", color: "from-emerald-400 to-teal-500" },
              { icon: ChefHat, title: "Local Focus", desc: "Zero commission for small restaurants in beta", color: "from-purple-400 to-pink-500" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -15 }}
                className="group relative"
                data-aos="zoom-in"
                data-aos-delay={i * 150}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} blur-3xl opacity-30 group-hover:opacity-60 transition`} />
                <div className="relative bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                  <div className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <item.icon className="w-14 h-14 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-lg text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-gradient-to-r from-orange-600 to-red-700 text-white">
        <div className="text-center px-6 max-w-6xl mx-auto">
          <motion.h2
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            className="text-7xl md:text-9xl font-black mb-10"
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFB74D, #FF8A65)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Be the First to Bite
          </motion.h2>
          <p className="text-3xl mb-16 opacity-90">
            Launching 2026 – Join the waitlist
          </p>
          <a
            href="#"
            className="bg-white text-orange-600 px-28 py-12 rounded-full text-4xl font-black 
                     hover:scale-110 transition-all duration-500 shadow-3xl inline-flex items-center gap-6"
          >
            Join Waitlist Now <Sparkles className="w-12 h-12" />
          </a>
        </div>
      </section>
    </>
  );
}