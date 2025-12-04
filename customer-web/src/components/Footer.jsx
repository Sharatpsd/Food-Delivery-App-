// src/components/Footer.jsx
import { Mail, Phone, Github, ExternalLink, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-300 mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div className="space-y-6">
            <h2 
              className="text-4xl font-black tracking-tighter"
              style={{
                background: "linear-gradient(135deg, #FFB74D, #FF8A65, #FF7043)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Bite
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              Bangladesh's next-generation food delivery app — fast, fair, and built with love.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span>Launching 2026</span>
            </div>
          </div>

          {/* Developer Section */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Developer
            </h3>
            <p className="text-lg font-medium text-orange-400">Sharat Acharja Mugdho</p>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:sharatacharjee6@gmail.com"
                className="flex items-center gap-3 hover:text-orange-400 transition group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition" />
                <span>sharatacharjee6@gmail.com</span>
              </a>
              <a
                href="tel:+8801783720914"
                className="flex items-center gap-3 hover:text-orange-400 transition group"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition" />
                <span>01783-720914</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="/" className="hover:text-orange-400 transition flex items-center gap-2">
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-orange-400 transition flex items-center gap-2">
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-400 transition flex items-center gap-2">
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <a href="/partner" className="hover:text-orange-400 transition flex items-center gap-2">
                  <span>Become a Partner</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Portfolio */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex flex-col gap-5">
              <a
                href="https://github.com/Sharatpsd"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 text-lg font-medium hover:text-orange-400 transition group"
              >
                <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-orange-600 transition">
                  <Github className="w-6 h-6" />
                </div>
                <span>GitHub</span>
                <ExternalLink className="w-4 h-4 opacity-60" />
              </a>
              <a
                href="https://mugdho-portfolio.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 text-lg font-medium hover:text-orange-400 transition group"
              >
                <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-orange-600 transition">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span>Portfolio</span>
                <ExternalLink className="w-4 h-4 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p className="flex items-center gap-2">
            © {currentYear} <span className="text-orange-500 font-bold">Bite</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            Made with 
            <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
            by <span className="text-orange-400 font-medium">Sharat Acharja Mugdho</span>
          </p>
        </div>
      </div>
    </footer>
  );
}