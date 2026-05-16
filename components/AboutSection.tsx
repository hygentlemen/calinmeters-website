'use client';

export default function AboutSection() {
  return (
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
          <div className="rounded-2xl h-96 overflow-hidden shadow-xl">
            <img
              src="/images/company/factory.jpg"
              alt="Calin Meters Factory"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
