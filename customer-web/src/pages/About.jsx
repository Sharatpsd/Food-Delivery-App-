import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChefHat, Bike, Clock, Star, Users, ArrowRight } from "lucide-react";

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <>
      {/* HERO - Orange/Red Gradient like your Bite brand */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-orange-700">
        <div className="absolute inset-0 bg-black/50" />
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80"
          alt="Delicious food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter" data-aos="fade-up">
            About <span className="text-orange-400 drop-shadow-2xl">Bite</span>
          </h1>
          <p className="mt-6 text-2xl md:text-4xl font-light opacity-90" data-aos="fade-up" data-aos-delay="200">
            Bangladesh's Fastest Growing Food Delivery App
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { number: "500K+", label: "Happy Customers" },
              { number: "8,000+", label: "Restaurants" },
              { number: "45+", label: "Cities Covered" }
            ].map((stat, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={400 + i * 200}>
                <div className="text-7xl font-black text-orange-300">{stat.number}</div>
                <div className="text-xl mt-2 opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              We Deliver Happiness,<br />
              <span className="text-orange-600">One Bite at a Time</span>
            </h2>
            <p className="mt-8 text-xl text-gray-700 leading-relaxed">
              Launched in 2021 from Dhaka, <span className="font-bold text-orange-600">Bite</span> was born to solve one simple problem: getting your favorite food delivered hot and fast — anywhere in Bangladesh.
            </p>
            <p className="mt-6 text-lg text-gray-600">
              Today, we're proud to be the most loved food delivery platform in the country with millions of happy customers.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-8">
              <div className="text-center">
                <Bike className="w-16 h-16 mx-auto text-orange-600 mb-3" />
                <div className="text-4xl font-bold text-orange-600">30 min</div>
                <p className="text-gray-600">Average Delivery</p>
              </div>
              <div className="text-center">
                <Star className="w-16 h-16 mx-auto text-orange-600 mb-3" />
                <div className="text-4xl font-bold text-orange-600">4.8★</div>
                <p className="text-gray-600">App Rating</p>
              </div>
            </div>
          </div>

          <div data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1593115244818-b94ccc73b1c4?w=800&q=80"
              alt="Bite delivery rider"
              className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700 border-8 border-white"
            />
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-16 text-gray-900" data-aos="fade-up">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Clock, title: "Lightning Speed", desc: "Fastest delivery guaranteed" },
              { icon: ChefHat, title: "Top Quality", desc: "Best restaurants, freshest food" },
              { icon: Users, title: "People First", desc: "Customers, riders & partners matter most" }
            ].map((value, i) => (
              <div
                key={i}
                data-aos="zoom-in"
                data-aos-delay={i * 200}
                className="bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl 
                         hover:-translate-y-6 transition-all duration-500 
                         border border-orange-100 group"
              >
                <value.icon className="w-20 h-20 mx-auto text-orange-600 mb-6 group-hover:scale-110 transition" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-lg text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-r from-orange-600 to-red-700 text-white">
        <div className="text-center px-6 max-w-5xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black mb-8" data-aos="zoom-in">
            Ready to <span className="text-orange-300">Bite</span>?
          </h2>
          <p className="text-2xl md:text-3xl mb-12 opacity-90" data-aos="fade-up" data-aos-delay="200">
            Join thousands of happy customers today
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <a
              href="#"
              className="bg-white text-orange-600 px-16 py-7 rounded-full text-2xl font-bold 
                       hover:scale-110 hover:shadow-2xl transition-all duration-300 
                       flex items-center justify-center gap-3"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Download App <ArrowRight className="w-8 h-8" />
            </a>
            <a
              href="/partner"
              className="border-4 border-white px-16 py-7 rounded-full text-2xl font-bold 
                       hover:bg-white hover:text-orange-600 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Partner with Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}