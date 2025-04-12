
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-right">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">من دلوقتي يقدر يبقى عندك موظف</h1>
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
            <p className="text-xl mb-8 text-gray-100">
              كل ده في نفس اللحظة … بأقل من مرتب موظف خدمة عملاء
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-awfar-accent text-awfar-primary hover:opacity-90">
                <Link to="/demo">طلب تجربة مجانية</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/ai-agent">تعرف على خدماتنا</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="/lovable-uploads/4ae3a89c-aad3-4d1e-9beb-3890147a56ae.png" 
                alt="Awfar AI Agent" 
                className="w-full max-w-md rounded-lg shadow-lg animate-float"
              />
              <div className="absolute -bottom-4 -right-4 bg-awfar-accent rounded-full p-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-awfar-primary">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative shapes */}
      <div className="absolute top-1/3 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-awfar-accent/10 rounded-full translate-x-1/2 blur-3xl"></div>
    </section>
  );
};

export default Hero;
