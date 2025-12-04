// src/pages/Contact.jsx
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { 
  Mail, Phone, MapPin, Send, Clock, Shield, MessageCircle 
} from "lucide-react";

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      {/* PREMIUM HERO */}
      <section className="relative py-40 bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <img
          src="https://images.unsplash.com/photo-1556742111-a22f18684f52?w=1920&q=80"
          alt="Contact us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center text-white px-6">
          <motion.h1
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-8xl md:text-9xl font-black"
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFB74D, #FF8A65)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 15px 40px rgba(0,0,0,0.6))"
            }}
          >
            Contact Bite
          </motion.h1>
          <p className="mt-6 text-3xl md:text-5xl font-light text-orange-100">
            We reply in minutes
          </p>
        </div>
      </section>

      {/* YOUR CONTACT CARDS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { icon: Phone, title: "Call / WhatsApp", info: "01783-720914", color: "from-green-400 to-emerald-500" },
            { icon: Mail, title: "Email Us", info: "sharatacharjee6@gmail.com", color: "from-orange-400 to-red-500" },
            { icon: MapPin, title: "Location", info: "Dhaka, Bangladesh", color: "from-purple-400 to-pink-500" }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -20, scale: 1.05 }}
              className="group relative"
              data-aos="fade-up"
              data-aos-delay={i * 200}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} blur-3xl opacity-40 group-hover:opacity-70 transition`} />
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 text-center">
                <div className={`w-24 h-24 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                  <item.icon className="w-14 h-14 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-xl font-semibold text-gray-700 break-all">{item.info}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEND MESSAGE FORM → GOES DIRECTLY TO YOUR GMAIL */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16 text-gray-900" data-aos="fade-up">
            Send Message – We Reply Fast!
          </h2>

          {/* Formspree Form – 100% working, no backend needed */}
          <form
            action="https://formspree.io/f/xblrjwpz"
            method="POST"
            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 shadow-2xl border border-orange-200"
            data-aos="fade-up"
          >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="px-8 py-6 rounded-2xl border-2 border-orange-200 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="px-8 py-6 rounded-2xl border-2 border-orange-200 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition"
              />
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Your Phone (optional)"
              className="w-full px-8 py-6 rounded-2xl border-2 border-orange-200 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition mb-8"
            />
            <textarea
              name="message"
              rows="7"
              placeholder="Write your message here..."
              required
              className="w-full px-8 py-6 rounded-2xl border-2 border-orange-200 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none text-lg resize-none transition mb-8"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 
                       text-white font-black text-2xl py-7 rounded-2xl shadow-2xl hover:shadow-orange-500/50 
                       hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4"
            >
              Send Message Now <Send className="w-8 h-8" />
            </button>
            <p className="text-center mt-6 text-gray-600 text-lg">
              We reply within 5–10 minutes on WhatsApp/Email
            </p>
          </form>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-r from-orange-600 to-red-700 text-white text-center">
        <h2 className="text-6xl md:text-8xl font-black mb-8">Need Help Now?</h2>
        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <a
            href="tel:01783720914"
            className="bg-white text-orange-600 px-20 py-8 rounded-full text-3xl font-bold hover:scale-110 transition flex items-center gap-4 justify-center"
          >
            <Phone className="w-10 h-10" /> Call 01783-720914
          </a>
          <a
            href="mailto:sharatacharjee6@gmail.com"
            className="border-4 border-white px-20 py-8 rounded-full text-3xl font-bold hover:bg-white hover:text-orange-600 transition flex items-center gap-4 justify-center"
          >
            <Mail className="w-10 h-10" /> Email Us
          </a>
        </div>
      </section>
    </>
  );
}