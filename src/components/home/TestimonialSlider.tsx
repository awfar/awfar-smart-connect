
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "محمد أبو البنا تجاني",
      role: "مدير تسويق",
      company: "شركة المتحدة",
      image: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png",
      quote: "ساعدتنا خدمة أوفر وفريق أوفر والعاملين في مجال C-Commerce في التسويق عن طريق المحادثة."
    },
    {
      id: 2,
      name: "أحمد محمد",
      role: "مدير عام",
      company: "مجموعة الفيصل",
      image: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png",
      quote: "تمكنا من زيادة مبيعاتنا بنسبة 45% خلال 3 أشهر بفضل نظام الموظف الذكي من أوفر."
    },
    {
      id: 3,
      name: "خالد العمري",
      role: "مدير التشغيل",
      company: "مطاعم السلطان",
      image: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png",
      quote: "ساعدنا نظام أوفر على تقليل وقت الرد على العملاء من ساعات إلى ثوان مما زاد من رضا العملاء."
    }
  ];

  const nextSlide = () => {
    setCurrent(current === testimonials.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? testimonials.length - 1 : current - 1);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="py-20 bg-gradient-to-r from-awfar-primary to-awfar-secondary relative overflow-hidden">
      <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-10">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-opacity duration-500 absolute w-full ${
                  index === current ? "opacity-100 relative" : "opacity-0"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-white/50">
                      <img 
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white/20 backdrop-blur-sm p-1 rounded-full">
                      <Play size={16} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="mb-6 text-white">
                    <h3 className="font-bold text-xl">{testimonial.name}</h3>
                    <p>{testimonial.role} - {testimonial.company}</p>
                  </div>
                  
                  <div className="relative">
                    <svg className="absolute -top-6 -right-6 w-12 h-12 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    
                    <p className="text-lg text-white mb-8">"{testimonial.quote}"</p>
                    
                    <svg className="absolute -bottom-6 -left-6 w-12 h-12 text-white/20 transform rotate-180" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  <Button className="mt-6 bg-white text-awfar-primary hover:bg-white/90">
                    شاهد فيديو تجربتي مع الموظف الذكي
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between mt-8">
              <button 
                onClick={prevSlide} 
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="text-white" />
              </button>
              <button 
                onClick={nextSlide} 
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
