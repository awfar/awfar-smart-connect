
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Clock, Users, MessageCircle } from "lucide-react";

const AiEmployee = () => {
  const features = [
    "يتعامل على مدار 24 ساعـــــة على منصات التواصل مع المحتملين",
    "يعمل على كل منصات التواصل (واتساب | ماسنجر | إنستجرام | تطبيقات الشركات)",
    "يتكامل مع أنظمة CRM الحالية لكم ويمكنه الوصول لقاعدة البيانات"
  ];
  
  const benefitsList = [
    { 
      title: "الرد على الاستفسارات",
      icon: <MessageCircle className="h-8 w-8 text-white" />,
      description: "ردود فورية لجميع استفسارات العملاء"
    },
    { 
      title: "إتمام عمليات البيع",
      icon: <Clock className="h-8 w-8 text-white" />,
      description: "متابعة العملاء حتى إتمام عملية الشراء"
    },
    { 
      title: "تحويل المحادثات",
      icon: <Users className="h-8 w-8 text-white" />,
      description: "تحويل المحادثات للفريق البشري عند الحاجة"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-3 px-3 py-1 bg-awfar-primary/10 rounded-full text-awfar-primary font-medium">
            موظف متكامل
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-3">الموظف الذكي = فريق كامل لخدمة العملاء</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">يتعامل نظام Awfar Chat Commerce الذكي مع كل مهام فريق خدمة العملاء بكفاءة عالية وبدون توقف</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -z-10 w-80 h-80 bg-awfar-primary/10 rounded-full -bottom-10 -right-10 blur-3xl"></div>
            <img 
              src="/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png" 
              alt="Awfar AI Employee" 
              className="w-full rounded-lg shadow-xl border border-gray-100"
            />
            
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl z-10 max-w-xs border-l-4 border-green-500">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold">98% رضا العملاء</p>
                  <p className="text-xs text-gray-500">تجربة مستخدم متميزة</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8 text-right">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1.5 bg-green-100 rounded-full mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {benefitsList.map((benefit, index) => (
                <div key={index} className="bg-gradient-to-br from-awfar-primary to-awfar-secondary p-6 rounded-xl text-center text-white shadow-lg">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-white/90">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-6">
              <Button asChild size="lg" className="bg-awfar-primary hover:bg-awfar-primary/90 shadow-lg">
                <Link to="/ai-agent" className="flex items-center gap-2">
                  ابني موظفك الذكي المتخصص مجاناً!
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiEmployee;
