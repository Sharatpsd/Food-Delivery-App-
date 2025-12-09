// src/pages/About.jsx – Professional, Modern, Realistic Animations + Images Added
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { ChefHat, Bike, Clock, Users, Store, ArrowRight, MapPin } from "lucide-react";

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: 'ease-in-out-cubic' }); // More realistic easing
  }, []);

  return (
    <>
      {/* HERO SECTION – Added Parallax-like Image + Smoother Animations */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.img
          src="https://static.themoscowtimes.com/image/article_1360/9c/resizedArabiantable002.jpg?utm_source=chatgpt.com" // Added realistic Dhaka food delivery image
          alt="Food Delivery in Dhaka"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }} // Realistic zoom-in
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 80 }} // More realistic spring bounce
            className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFB74D, #FF8A65, #FF5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bite
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
            className="mt-4 text-2xl sm:text-3xl font-bold text-orange-100"
          >
            Bangladesh's Fastest Growing Food Delivery App
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-3 text-lg sm:text-xl text-orange-200 font-medium"
          >
            Hot & Fresh Food Delivered in Minutes
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-8 text-orange-100"
          >
            <div className="text-center" data-aos="fade-right" data-aos-delay="200">
              <div className="text-5xl font-black text-orange-400">Live Now</div>
              <p className="text-sm mt-1">Beta Running</p>
            </div>
            <div className="text-center" data-aos="fade-up" data-aos-delay="400">
              <div className="text-5xl font-black text-orange-400">0%</div>
              <p className="text-sm mt-1">Commission (Beta)</p>
            </div>
            <div className="text-center" data-aos="fade-left" data-aos-delay="600">
              <div className="text-5xl font-black text-orange-400">100+</div>
              <p className="text-sm mt-1">Partner Restaurants</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUR MISSION – Added Image + Fade Animations */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-8"
            data-aos="fade-up"
          >
            Food Delivery, <span className="text-orange-600">Reimagined for Bangladesh</span>
          </motion.h2>
          {/* <img
            src="https://pressxpress.org/wp-content/uploads/2023/07/food-delivery-revolution-in-Bangladesh-585x307.jpg" // Added realistic delivery scene image
            alt="Food Delivery Revolution in Bangladesh"
            className="w-full max-w-2xl mx-auto rounded-2xl shadow-xl mb-8"
            data-aos="zoom-in" data-aos-delay="200"
          /> */}
          <p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up" data-aos-delay="400"
          >
            Bite is proudly built in Bangladesh, by Bangladeshis — to solve real problems: 
            high commissions killing small restaurants, slow delivery, and complicated apps. 
            We’re here to change that with <strong>zero commission in beta</strong>, lightning-fast experience, 
            and a platform that works for customers, restaurants, and riders alike.
          </p>
        </div>
      </section>

      {/* CORE VALUES – More Hover Animations + Realistic Transitions */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Clock, title: "Blazing Fast", desc: "Real-time tracking & instant order updates" },
              { icon: Store, title: "Restaurant First", desc: "Zero commission in beta — keep 100% of your earnings" },
              { icon: Bike, title: "Rider Friendly", desc: "Fair pay, smart routing, and respect for delivery heroes" },
              { icon: Users, title: "Customer Obsessed", desc: "Beautiful UI, easy checkout, and reliable delivery" },
              { icon: ChefHat, title: "Local at Heart", desc: "Made in Bangladesh, for Bangladesh" },
              { icon: MapPin, title: "Growing Fast", desc: "Expanding to every major city soon" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} // Realistic hover lift
                transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeInOut' }}
                className="bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay={i * 150}
              >
                <item.icon className="w-16 h-16 mx-auto text-orange-600 mb-5" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPER SECTION – Added Realistic Team Image + Smooth Fade */}
      <section className="py-24 bg-gradient-to-br from-orange-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 
            className="text-4xl md:text-5xl font-black mb-6"
            data-aos="fade-down"
          >
            Built with Love in Bangladesh
          </h2>
          <p 
            className="text-xl opacity-90 mb-10"
            data-aos="fade-up" data-aos-delay="200"
          >
            A solo passion project that’s becoming the future of food delivery
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 inline-block"
            data-aos="zoom-in" data-aos-delay="400"
          >
           
            <h3 className="text-3xl font-bold mb-2">Sharat Acharja Mugdho</h3>
            <p className="text-orange-200 text-lg mb-6">Full-Stack Developer & Founder</p>
            
            <p className="text-lg max-w-2xl mx-auto opacity-90 mb-8">
              Turning ideas into reality with code. Building Bite to empower local restaurants 
              and bring joy through faster, fairer food delivery across Bangladesh.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a
                href="mailto:sharatacharjee6@gmail.com"
                className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold hover:scale-105 transition"
              >
                Email Me
              </a>
              <a
                href="https://mugdho-portfolio.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-orange-600 transition"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/Sharatpsd"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-orange-600 transition"
              >
                GitHub @Sharatpsd
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA – Added Smooth Button Animation */}
      <section className="py-28 bg-black text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 
            className="text-5xl md:text-7xl font-black mb-6"
            data-aos="fade-up"
          >
            Ready to Join the Food Revolution?
          </h2>
          <p 
            className="text-2xl text-orange-300 mb-12"
            data-aos="fade-up" data-aos-delay="200"
          >
            Live Demo Available Now
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.a
              href="https://food-delivery-frontend-mktt.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 2 }} // Realistic hover tilt
              transition={{ duration: 0.3 }}
              className="bg-orange-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:bg-orange-700 transition flex items-center gap-3"
              data-aos="fade-right" data-aos-delay="400"
            >
              Try Bite Live <ArrowRight className="w-8 h-8" />
            </motion.a>
            <motion.a
              href="https://github.com/Sharatpsd/Food-Delivery-App-.git"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: -2 }}
              transition={{ duration: 0.3 }}
              className="border-4 border-orange-600 text-orange-400 px-12 py-6 rounded-full text-2xl font-bold hover:bg-orange-600 hover:text-white transition"
              data-aos="fade-left" data-aos-delay="600"
            >
              Star on GitHub
            </motion.a>
          </div>

          <p className="mt-12 text-orange-200 text-lg" data-aos="fade-up" data-aos-delay="800">
            Built by <strong>Sharat Acharja Mugdho</strong> • Launching Nationwide 2025
          </p>
        </div>
      </section>
    </>
  );
}