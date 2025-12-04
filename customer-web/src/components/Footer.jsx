export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* left */}
        <div className="md:w-1/3 text-left">
          <h2 className="text-lg font-semibold text-white">Bite</h2>
          <p className="mt-3 text-sm opacity-80">
            Premium food delivery experience with fast, reliable service and a modern interface.
          </p>
          <p className="mt-4 text-xs opacity-60">
            © {new Date().getFullYear()} Bite. All rights reserved.
          </p>
        </div>

        {/* middle */}
        <div className="md:w-1/3 text-center">
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
            Developer
          </h3>
          <p className="mt-3 text-sm">Sharat Acharja Mugdho</p>
          <p className="mt-1 text-sm">
            Email:{" "}
            <a
              href="mailto:Sharatacharjee6@gmail.com"
              className="text-pink-400 hover:text-pink-300 underline underline-offset-2"
            >
              Sharatacharjee6@gmail.com
            </a>
          </p>
          <p className="mt-1 text-sm">
            Phone:{" "}
            <a
              href="tel:+8801783720914"
              className="text-pink-400 hover:text-pink-300"
            >
              01783720914
            </a>
          </p>
        </div>

        {/* right */}
        <div className="md:w-1/3 text-right">
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
            Links
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://github.com/Sharatpsd"
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 hover:text-pink-300"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://mugdho-portfolio.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 hover:text-pink-300"
              >
                Portfolio
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            Built with ❤️ by Sharat Acharja Mugdho
          </p>
          <p className="text-xs text-gray-500">
            Crafted for a food delivery experience.
          </p>
        </div>
      </div>
    </footer>
  );
}
