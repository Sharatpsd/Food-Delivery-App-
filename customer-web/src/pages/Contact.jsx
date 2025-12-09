// src/pages/Contact.jsx → ULTRA MODERN + MOBILE-FIRST + BEAUTIFUL ANIMATIONS + FULLY RESPONSIVE
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">

      {/* HERO – সুন্দর গ্রেডিয়েন্ট + অ্যানিমেশন */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20" />
        </motion.div>

        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 80 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 leading-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            We reply <span className="text-orange-600 font-bold">within minutes</span>
          </p>
        </motion.div>
      </section>

      {/* CONTACT CARDS – প্রো হোভার + মোবাইলে সুন্দর */}
      <section className="py-16 px-6 md:py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Phone,
              title: "Call / WhatsApp",
              info: "01783-720914",
              color: "from-green-500 to-emerald-600",
              link: "tel:01783720914"
            },
            {
              icon: Mail,
              title: "Email Us",
              info: "sharatacharjee6@gmail.com",
              color: "from-blue-500 to-indigo-600",
              link: "mailto:sharatacharjee6@gmail.com"
            },
            {
              icon: MapPin,
              title: "Location",
              info: "Dhaka, Bangladesh",
              color: "from-purple-500 to-pink-600",
              link: null
            },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.link || undefined}
              target={item.link?.includes("mailto") ? "_blank" : undefined}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -12, scale: 1.05 }}
              className={`block bg-white rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group ${item.link ? "cursor-pointer" : ""}`}
              data-aos="fade-up"
              data-aos-delay={i * 150}
            >
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${item.color} p-5 mb-6 shadow-lg group-hover:scale-110 transition`}>
                <item.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-lg text-gray-600 break-all font-medium">{item.info}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* CONTACT FORM – সুপার মডার্ন + ফোকাস অ্যানিমেশন */}
      <section className="py-20 px-6 md:py-28">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
            data-aos="fade-up"
          >
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white flex items-center justify-center gap-3">
                <MessageCircle className="w-10 h-10" />
                Send us a Message
              </h2>
              <p className="text-orange-100 mt-2 text-lg">We'll reply faster than your food arrives!</p>
            </div>

            <form
              action="https://formspree.io/f/xblrjwpz"
              method="POST"
              className="p-8 md:p-12 space-y-7"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  required
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all duration-300"
                />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  required
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all duration-300"
                />
              </div>

              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="tel"
                name="phone"
                placeholder="Phone Number (Optional)"
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all duration-300"
              />

              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                name="message"
                rows="6"
                placeholder="How can we help you today? 😊"
                required
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg resize-none transition-all duration-300"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black text-xl py-6 rounded-2xl shadow-xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Send Message
                <Send className="w-6 h-6" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FINAL TOUCH – ছোট ফুটার */}
      <footer className="py-12 bg-gray-900 text-white text-center">
        <p className="text-sm md:text-base">
          © 2025 <span className="text-orange-400 font-bold">Bite</span> • Made with love by Sharat Acharja Mugdho
        </p>
      </footer>
    </div>
  );
}