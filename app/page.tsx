import Navbar from '@/components/Navbar';
import BannerCarousel from '@/components/BannerCarousel';
import ProductsSection from '@/components/ProductsSection';
import SolutionsSection from '@/components/SolutionsSection';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import FaqSection from '@/components/FaqSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SocialSidebar from '@/components/SocialSidebar';
import StructuredData from '@/components/StructuredData';

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative">
      <StructuredData />
      <Navbar />
      <main>
        <BannerCarousel />
        <ProductsSection />
        <SolutionsSection />
        <FeaturesSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <SocialSidebar />
    </div>
  );
}
