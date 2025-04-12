
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Mic, Image } from "lucide-react";

const AIFeature = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -z-10 w-72 h-72 bg-awfar-accent/20 rounded-full -top-10 -left-10 blur-3xl"></div>
              <img 
                src="/lovable-uploads/72cbf72d-0947-4e2f-8a78-d00fce992254.png"
                alt="Awfar AI Agent" 
                className="rounded-lg shadow-xl max-w-full mx-auto relative z-10"
              />
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-20 max-w-xs">
                <div className="flex items-start gap-3 text-right">
                  <div className="h-10 w-10 rounded-full bg-awfar-accent flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-awfar-primary">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" x2="12" y1="19" y2="22"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-awfar-primary">الموظف المثالي لخدمة العملاء الأونلاين</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 text-center lg:text-right">
            <h2 className="text-3xl font-bold text-awfar-primary mb-4">وكيل الذكاء الاصطناعي</h2>
            <h3 className="text-xl text-awfar-secondary mb-6">Awfar AI Agent</h3>
            <p className="text-gray-600 mb-8">
              نظام متقدم مصمم لتحسين التفاعل مع العملاء، تبسيط العمليات التجارية وزيادة الكفاءة من خلال الأتمتة الذكية.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-awfar-primary mb-4">يتفاعل مع رسائل عملائك</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                    <MessageSquare className="h-8 w-8 text-awfar-accent mb-2" />
                    <span className="font-medium">النصية</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                    <Mic className="h-8 w-8 text-awfar-accent mb-2" />
                    <span className="font-medium">الصوتية</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                    <Image className="h-8 w-8 text-awfar-accent mb-2" />
                    <span className="font-medium">الصور</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-awfar-primary mb-4">يتكلم كل اللغات واللهجات</h4>
                <div className="flex items-center justify-around">
                  <div className="flex flex-col items-center">
                    <img src="/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png" alt="Multi-language support" className="h-20 w-20 object-contain" />
                    <span className="mt-2 text-sm">دعم اللغة العربية</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png" alt="Multi-language support" className="h-20 w-20 object-contain" />
                    <span className="mt-2 text-sm">دعم اللغات الأجنبية</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button asChild className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
              <Link to="/ai-agent">تعرف على المزيد</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeature;
