import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown, ChefHat, Bike, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    navigate(`/?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111214]/80 backdrop-blur-2xl">
      <nav className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link to="/" className="group flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30" />
            <h1 className="text-3xl font-black tracking-tight text-white transition group-hover:text-orange-300">
              B<span className="text-orange-500">ite</span>
            </h1>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="group relative">
              <button className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white">
                Partner
                <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
              </button>

              <div className="invisible absolute right-0 top-full mt-3 w-72 translate-y-2 rounded-2xl border border-white/10 bg-[#1a1c20]/95 p-2 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  to="/restaurant-owner"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-200 transition hover:bg-white/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-300">
                    <ChefHat className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Restaurant Owner</p>
                    <p className="text-xs text-gray-400">Add menu & receive orders</p>
                  </div>
                </Link>

                <Link
                  to="/delivery-partner"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-200 transition hover:bg-white/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-300">
                    <Bike className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Delivery Partner</p>
                    <p className="text-xs text-gray-400">Earn by delivering</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
              <div className="relative w-[170px] xl:w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder-gray-400 transition focus:border-orange-400"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transition hover:scale-[1.03]"
                aria-label="Search"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            <button
              onClick={handleCartClick}
              className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-200 transition hover:bg-white/10"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.03]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 py-4 lg:hidden">
            <div className="space-y-2">
              <form onSubmit={handleSearchSubmit} className="mb-2">
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search food or restaurant..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-400 transition focus:border-orange-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-bold text-white"
                >
                  Search
                </button>
              </form>

              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`block rounded-xl px-4 py-3 text-base font-semibold transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <Link
                to="/restaurant-owner"
                onClick={closeMobileMenu}
                className="block rounded-xl px-4 py-3 font-semibold text-orange-300 hover:bg-white/5"
              >
                Join as Restaurant Owner
              </Link>
              <Link
                to="/delivery-partner"
                onClick={closeMobileMenu}
                className="block rounded-xl px-4 py-3 font-semibold text-orange-300 hover:bg-white/5"
              >
                Join as Delivery Partner
              </Link>

              <button
                onClick={() => {
                  closeMobileMenu();
                  handleCartClick();
                }}
                className="w-full rounded-xl px-4 py-3 text-left font-semibold text-gray-200 hover:bg-white/5"
              >
                Cart ({cartCount})
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="col-span-2 rounded-xl bg-red-500/10 px-4 py-3 font-semibold text-red-300"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="rounded-xl bg-white/5 px-4 py-3 text-center font-semibold text-gray-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 text-center font-bold text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


