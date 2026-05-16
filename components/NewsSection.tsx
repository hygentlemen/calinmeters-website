'use client';

const news = [
  {
    date: 'March 13, 2026',
    title: 'The Dual-Track Evolution of Gas Meters',
    summary: 'Diaphragm and ultrasonic gas meters are complementary symbiotic in dual-track evolution.',
    gradient: 'from-orange-400 to-red-500',
    icon: '🔥',
    label: 'Gas Meter Innovation',
  },
  {
    date: 'March 12, 2026',
    title: 'Introduction to IoT Protocols',
    summary: 'Understanding MQTT, CoAP, Modbus, and other communication protocols.',
    gradient: 'from-blue-400 to-indigo-500',
    icon: '🌐',
    label: 'IoT Technology',
  },
  {
    date: 'March 10, 2026',
    title: 'Mechanical Water Meters Introduction',
    summary: 'Affordable, reliable, and widely used worldwide.',
    gradient: 'from-cyan-400 to-teal-500',
    icon: '💧',
    label: 'Water Metering',
  },
];

export default function NewsSection() {
  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest News</h2>
          <p className="text-xl text-gray-600">Industry insights and company updates</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.title} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className={`h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-sm opacity-90">{item.label}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-primary-600 mb-2">{item.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.summary}</p>
                <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">Read More →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
