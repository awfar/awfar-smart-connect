
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Bot, ArrowLeft } from "lucide-react";

interface HeroSectionProps {
  onTryDemo?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onTryDemo }) => {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              الوكيل الذكي المتخصص لخدمة عملائك على مدار الساعة
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              دع الذكاء الاصطناعي من أوفر يتولى خدمة عملائك، والإجابة على استفساراتهم، وزيادة مبيعاتك بشكل تلقائي على جميع منصات التواصل.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-end gap-4">
              <Button 
                onClick={onTryDemo}
                className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90"
                size="lg"
              >
                <Bot className="mr-2 h-5 w-5" /> 
                جرّب الوكيل الذكي الآن
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">
                  اشترك الآن
                  <ArrowLeft className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="order-first lg:order-last">
            <img 
              src="/lovable-uploads/70fad303-ee74-4179-8904-3f0934a95ed9.png"
              alt="AI Agent Dashboard"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
    </section>
  );
};

export default HeroSection;
