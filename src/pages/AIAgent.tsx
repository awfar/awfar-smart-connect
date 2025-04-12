
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Zap, Globe, BarChart3, Bot, Braces } from "lucide-react";

const AIAgent = () => {
  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-awfar-primary to-awfar-secondary py-20 text-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-right">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">وكيل الذكاء الاصطناعي</h1>
                <h2 className="text-2xl mb-6">Awfar AI Agent</h2>
                <p className="text-xl mb-8">
                  هو نظام متقدم مصمم لتحسين التفاعل مع العملاء، تبسيط العمليات التجارية، وزيادة الكفاءة من خلال الأتمتة الذكية.
                </p>
                <Button asChild size="lg" className="bg-awfar-accent text-awfar-primary hover:opacity-90">
                  <Link to="/demo">طلب عرض توضيحي</Link>
                </Button>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img 
                  src="/lovable-uploads/b0b14990-b364-428f-b4d8-3eec941921fa.png" 
                  alt="Awfar AI Agent" 
                  className="w-full max-w-md rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-awfar-primary mb-4">المميزات الأساسية</h2>
              <p className="text-gray-600 text-lg">
                تعرف على مميزات وكيل الذكاء الاصطناعي من أوفر وكيف يمكنه تحسين تجربة عملائك وزيادة كفاءة فريق الدعم لديك
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-awfar-primary text-white mb-5">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-awfar-primary">
                  ردود تلقائية فورية
                </h3>
                <p className="text-gray-600">
                  يوفر إجابات سريعة ودقيقة للاستفسارات الشائعة للعملاء، مما يقلل من وقت الانتظار ويحسن تجربة العملاء.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-awfar-primary text-white mb-5">
                  <Globe size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-awfar-primary">
                  فهم اللهجات والثقافات
                </h3>
                <p className="text-gray-600">
                  قادر على فهم مختلف اللهجات العربية والتفاعل بطريقة مناسبة ثقافياً مع العملاء، مما يعزز التواصل الفعال.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-awfar-primary text-white mb-5">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-awfar-primary">
                  تحليل البيانات
                </h3>
                <p className="text-gray-600">
                  تخصيص الردود وجمع البيانات وتحليلها لتحسين خدمة العملاء، مما يتيح اتخاذ قرارات مستندة إلى البيانات.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-awfar-primary text-white mb-5">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-awfar-primary">
                  دعم متعدد اللغات
                </h3>
                <p className="text-gray-600">
                  يتفاعل مع العملاء بلغات متعددة، مما يوسع نطاق خدمات الدعم ويعزز الوصول إلى جمهور أوسع عالمياً.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-awfar-primary text-white mb-5">
                  <Bot size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-awfar-primary">
                  التعلم المستمر
                </h3>
                <p className="text-gray-600">
                  يعتمد على التعلم الآلي لتحسين الأداء وتوقع احتياجات العملاء المستقبلية وتطوير استراتيجيات الدعم الاستباقية.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-awfar-primary text-white mb-5">
                  <Braces size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-awfar-primary">
                  التكامل والتوافق
                </h3>
                <p className="text-gray-600">
                  يتكامل بسهولة مع أنظمة CRM الحالية والأدوات الأخرى، مما يضمن تدفق سلس للبيانات وعمليات متسقة.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-awfar-primary mb-4">روبوت المحادثات بالذكاء الاصطناعي</h3>
                  <p className="text-gray-600 mb-4">
                    ساعد عملاءك بشكل فوري عبر روبوت محادثات ذكي بإمكانه:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>أتمتة الرد على استفسارات العملاء الشائعة بسرعة ودقيقة</span>
                    </li>
                    <li className="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>فهم السياق والرد على استفسارات معقدة</span>
                    </li>
                    <li className="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>تقديم ردود مخصصة بناءً على تاريخ العميل</span>
                    </li>
                    <li className="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>توجيه العملاء إلى الخدمات المناسبة</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 text-center lg:text-right">
                <h2 className="text-3xl font-bold text-awfar-primary mb-4">
                  إدارة الكفاءة بشكل متطور
                </h2>
                <p className="text-gray-600 mb-6">
                  إدارة فعالة لكمية كبيرة من العملاء باستخدام خوارزميات توزيع المحادثات الذكية.
                </p>
                
                <h3 className="text-xl font-bold text-awfar-primary mb-3">تحليلات وإعداد تقارير في الوقت الفعلي</h3>
                <p className="text-gray-600 mb-6">
                  احصل على بيانات دقيقة لتحسين خدمة العملاء وقياس أداء وكلاء الدعم.
                </p>
                
                <h3 className="text-xl font-bold text-awfar-primary mb-3">التكامل السلس مع الأنظمة المختلفة</h3>
                <p className="text-gray-600 mb-6">
                  دمج سهل مع واتساب، فيسبوك، إنستغرام لتحسين تجربة العملاء.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                استكشف قوة الذكاء الاصطناعي في أعمالك
              </h2>
              <p className="text-xl mb-8">
                ابدأ اليوم مع تجربة مجانية وارفع مستوى تفاعل عملائك إلى آفاق جديدة
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-awfar-primary hover:bg-gray-100">
                  <Link to="/demo">طلب عرض توضيحي</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/pricing">عرض الأسعار والباقات</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIAgent;
