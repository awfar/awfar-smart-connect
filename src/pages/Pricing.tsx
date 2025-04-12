
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PricingComparison from '@/components/pricing/PricingComparison';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPlans = [
    {
      name: "Free",
      price: billingCycle === 'monthly' ? "0" : "0",
      description: "للشركات الناشئة",
      features: [
        "محادثة واحدة فقط",
        "ردود محدودة شهرياً",
        "قناة تواصل واحدة",
        "دعم فني بالبريد الإلكتروني",
        "تخصيص محدود"
      ],
      cta: "ابدأ مجاناً"
    },
    {
      name: "Plus",
      price: billingCycle === 'monthly' ? "199" : "1990",
      description: "للشركات الصغيرة",
      popular: true,
      features: [
        "3 محادثات متزامنة",
        "5000 رد شهرياً",
        "3 قنوات تواصل",
        "دعم فني على مدار الساعة",
        "تخصيص كامل للبوت",
        "تكامل مع WhatsApp Business",
        "تقارير أساسية"
      ],
      cta: "ابدأ الآن"
    },
    {
      name: "Pro",
      price: billingCycle === 'monthly' ? "499" : "4990",
      description: "للشركات المتوسطة والكبيرة",
      features: [
        "محادثات غير محدودة",
        "ردود غير محدودة",
        "جميع قنوات التواصل",
        "دعم فني متميز",
        "تخصيص كامل مع واجهة API",
        "تكامل مع أنظمة CRM",
        "تقارير متقدمة وتحليلات",
        "مدير حساب مخصص"
      ],
      cta: "تحدث مع المبيعات"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-awfar-primary to-awfar-secondary py-20 text-white text-center">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">خطط أسعار بسيطة وشفافة</h1>
            <p className="text-xl mb-8">اختر الخطة المناسبة لاحتياجات عملك</p>
            
            <Tabs defaultValue="monthly" className="w-fit mx-auto" onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}>
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="monthly" className="data-[state=active]:bg-white data-[state=active]:text-awfar-primary">شهري</TabsTrigger>
                <TabsTrigger value="yearly" className="data-[state=active]:bg-white data-[state=active]:text-awfar-primary">
                  سنوي <span className="text-xs bg-awfar-accent text-white rounded-full px-2 py-0.5 ml-2">خصم 20%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>
        
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={`rounded-xl overflow-hidden transform transition-all duration-300 hover:translate-y-[-5px] ${
                    plan.popular 
                      ? 'shadow-xl border-2 border-awfar-accent relative md:-mt-6 bg-white' 
                      : 'shadow-md bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-awfar-accent text-white text-center py-2">
                      <span className="font-medium">الأكثر شيوعاً</span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 text-center">{plan.name}</h3>
                    <p className="text-gray-600 text-center mb-6">{plan.description}</p>
                    
                    <div className="text-center mb-6">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-2">ريال / {billingCycle === 'monthly' ? 'شهرياً' : 'سنوياً'}</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={plan.popular 
                        ? "w-full bg-awfar-primary hover:bg-awfar-primary/90" 
                        : "w-full"}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">تحتاج إلى حل مخصص؟</h2>
              <p className="text-gray-600 mb-8">
                نقدم حلولًا مخصصة للشركات الكبيرة مع متطلبات فريدة. تواصل مع فريق المبيعات لمعرفة كيف يمكننا مساعدتك.
              </p>
              <Button size="lg">تواصل مع فريق المبيعات</Button>
            </div>
          </div>
        </section>
        
        <PricingComparison />
        
        <section className="py-20 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">الأسئلة الشائعة</h2>
            
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                {
                  q: "هل يمكنني تغيير خطتي في أي وقت؟",
                  a: "نعم، يمكنك الترقية أو تخفيض خطتك في أي وقت. سيتم تعديل الرسوم بشكل تناسبي."
                },
                {
                  q: "كيف تعمل الردود الشهرية؟",
                  a: "الرد الواحد هو أي رسالة يرسلها النظام للعميل. تتجدد حصة الردود في بداية كل دورة فوترة."
                },
                {
                  q: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
                  a: "نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم إضافية."
                },
                {
                  q: "ما هي قنوات التواصل المدعومة؟",
                  a: "نحن ندعم WhatsApp Business، Facebook Messenger، Instagram DM، والمزيد."
                }
              ].map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold mb-3">{item.q}</h3>
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
