
import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
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
