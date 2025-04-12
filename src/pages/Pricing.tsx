
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import PricingComparison from "@/components/pricing/PricingComparison";

const Pricing = () => {
  const plans = [
    {
      name: "مجاني",
      price: "0",
      description: "لمن يريد تجربة الخدمة",
      features: [
        "استخدام الموظف الذكي لمدة 14 يوم",
        "التفاعل مع العملاء على 3 منصات",
        "عدد محدود من المحادثات الشهرية",
        "دعم فني عبر البريد الإلكتروني"
      ],
      limitations: [
        "قاعدة بيانات محدودة",
        "بدون تكامل مع CRM",
        "بدون تقارير متقدمة",
        "بدون دعم متخصص"
      ],
      buttonText: "ابدأ مجاناً",
      buttonLink: "/demo",
      popular: false
    },
    {
      name: "الأساسي",
      price: "199",
      period: "شهرياً",
      description: "للشركات الصغيرة والمتوسطة",
      features: [
        "موظف ذكي على مدار 24/7",
        "التفاعل مع العملاء على 5 منصات",
        "محادثات غير محدودة",
        "تكامل مع أنظمة CRM",
        "تقارير أساسية",
        "دعم فني احترافي"
      ],
      limitations: [
        "بدون تدريب مخصص للموظف الذكي",
        "بدون API مخصصة"
      ],
      buttonText: "احصل على الباقة",
      buttonLink: "/demo",
      popular: true
    },
    {
      name: "المتقدم",
      price: "499",
      period: "شهرياً",
      description: "للشركات الكبيرة والمؤسسات",
      features: [
        "كل مميزات الباقة الأساسية",
        "تفاعل على جميع المنصات",
        "تدريب مخصص للموظف الذكي",
        "API مخصصة",
        "تكامل متقدم مع الأنظمة الداخلية",
        "تقارير متقدمة ولوحة تحكم شاملة",
        "دعم فني متخصص على مدار الساعة",
        "مدير حساب مخصص"
      ],
      limitations: [],
      buttonText: "تواصل معنا",
      buttonLink: "/demo",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">خطط أسعار بسيطة وشفافة</h1>
            <p className="text-xl max-w-2xl mx-auto">اختر الخطة المناسبة لاحتياجات عملك</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-lg border p-6 shadow-sm ${plan.popular ? 'border-awfar-primary shadow-lg' : 'border-gray-200'}`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-awfar-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      الأكثر شعبية
                    </span>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-awfar-primary mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-gray-500 mr-1">ريال / {plan.period}</span>}
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      asChild
                      className={`w-full ${plan.popular ? 'bg-awfar-primary hover:bg-awfar-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      <Link to={plan.buttonLink}>{plan.buttonText}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-awfar-primary mb-4">باقات أوفر</h2>
              <p className="text-gray-600 text-lg">اختر الباقة المناسبة لعملك</p>
            </div>
            
            <PricingComparison />
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-awfar-primary mb-4">تحتاج إلى حل مخصص؟</h3>
              <p className="text-lg text-gray-600 mb-6">
                نقدم حلولًا مخصصة للشركات الكبيرة مع متطلبات فريدة. تواصل مع فريق المبيعات لمعرفة كيف يمكننا مساعدتك.
              </p>
              <Button asChild size="lg" className="bg-awfar-primary hover:bg-awfar-primary/90">
                <Link to="/demo">تواصل مع فريق المبيعات</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-awfar-primary mb-4">الأسئلة الشائعة</h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "هل هناك فترة تجريبية مجانية؟",
                  a: "نعم، نوفر فترة تجريبية مجانية لمدة 14 يومًا لتجربة خدماتنا دون أي التزام."
                },
                {
                  q: "هل يمكنني ترقية خطتي في أي وقت؟",
                  a: "نعم، يمكنك ترقية خطتك في أي وقت، وسيتم تعديل الفاتورة بناءً على الاستخدام النسبي."
                },
                {
                  q: "هل تقدمون خصومات للمشتريات السنوية؟",
                  a: "نعم، نقدم خصمًا بنسبة 20% على الدفعات السنوية لجميع خططنا."
                },
                {
                  q: "ما هي طرق الدفع المقبولة؟",
                  a: "نقبل بطاقات الائتمان الرئيسية، PayPal، والتحويل المصرفي للخطط السنوية."
                },
                {
                  q: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
                  a: "نعم، يمكنك إلغاء اشتراكك في أي وقت دون رسوم إضافية."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-awfar-primary mb-2">{item.q}</h4>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
