
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const AiEmployee = () => {
  const features = [
    "يتعامل على مدار 24 ساعـــــة على منصات التواصل مع المحتملين",
    "يعمل على كل منصات التواصل (واتساب | ماسنجر | إنستجرام | تطبيقات الشركات)",
    "يتكامل مع أنظمة CRM الحالية لكم ويمكنه الوصول لقاعدة البيانات"
  ];
  
  const benefitsList = [
    "الرد على الاستفسارات",
    "إتمام عمليات البيع",
    "تحويل المحادثات للفريق البشري"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-awfar-primary mb-2">الموظف الذكي = فريق كامل لخدمة العملاء</h2>
          <p className="text-gray-600">يتعامل منظام Awfar Chat Commerce الذكي مع كل مهام فريق خدمة العملاء في</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img 
              src="/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png" 
              alt="Awfar AI Employee" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-6 text-right">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {benefitsList.map((benefit, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button asChild className="bg-awfar-primary hover:bg-awfar-primary/90">
                <Link to="/ai-agent">ابني موظفك الذكي المتخصص مجاناً!</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiEmployee;
