'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductsSection from '@/components/ProductsSection';
import CertificatesSection from '@/components/CertificatesSection';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import FaqSection from '@/components/FaqSection';
import NewsSection from '@/components/NewsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SocialSidebar from '@/components/SocialSidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />
      <Hero />
      <ProductsSection />
      <CertificatesSection />
      <FeaturesSection />
      <AboutSection />
      <FaqSection />
      <NewsSection />
      <ContactSection />
      <Footer />
      <SocialSidebar />
    </div>
  );
}
