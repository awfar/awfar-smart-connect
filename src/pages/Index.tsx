
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import AIFeature from "@/components/home/AIFeature";
import ChannelsSection from "@/components/home/ChannelsSection";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import ContactForm from "@/components/home/ContactForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <AIFeature />
        <ChannelsSection />
        <Testimonials />
        <CallToAction />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
