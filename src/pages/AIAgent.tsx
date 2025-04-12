
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ai-agent/HeroSection";
import FeaturesSection from "@/components/ai-agent/FeaturesSection";
import AdvancedFeatures from "@/components/ai-agent/AdvancedFeatures";
import CallToAction from "@/components/ai-agent/CallToAction";

const AIAgent = () => {
  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <AdvancedFeatures />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default AIAgent;
