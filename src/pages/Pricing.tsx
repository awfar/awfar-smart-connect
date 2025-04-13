
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  
  const features = {
    basic: [
      { name: "عدد الرسائل", value: "٢٠٠٠ رسالة شهريا", included: true },
      { name: "قنوات التواصل", value: "قناة واحدة", included: true },
      { name: "الوكيل الذكي", value: "نموذج أساسي", included: true },
      { name: "مدة الاستجابة", value: "٢-٣ ثوان", included: true },
      { name: "إحصائيات وتقارير", value: "أساسية", included: true },
      { name: "تخصيص الوكيل", value: "محدود", included: true },
      { name: "دعم فني", value: "بريد إلكتروني", included: true },
      { name: "تكامل مع الأنظمة", value: "", included: false },
      { name: "إدارة المبيعات", value: "", included: false },
    ],
    pro: [
      { name: "عدد الرسائل", value: "١٠,٠٠٠ رسالة شهريا", included: true },
      { name: "قنوات التواصل", value: "٣ قنوات", included: true },
      { name: "الوكيل الذكي", value: "نموذج متقدم", included: true },
      { name: "مدة الاستجابة", value: "أقل من ثانية", included: true },
      { name: "إحصائيات وتقارير", value: "متقدمة", included: true },
      { name: "تخصيص الوكيل", value: "كامل", included: true },
      { name: "دعم فني", value: "بريد إلكتروني + شات", included: true },
      { name: "تكامل مع الأنظمة", value: "نظامين", included: true },
      { name: "إدارة المبيعات", value: "أساسية", included: true },
    ],
    business: [
      { name: "عدد الرسائل", value: "غير محدود", included: true },
      { name: "قنوات التواصل", value: "غير محدود", included: true },
      { name: "الوكيل الذكي", value: "نموذج احترافي", included: true },
      { name: "مدة الاستجابة", value: "فورية", included: true },
      { name: "إحصائيات وتقارير", value: "مخصصة", included: true },
      { name: "تخصيص الوكيل", value: "كامل مع تدريب مخصص", included: true },
      { name: "دعم فني", value: "دعم مخصص على مدار الساعة", included: true },
      { name: "تكامل مع الأنظمة", value: "غير محدود", included: true },
      { name: "إدارة المبيعات", value: "متكاملة", included: true },
    ],
  };

  const pricing = {
    monthly: {
      basic: 299,
      pro: 799,
      business: 1999,
    },
    annual: {
      basic: 249,
      pro: 649,
      business: 1699,
    },
  };

  const planColors = {
    basic: {
      bg: 'bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-200',
      text: 'text-blue-700'
    },
    pro: {
      bg: 'bg-gradient-to-b from-awfar-primary to-awfar-secondary',
      button: 'bg-white text-awfar-primary hover:bg-white/90',
      border: 'border-awfar-primary',
      text: 'text-white'
    },
    business: {
      bg: 'bg-gray-900',
      button: 'bg-awfar-accent hover:bg-awfar-accent/90',
      border: 'border-gray-700',
      text: 'text-white'
    },
  };

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block mb-3 px-3 py-1 bg-awfar-primary/10 rounded-full text-awfar-primary font-medium">
                باقات الاشتراك
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">خطط أسعار بسيطة وشفافة</h1>
              <p className="text-xl text-gray-600 mb-8">
                اختر الخطة المناسبة لاحتياجات عملك واستمتع بقوة الذكاء الاصطناعي في خدمة العملاء
              </p>
              
              <div className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-white shadow'
                      : 'text-gray-600'
                  }`}
                >
                  شهري
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === 'annual'
                      ? 'bg-white shadow'
                      : 'text-gray-600'
                  }`}
                >
                  سنوي
                  <span className="mr-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    خصم 20%
                  </span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Basic Plan */}
              <Card className={`overflow-hidden border ${planColors.basic.border} shadow-lg relative`}>
                <div className={`p-6 ${planColors.basic.bg}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${planColors.basic.text}`}>الباقة الأساسية</h3>
                  <p className="text-gray-600 mb-4">مثالية للشركات الصغيرة</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{pricing[billingCycle].basic}</span>
                    <span className="text-gray-500 mr-2">ر.س / شهرياً</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-sm text-gray-500 mt-1">تدفع {pricing[billingCycle].basic * 12} ر.س سنوياً</p>
                  )}
                </div>
                
                <div className="p-6">
                  <Button asChild className={`w-full mb-6 ${planColors.basic.button}`}>
                    <Link to="/register">ابدأ الآن</Link>
                  </Button>
                  
                  <ul className="space-y-4">
                    {features.basic.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mt-1 flex-shrink-0" />
                        )}
                        <div className="mr-3">
                          <div className="flex items-center">
                            <span className="text-gray-800 font-medium">{feature.name}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>معلومات إضافية عن {feature.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {feature.value && <p className="text-gray-600 text-sm">{feature.value}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
              
              {/* Pro Plan */}
              <Card className={`overflow-hidden border ${planColors.pro.border} shadow-lg relative scale-105 z-10`}>
                <div className="absolute top-0 left-0 w-full text-center">
                  <span className="bg-awfar-accent text-white text-sm font-medium px-4 py-1 rounded-b-md">
                    الأكثر شيوعاً
                  </span>
                </div>
                <div className={`p-6 pt-10 ${planColors.pro.bg}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${planColors.pro.text}`}>الباقة الاحترافية</h3>
                  <p className="text-white/80 mb-4">للشركات النامية</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{pricing[billingCycle].pro}</span>
                    <span className="text-white/80 mr-2">ر.س / شهرياً</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-sm text-white/70 mt-1">تدفع {pricing[billingCycle].pro * 12} ر.س سنوياً</p>
                  )}
                </div>
                
                <div className="p-6">
                  <Button asChild className={`w-full mb-6 ${planColors.pro.button}`}>
                    <Link to="/register">ابدأ الآن</Link>
                  </Button>
                  
                  <ul className="space-y-4">
                    {features.pro.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mt-1 flex-shrink-0" />
                        )}
                        <div className="mr-3">
                          <div className="flex items-center">
                            <span className="text-gray-800 font-medium">{feature.name}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>معلومات إضافية عن {feature.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {feature.value && <p className="text-gray-600 text-sm">{feature.value}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
              
              {/* Business Plan */}
              <Card className={`overflow-hidden border ${planColors.business.border} shadow-lg relative`}>
                <div className={`p-6 ${planColors.business.bg}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${planColors.business.text}`}>باقة الأعمال</h3>
                  <p className="text-gray-400 mb-4">للشركات والمؤسسات الكبيرة</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{pricing[billingCycle].business}</span>
                    <span className="text-gray-400 mr-2">ر.س / شهرياً</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-sm text-gray-400 mt-1">تدفع {pricing[billingCycle].business * 12} ر.س سنوياً</p>
                  )}
                </div>
                
                <div className="p-6">
                  <Button asChild className={`w-full mb-6 ${planColors.business.button}`}>
                    <Link to="/register">ابدأ الآن</Link>
                  </Button>
                  
                  <ul className="space-y-4">
                    {features.business.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mt-1 flex-shrink-0" />
                        )}
                        <div className="mr-3">
                          <div className="flex items-center">
                            <span className="text-gray-800 font-medium">{feature.name}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>معلومات إضافية عن {feature.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {feature.value && <p className="text-gray-600 text-sm">{feature.value}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
            
            <div className="bg-gray-100 rounded-xl p-8 text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">تحتاج إلى حل مخصص؟</h3>
              <p className="text-gray-600 mb-6">
                نقدم حلولًا مخصصة للشركات الكبيرة مع متطلبات فريدة. تواصل مع فريق المبيعات لمعرفة كيف يمكننا مساعدتك.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact" className="flex items-center gap-2">
                  تواصل مع فريق المبيعات
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">الأسئلة الشائعة</h2>
              <p className="text-gray-600">
                إجابات عن الأسئلة الأكثر شيوعًا حول باقاتنا وأسعارنا
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">هل هناك فترة تجريبية مجانية؟</h3>
                <p className="text-gray-700">
                  نعم، نقدم فترة تجريبية مجانية لمدة 14 يومًا لجميع الباقات. يمكنك تجربة كافة الميزات دون أي التزام مالي.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">هل يمكنني تغيير باقتي لاحقاً؟</h3>
                <p className="text-gray-700">
                  نعم، يمكنك الترقية أو تخفيض باقتك في أي وقت. سيتم احتساب الفرق في السعر تناسبياً.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">هل هناك رسوم إعداد أو تكاليف خفية؟</h3>
                <p className="text-gray-700">
                  لا، ما تراه هو ما تدفعه. لا توجد رسوم إعداد أو تكاليف خفية أخرى. جميع الأسعار شفافة وواضحة.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">ماذا يحدث إذا تجاوزت حدود الباقة؟</h3>
                <p className="text-gray-700">
                  إذا تجاوزت حدود باقتك، سنخبرك بذلك وستتمكن من الترقية إلى باقة أعلى أو شراء رسائل إضافية حسب الحاجة.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">هل يمكنني إلغاء اشتراكي في أي وقت؟</h3>
                <p className="text-gray-700">
                  نعم، يمكنك إلغاء اشتراكك في أي وقت. إذا كنت مشتركاً بخطة سنوية، سيتم رد المبلغ المتبقي بشكل تناسبي.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">هل تقدمون خصومات خاصة؟</h3>
                <p className="text-gray-700">
                  نعم، نقدم خصومات للمؤسسات التعليمية والمنظمات غير الربحية. اتصل بفريق المبيعات لمعرفة المزيد.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
