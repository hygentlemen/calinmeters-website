'use client';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg md:text-2xl font-bold text-primary-700">Shenzhen Calinmeter Co., Ltd.</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600">Home</a>
            <a href="#products" className="text-gray-700 hover:text-primary-600">Products</a>
            <a href="#certificates" className="text-gray-700 hover:text-primary-600">Certificates</a>
            <a href="#about" className="text-gray-700 hover:text-primary-600">About Us</a>
            <a href="#faq" className="text-gray-700 hover:text-primary-600">FAQ</a>
            <a href="#news" className="text-gray-700 hover:text-primary-600">News</a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
