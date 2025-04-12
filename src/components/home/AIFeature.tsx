
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AIFeature = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -z-10 w-72 h-72 bg-awfar-accent/20 rounded-full -top-10 -left-10 blur-3xl"></div>
              <img 
                src="/lovable-uploads/b0b14990-b364-428f-b4d8-3eec941921fa.png"
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
                    <p className="text-sm font-medium text-awfar-primary">الرد الفوري على استفسارات العملاء مع فهم كامل للهجات المختلفة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 text-center lg:text-right">
            <h2 className="text-3xl font-bold text-awfar-primary mb-4">وكيل الذكاء الاصطناعي</h2>
            <h3 className="text-xl text-awfar-secondary mb-6">Awfar AI Agent</h3>
            <p className="text-gray-600 mb-8">
              نظام متقدم مصمم لتحسين التفاعل مع Awfar وكيل الذكاء الاصطناعي من العملاء، لتبسيط العمليات التجارية وزيادة الكفاءة من خلال الأتمتة الذكية.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-awfar-primary mb-2">ردود تلقائية فورية</h4>
                <p className="text-sm text-gray-600">يوفر إجابات سريعة ودقيقة للاستفسارات الشائعة للعملاء</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-awfar-primary mb-2">فهم اللهجات والثقافات</h4>
                <p className="text-sm text-gray-600">قادر على فهم مختلف اللهجات العربية والتفاعل بطريقة مناسبة ثقافياً</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-awfar-primary mb-2">تحليل البيانات</h4>
                <p className="text-sm text-gray-600">تخصيص الردود وجمع البيانات وتحليلها لتحسين خدمة العملاء</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-awfar-primary mb-2">التعلم المستمر</h4>
                <p className="text-sm text-gray-600">يعتمد على التعلم الآلي لتحسين الأداء وتوقع احتياجات العملاء المستقبلية</p>
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
