
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-awfar-primary to-awfar-secondary py-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png')] opacity-10 bg-cover bg-center"></div>
      <div className="absolute top-1/3 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-awfar-accent/10 rounded-full translate-x-1/2 blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                موظفك الذكي المتخصص متاح <span className="text-awfar-accent">24/7</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                استفد من قوة الذكاء الاصطناعي في خدمة العملاء والمبيعات. موظف متخصص يتحدث بلغة عملائك ويفهم احتياجاتهم.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
              <Button asChild size="lg" className="bg-awfar-accent hover:bg-awfar-accent/90 text-white">
                <Link to="/demo" className="flex items-center">
                  ابدأ الآن مجاناً
                  <ArrowRight className="mr-2 h-5 w-5 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/pricing">عرض الباقات والأسعار</Link>
              </Button>
            </div>
            
            <div className="mt-10">
              <div className="flex items-center gap-6 justify-center lg:justify-end">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${20 + i}.jpg`} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold">+5000</p>
                  <p className="text-white/80">عميل سعيد</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-awfar-accent/20 rounded-full blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-sm shadow-2xl">
              <img 
                src="/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png" 
                alt="Awfar AI Agent" 
                className="w-full rounded-2xl"
              />
              
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">متاح 24/7</p>
                    <p className="text-xs text-gray-500">خدمة مستمرة بدون توقف</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-awfar-primary rounded-full flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">عبر كل المنصات</p>
                    <p className="text-xs text-gray-500">واتساب، فيسبوك، انستجرام</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
