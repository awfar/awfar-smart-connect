
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Mic, Image, CheckCircle, Zap } from "lucide-react";

const AIFeature = () => {
  const features = [
    "تفاعل فوري مع رسائل العملاء",
    "دعم جميع اللغات واللهجات",
    "تحويل العملاء المحتملين إلى مبيعات",
    "تكامل مع أنظمة CRM الحالية"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -z-10 w-80 h-80 bg-awfar-accent/10 rounded-full -top-10 -left-10 blur-3xl"></div>
              
              <div className="relative z-10 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100">
                <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <img 
                    src="/lovable-uploads/72cbf72d-0947-4e2f-8a78-d00fce992254.png"
                    alt="Awfar AI Agent" 
                    className="rounded-lg shadow-lg"
                  />
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                    <MessageSquare className="h-8 w-8 text-awfar-accent mb-2" />
                    <span className="font-medium text-gray-700">ردود ذكية</span>
                    <span className="text-xs text-gray-500 text-center">يتفاعل مع جميع أنواع الرسائل</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                    <Mic className="h-8 w-8 text-awfar-accent mb-2" />
                    <span className="font-medium text-gray-700">رسائل صوتية</span>
                    <span className="text-xs text-gray-500 text-center">يفهم ويرد على الرسائل الصوتية</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                    <Image className="h-8 w-8 text-awfar-accent mb-2" />
                    <span className="font-medium text-gray-700">تحليل الصور</span>
                    <span className="text-xs text-gray-500 text-center">يتعرف على محتوى الصور ويتفاعل معها</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                    <Zap className="h-8 w-8 text-awfar-accent mb-2" />
                    <span className="font-medium text-gray-700">استجابة فورية</span>
                    <span className="text-xs text-gray-500 text-center">يرد في ثوانٍ على مدار الساعة</span>
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg z-20 max-w-xs border-l-4 border-awfar-primary">
                  <div className="flex items-start gap-3 text-right">
                    <div>
                      <p className="text-sm font-bold text-awfar-primary mb-1">الموظف المثالي لخدمة العملاء</p>
                      <p className="text-xs text-gray-500">يتفاعل مع 1500+ رسالة يومياً بدون تأخير</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 text-center lg:text-right">
            <div className="inline-block mb-4 px-3 py-1 bg-awfar-accent/10 rounded-full text-awfar-accent font-medium">
              تكنولوجيا فريدة
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">وكيل الذكاء الاصطناعي</h2>
            <h3 className="text-xl text-awfar-primary mb-6">Awfar AI Agent</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              نظام متقدم مصمم لتحسين التفاعل مع العملاء، تبسيط العمليات التجارية وزيادة الكفاءة من خلال الأتمتة الذكية. يوفر مساعدة فورية للعملاء على مدار الساعة طوال أيام الأسبوع.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
              <h4 className="font-bold text-awfar-primary mb-4 text-lg">يتكلم كل اللغات واللهجات</h4>
              <div className="flex items-center justify-around">
                <div className="flex flex-col items-center">
                  <img src="/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png" alt="Multi-language support" className="h-20 w-20 object-contain" />
                  <span className="mt-2 text-sm font-medium">دعم اللغة العربية</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png" alt="Multi-language support" className="h-20 w-20 object-contain" />
                  <span className="mt-2 text-sm font-medium">دعم اللغات الأجنبية</span>
                </div>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90 shadow-lg">
              <Link to="/ai-agent" className="px-6">تعرف على المزيد</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeature;
