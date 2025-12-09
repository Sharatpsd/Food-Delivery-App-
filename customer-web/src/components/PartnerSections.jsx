import { motion } from "framer-motion";
import { User, ShoppingCart, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function PartnerSections() {
  return (
    <>
      {/* Restaurant Owner Section */}
      <section id="restaurant-owner" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6"
            >
              Join as Restaurant Owner
            </motion.h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Grow your business with Bangladesh's fastest delivery platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Your Menu</h3>
                  <p className="text-gray-600">Upload dishes, set prices, manage orders</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Approval</h3>
                  <p className="text-gray-600">Submit form → Admin verifies → Live instantly</p>
                </div>
              </div>
              <div className="pt-8">
                <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
                  Apply Now → Admin Will Contact
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-3xl p-12 border border-orange-200/50">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mx-auto flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-bold text-gray-900">PizzaBurga</h4>
                    <div className="flex items-center justify-center gap-2 text-orange-600 text-lg font-bold">
                      <Clock className="w-5 h-5" />
                      <span>Approved</span>
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Delivery Boy Section */}
      <section id="delivery-boy" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6"
            >
              Join as Delivery Partner
            </motion.h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Earn ₹500-1500 daily delivering food
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8 order-2 lg:order-1"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pick & Deliver</h3>
                  <p className="text-gray-600">Accept orders, pickup, deliver, get paid instantly</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Verification</h3>
                  <p className="text-gray-600">Submit docs → Admin approves → Start earning</p>
                </div>
              </div>
              <div className="pt-8">
                <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
                  Apply Now → Admin Will Contact
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative order-1 lg:order-2"
            >
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-12 border border-green-200/50">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-bold text-gray-900">Rahim Delivery</h4>
                    <div className="flex items-center justify-center gap-2 text-green-600 text-lg font-bold">
                      <Clock className="w-5 h-5" />
                      <span>Active Rider</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
