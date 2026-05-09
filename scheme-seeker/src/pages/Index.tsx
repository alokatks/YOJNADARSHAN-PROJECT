import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import WhoIsThisFor from '@/components/landing/WhoIsThisFor';
import TransparencySection from '@/components/landing/TransparencySection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <WhoIsThisFor />
        <TransparencySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
