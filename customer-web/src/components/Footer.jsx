// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-3xl font-bold text-white">FoodExpress</h2>
          <p className="mt-4 text-gray-400">
            Fast delivery • Fresh food • Best restaurants
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/orders" className="hover:text-white">My Orders</a></li>
            <li><a href="/cart" className="hover:text-white">My Cart</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Popular Categories
          </h3>
          <ul className="space-y-2">
            <li>Burger</li>
            <li>Biryani</li>
            <li>Pizza</li>
            <li>Chicken Grill</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Contact Us
          </h3>
          <p className="text-gray-400">Dhaka, Bangladesh</p>
          <p className="text-gray-400">Email: support@foodexpress.com</p>
          <p className="text-gray-400">Phone: +880 1234 567890</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">
        © {new Date().getFullYear()} FoodExpress — All Rights Reserved
      </div>
    </footer>
  );
}
