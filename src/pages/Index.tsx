
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import AIFeature from '@/components/home/AIFeature';
import ChannelsSection from '@/components/home/ChannelsSection';
import AiEmployee from '@/components/home/AiEmployee';
import CaseStudy from '@/components/home/CaseStudy';
import ComparisonTable from '@/components/home/ComparisonTable';
import Testimonials from '@/components/home/Testimonials';
import TestimonialSlider from '@/components/home/TestimonialSlider';
import IndustryHelp from '@/components/home/IndustryHelp';
import CCommerce from '@/components/home/CCommerce';
import BotComparison from '@/components/home/BotComparison';
import WorkHoursComparison from '@/components/home/WorkHoursComparison';
import FAQ from '@/components/home/FAQ';
import Partners from '@/components/home/Partners';
import CallToAction from '@/components/home/CallToAction';
import ContactForm from '@/components/home/ContactForm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto mb-8 px-4 pt-8 md:pt-12">
        <div className="flex justify-center mb-8">
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
              <span className="flex items-center gap-2">
                Access Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path></svg>
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <Hero />
      <Features />
      <AiEmployee />
      <AIFeature />
      <CaseStudy />
      <ChannelsSection />
      <TestimonialSlider />
      <IndustryHelp />
      <ComparisonTable />
      <CCommerce />
      <BotComparison />
      <WorkHoursComparison />
      <Testimonials />
      <Partners />
      <FAQ />
      <CallToAction />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
