import { Mail, Phone, Github, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Bite
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Bangladesh's fastest food delivery platform
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Coming 2026</span>
            </div>
          </div>

          {/* Developer */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wide flex items-center gap-2">
              Developer
            </h3>
            <p className="text-lg font-semibold text-orange-400 mb-4">Sharat Acharja Mugdho</p>
            <div className="space-y-3 text-sm">
              <a href="mailto:sharatacharjee6@gmail.com" className="flex items-center gap-3 hover:text-orange-400 transition">
                <Mail className="w-4 h-4" />
                sharatacharjee6@gmail.com
              </a>
              <a href="tel:+8801783720914" className="flex items-center gap-3 hover:text-orange-400 transition">
                <Phone className="w-4 h-4" />
                01783-720914
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {["Home", "About", "Contact", "Partner"].map((item) => (
                <li key={item}>
                  <a href={`/${item.toLowerCase()}`} className="flex items-center gap-2 hover:text-orange-400 transition py-1">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Connect</h3>
            <div className="space-y-4">
              <a href="https://github.com/Sharatpsd" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-orange-400 transition group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-orange-600 transition">
                  <Github className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">GitHub</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a href="https://mugdho-portfolio.netlify.app/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-orange-400 transition group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-orange-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Portfolio</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500">
          <p>
            © {currentYear} Bite. All rights reserved. Made with 
            <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1 inline animate-pulse" /> 
            by Sharat Acharja Mugdho
          </p>
        </div>
      </div>
    </footer>
  );
}
