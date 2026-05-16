'use client';

export default function Hero() {
  return (
    <section id="home" className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Smart Prepaid Meters for the Future
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Professional manufacturer of electricity meters, water meters, and gas meters
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition">
              View Products
            </a>
            <a href="#contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
