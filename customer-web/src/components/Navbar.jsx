// src/components/Navbar.jsx
import { useState } from "react";
import { Search, MapPin } from "lucide-react";

const mainLinks = ["Home", "Search", "Offers", "Become a Partner", "Help"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 lg:px-0 h-16 flex items-center justify-between">
        {/* logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-2xl font-extrabold text-pink-600 tracking-tight">
            FoodDash
          </span>
        </div>

        {/* center links – desktop */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-800">
          {mainLinks.map((item) => (
            <li
              key={item}
              className="cursor-pointer hover:text-pink-600 transition-colors"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* right side actions – desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition">
            <MapPin size={18} />
            <span>Choose location</span>
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-300 hover:border-pink-500 hover:text-pink-600 transition">
            <Search size={18} />
          </button>
        </div>

        {/* mobile menu button */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-gray-300"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="block w-4 h-[2px] bg-gray-800 relative">
            <span className="absolute -top-1.5 left-0 w-4 h-[2px] bg-gray-800" />
            <span className="absolute top-1.5 left-0 w-4 h-[2px] bg-gray-800" />
          </span>
        </button>
      </nav>

      {/* mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <ul className="px-4 py-3 space-y-2 text-sm font-semibold text-gray-800">
            {mainLinks.map((item) => (
              <li
                key={item}
                className="py-1 cursor-pointer hover:text-pink-600 transition-colors"
              >
                {item}
              </li>
            ))}
            <li className="pt-2">
              <button className="w-full inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition">
                <MapPin size={18} />
                <span>Choose location</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
