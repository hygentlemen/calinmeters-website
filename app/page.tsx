'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-700">Shenzhen Calinmeter Co., Ltd.</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-primary-600">Home</a>
              <a href="#products" className="text-gray-700 hover:text-primary-600">Products</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600">About Us</a>
              <a href="#news" className="text-gray-700 hover:text-primary-600">News</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-xl text-gray-600">Comprehensive range of smart metering solutions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Smart Electricity Meters */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-6xl">⚡</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Electricity Meters</h3>
                <p className="text-gray-600 mb-4">STS prepaid, single-phase, three-phase, DIN rail, socket meters</p>
                <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Smart Water Meters */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <span className="text-6xl">💧</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Water Meters</h3>
                <p className="text-gray-600 mb-4">Ultrasonic, mechanical, volumetric, valve-controlled, large diameter</p>
                <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Smart Gas Meters */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-6xl">🔥</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Gas Meters</h3>
                <p className="text-gray-600 mb-4">Ultrasonic, diaphragm, steel shell, commercial, industrial</p>
                <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">
                  Learn More →
                </a>
              </div>
            </div>
          </div>

          {/* Additional Products */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <span className="text-4xl mb-3 block">📡</span>
              <h4 className="font-semibold text-gray-900">LoRaWAN Gateway</h4>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <span className="text-4xl mb-3 block">💻</span>
              <h4 className="font-semibold text-gray-900">Smart Software</h4>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <span className="text-4xl mb-3 block">🔌</span>
              <h4 className="font-semibold text-gray-900">Communication Boards</h4>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <span className="text-4xl mb-3 block">🔧</span>
              <h4 className="font-semibold text-gray-900">Accessories</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Calin Meters?</h2>
            <p className="text-xl text-gray-600">Trusted by customers worldwide</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Precision</h3>
              <p className="text-gray-600">Accurate measurement with advanced technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Prepaid</h3>
              <p className="text-gray-600">STS certified prepaid technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">IoT Enabled</h3>
              <p className="text-gray-600">NB-IoT, LoRaWAN, GPRS communication</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Certified Quality</h3>
              <p className="text-gray-600">International standards and certifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Calin Meters</h2>
              <p className="text-lg text-gray-600 mb-4">
                We are a professional manufacturer specializing in the design and production of 
                smart prepaid meters for electricity, water, and gas.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                With years of experience in the industry, we provide comprehensive metering solutions 
                including integrated energy remote meter reading systems and big data management analysis platforms.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-primary-600">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-primary-600">50+</div>
                  <div className="text-gray-600">Countries Served</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl h-96 flex items-center justify-center text-white text-6xl">
              🏭
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest News</h2>
            <p className="text-xl text-gray-600">Industry insights and company updates</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-4xl">🔥</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-primary-600 mb-2">March 13, 2026</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">The Dual-Track Evolution of Gas Meters</h3>
                <p className="text-gray-600 mb-4">Diaphragm and ultrasonic gas meters are complementary symbiotic in dual-track evolution.</p>
                <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">Read More →</a>
              </div>
            </article>

            <article className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-4xl">🌐</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-primary-600 mb-2">March 12, 2026</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Introduction to IoT Protocols</h3>
                <p className="text-gray-600 mb-4">Understanding MQTT, CoAP, Modbus, and other communication protocols.</p>
                <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">Read More →</a>
              </div>
            </article>

            <article className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <span className="text-4xl">💧</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-primary-600 mb-2">March 10, 2026</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mechanical Water Meters Introduction</h3>
                <p className="text-gray-600 mb-4">Affordable, reliable, and widely used worldwide.</p>
                <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">Read More →</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-primary-100">Ready to discuss your metering needs?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-primary-100">Floor 6, Bd A1, Qiaode Tech Park, Kelian Rd, Guang Ming District Shenzhen, China</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-primary-100">+8613713788753</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h4 className="font-semibold">WhatsApp / WeChat</h4>
                    <p className="text-primary-100">+86 18661076788</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-primary-100">contact@calinmeters.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Your Message" 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-white text-primary-700 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Shenzhen Calinmeter Co., Ltd.</h3>
              <p className="text-gray-400">Smart prepaid meters for electricity, water, and gas.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Electricity Meters</a></li>
                <li><a href="#" className="hover:text-white">Water Meters</a></li>
                <li><a href="#" className="hover:text-white">Gas Meters</a></li>
                <li><a href="#" className="hover:text-white">IoT Solutions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">News</a></li>
                <li><a href="#" className="hover:text-white">Certifications</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://www.linkedin.com/in/qiscott/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl">📱</a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl">📹</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shenzhen Calinmeter Co., Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
