import Header from '../shared/components/layout/Header';
import HeroSection from '../features/home/components/HeroSection';
import StatsSection from '../features/home/components/StatsSection';
import ServicesSection from '../features/home/components/ServicesSection';
import GalleryPreview from '../features/gallery/components/GalleryPreview';
import CTASection from '../features/home/components/CTASection';
import Footer from '../shared/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <GalleryPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
