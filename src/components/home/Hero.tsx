
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Facebook, Instagram, MessageCircle, Zap, Clock, ChartBar } from "lucide-react";

const Hero = () => {
  const features = [
    "متاح 24/7 بدون توقف",
    "يتعامل مع عدد لا نهائي من المحادثات",
    "يرد على أكثر من 1000 تعليق في نفس الثانية",
    "يتحدث بكل اللغات واللهجات",
    "يقوم بدور Sales Agents بخبرة سنين",
    "نسبة الخطأ صفر%"
  ];

  return (
    <section className="bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white py-20 overflow-hidden relative">
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 text-center lg:text-right">
            <div className="mb-4">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> الحل الأمثل لتواصل مع عملائك
                </span>
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">تأخرك في الرد يُفقدك <span className="text-awfar-accent relative">66%
              <span className="absolute -bottom-2 left-0 right-0 h-2 bg-awfar-accent/20"></span>
            </span> من عملائك المحتملين!</h1>
            
            <p className="text-xl mb-6 text-white/90">
              بطء الاستجابة يؤدي لخسارتك يومياً لأكثر من 10 فرص بيع
            </p>
            
            <div className="flex gap-8 justify-center lg:justify-end mb-8">
              <div className="flex flex-col items-center">
                <div className="bg-white/10 w-16 h-16 flex items-center justify-center rounded-lg mb-2">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">استجابة فورية</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white/10 w-16 h-16 flex items-center justify-center rounded-lg mb-2">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">تحويل المحادثات</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white/10 w-16 h-16 flex items-center justify-center rounded-lg mb-2">
                  <ChartBar className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">زيادة المبيعات</span>
              </div>
            </div>
            
            <p className="text-lg mb-8">
              الموظف الذكي من Awfar Chat Commerce يتعامل معك مع عملائك 24 ساعة بكل اللغات واللهجات!
            </p>
            
            <div className="mb-8">
              <ul className="space-y-3 text-lg">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center lg:justify-end gap-3">
                    <span>{feature}</span>
                    <div className="bg-awfar-accent/30 rounded-full p-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-awfar-accent" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
              <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-white flex gap-2">
                <Link to="/demo">
                  <MessageCircle className="h-5 w-5" />
                  <span>قم بتجربة الموظف الذكي</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/ai-agent">تعرف على خدماتنا</Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-awfar-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              
              <img 
                src="/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png" 
                alt="Awfar Chat Platform" 
                className="w-full rounded-lg shadow-2xl border border-white/10"
              />
              
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg max-w-xs">
                <div className="flex items-center gap-2">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-blue-500 p-2 rounded">
                      <MessageSquare size={18} className="text-white" />
                    </div>
                    <div className="bg-green-500 p-2 rounded">
                      <MessageCircle size={18} className="text-white" />
                    </div>
                    <div className="bg-blue-600 p-2 rounded">
                      <Facebook size={18} className="text-white" />
                    </div>
                    <div className="bg-pink-500 p-2 rounded">
                      <Instagram size={18} className="text-white" />
                    </div>
                  </div>
                  <span className="text-sm text-white">تواصل عبر كل المنصات بمكان واحد</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <img src="/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png" alt="AI Assistant" className="h-10 w-10 rounded-full" />
                  <div className="text-sm text-white">
                    <p className="font-medium">الموظف الذكي</p>
                    <p className="text-xs">متاح 24/7</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-white text-right">
                    <p className="font-medium">أكثر من 50,000+</p>
                    <p className="text-xs">عميل راضي</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative shapes */}
      <div className="absolute top-1/3 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-awfar-accent/10 rounded-full translate-x-1/2 blur-3xl"></div>
      <div className="absolute top-3/4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
    </section>
  );
};

export default Hero;
