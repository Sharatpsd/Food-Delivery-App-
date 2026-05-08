import { Link, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";

const navItems = [
  { label: "Overview", path: "/", icon: "\u{1F37D}\uFE0F" },
  { label: "Orders", path: "/orders", icon: "\u{1F4E6}" },
  { label: "Menu", path: "/foods", icon: "\u{1F355}" },
];

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/orders")) return "Orders Control Room";
  if (pathname.startsWith("/foods")) return "Menu Studio";
  return "Restaurant Command Center";
};

export default function AppShell({ children }) {
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d12] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_26%),radial-gradient(circle_at_85%_14%,rgba(234,88,12,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_26%)]" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#11141b]/95 px-6 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:flex lg:flex-col">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300/85">
            Bite Partner
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
            Restaurant
            <span className="block bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Track orders, monitor your menu, and keep service flowing without
            leaving one polished workspace.
          </p>
        </div>

        <nav className="mt-10 space-y-3">
          {navItems.map((item) => {
            const active =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_16px_35px_rgba(249,115,22,0.34)]"
                    : "border border-white/5 bg-white/[0.03] text-slate-300 hover:border-orange-400/20 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-white/70">
                    {item.path === "/"
                      ? "Snapshot & insights"
                      : item.path === "/orders"
                      ? "Live operational queue"
                      : "Catalog and pricing"}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-orange-400/20 bg-orange-500/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
            Focus
          </p>
          <p className="mt-3 text-sm leading-6 text-orange-50/90">
            Keep the dashboard open during peak hours for a calmer kitchen flow
            and faster order decisions.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="relative lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1218]/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300/80 lg:hidden">
                Bite Partner
              </p>
              <h2 className="text-lg font-bold text-white sm:text-2xl">
                {getPageTitle(location.pathname)}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:block">
                Premium workspace
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.25)] transition hover:from-orange-400 hover:to-orange-500 lg:hidden"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 pb-4 sm:px-6 lg:hidden lg:px-8">
            {navItems.map((item) => {
              const active =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-orange-500 text-white"
                      : "border border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
