
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-awfar-primary to-awfar-secondary py-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png')] opacity-10 bg-cover bg-center"></div>
      <div className="absolute top-1/3 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-awfar-accent/10 rounded-full translate-x-1/2 blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <div className="inline-block mb-3 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-white font-medium">تكنولوجيا الذكاء الاصطناعي المتقدمة</span>
            </div>
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                تأخرك في الرد يُفقدك <span className="text-awfar-accent">66%</span> من عملائك المحتملين!
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                بطء الاستجابة يؤدي لخسارتك يومياً لأكثر من 10 فرص بيع. موظفنا الذكي يتعامل مع عملائك على مدار <span className="font-bold">24 ساعة</span> بكل اللغات واللهجات!
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-end mb-8">
              <Button asChild size="lg" className="bg-awfar-accent hover:bg-awfar-accent/90 text-white">
                <Link to="/demo" className="flex items-center">
                  قم بتجربة الموظف الذكي
                  <ArrowRight className="mr-2 h-5 w-5 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/pricing">تعرف على خدماتنا</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["ردود فورية", "دعم 24/7", "تكامل مع الأنظمة", "تخصيص كامل"].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-awfar-accent" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
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
                src="/lovable-uploads/72cbf72d-0947-4e2f-8a78-d00fce992254.png"
                alt="Awfar AI Agent" 
                className="w-full rounded-xl shadow-lg"
              />
              
              <div className="mt-6 flex flex-col gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-awfar-accent flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white/80">عندك استفسار؟</p>
                      <p className="font-medium">كيف يمكنني مساعدتك اليوم؟</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-awfar-accent/20 to-awfar-primary/20 backdrop-blur-sm p-4 rounded-xl ml-6">
                  <div className="flex justify-end">
                    <p className="text-sm">مرحبا، أريد معلومات عن منتجاتكم</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-awfar-accent flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">بالتأكيد! لدينا 3 باقات متميزة...</p>
                    </div>
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
