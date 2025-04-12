
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers, RefreshCw, Zap, Code, Globe, PencilRuler } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Integration = () => {
  const integrationSystems = [
    {
      id: "crm",
      name: "أنظمة إدارة علاقات العملاء",
      description: "تكامل سلس مع أنظمة CRM الشائعة مثل Salesforce وHubSpot وZoho",
      features: [
        "مزامنة بيانات العملاء وتفاعلاتهم",
        "مشاركة السجلات والمعاملات",
        "تحديث البيانات في الوقت الفعلي",
        "تكامل مع سير العمل والأتمتة"
      ]
    },
    {
      id: "ecommerce",
      name: "منصات التجارة الإلكترونية",
      description: "تكامل مع منصات التجارة الإلكترونية الشهيرة مثل Shopify وWooCommerce",
      features: [
        "مزامنة طلبات العملاء والمنتجات",
        "إدارة المخزون والمبيعات",
        "متابعة سلوك التصفح والشراء",
        "تشغيل حملات التسويق المخصصة"
      ]
    },
    {
      id: "erp",
      name: "أنظمة تخطيط موارد المؤسسات",
      description: "تكامل مع أنظمة ERP مثل SAP وOracle وMicrosoft Dynamics",
      features: [
        "مزامنة بيانات العملاء والمبيعات",
        "تكامل مع نظام الفوترة والمحاسبة",
        "إدارة سلسلة التوريد",
        "تقارير أعمال شاملة ومتكاملة"
      ]
    },
    {
      id: "marketing",
      name: "أنظمة التسويق",
      description: "تكامل مع أدوات التسويق مثل Mailchimp وGoogle Analytics",
      features: [
        "تنسيق حملات التسويق والإعلان",
        "تتبع أداء الحملات",
        "استهداف العملاء المحتملين",
        "قياس عائد الاستثمار التسويقي"
      ]
    },
    {
      id: "helpdesk",
      name: "أنظمة دعم العملاء",
      description: "تكامل مع أنظمة خدمة العملاء مثل Zendesk وFreshdesk",
      features: [
        "توحيد تذاكر الدعم والاستفسارات",
        "متابعة حالة طلبات الدعم",
        "قياس أداء فريق الدعم",
        "تحسين زمن الاستجابة ورضا العملاء"
      ]
    },
    {
      id: "custom",
      name: "أنظمة مخصصة",
      description: "تكامل مع الأنظمة المخصصة الخاصة بعملك",
      features: [
        "واجهة برمجة تطبيقات (API) قوية ومرنة",
        "تطوير حلول تكامل مخصصة",
        "دعم فني للتكامل مع الأنظمة الحالية",
        "تحديثات منتظمة لضمان استمرارية التكامل"
      ]
    }
  ];

  const integrationMethods = [
    {
      id: "api",
      title: "واجهة برمجة التطبيقات (API)",
      icon: <Code className="h-8 w-8 text-primary" />,
      description: "واجهة برمجة تطبيقات RESTful حديثة وشاملة تتيح التكامل بمرونة مع أنظمتك",
      benefits: [
        "توثيق API شامل وسهل الاستخدام",
        "دعم OAuth 2.0 للمصادقة الآمنة",
        "معدلات طلب عالية لدعم التطبيقات ذات الأحمال العالية",
        "نماذج وأدوات تطوير متاحة للتسريع"
      ]
    },
    {
      id: "webhook",
      title: "Webhooks",
      icon: <RefreshCw className="h-8 w-8 text-primary" />,
      description: "استلام إشعارات فورية عند حدوث أحداث معينة في النظام",
      benefits: [
        "استجابة فورية للتغييرات والأحداث",
        "تكامل في الوقت الفعلي مع أنظمتك",
        "إمكانية تخصيص أنواع الأحداث المرسلة",
        "تنفيذ استراتيجيات سير عمل متقدمة"
      ]
    },
    {
      id: "sdk",
      title: "مجموعات تطوير البرمجيات (SDKs)",
      icon: <Layers className="h-8 w-8 text-primary" />,
      description: "مكتبات برمجية جاهزة للاستخدام بلغات برمجة متعددة",
      benefits: [
        "SDKs للغات برمجة متعددة (JavaScript، Java، Python، PHP)",
        "واجهات برمجية بسيطة وسهلة الاستخدام",
        "تعامل تلقائي مع إدارة الجلسات والمصادقة",
        "تحديثات منتظمة تتماشى مع تطور API"
      ]
    },
    {
      id: "plugins",
      title: "المكونات الإضافية والوصلات",
      icon: <PencilRuler className="h-8 w-8 text-primary" />,
      description: "مكونات إضافية جاهزة للتكامل مع المنصات الشائعة",
      benefits: [
        "تكامل سريع مع منصات شائعة مثل Shopify وWordPress",
        "إعدادات بسيطة لا تتطلب مهارات برمجية",
        "تكامل مباشر دون الحاجة إلى تطوير مخصص",
        "تحديثات تلقائية للمكونات الإضافية"
      ]
    },
    {
      id: "custom",
      title: "حلول تكامل مخصصة",
      icon: <Globe className="h-8 w-8 text-primary" />,
      description: "تطوير حلول تكامل مخصصة تناسب متطلبات عملك الفريدة",
      benefits: [
        "فريق متخصص لتقييم احتياجات التكامل",
        "تطوير حلول مخصصة مناسبة لبنية النظام الخاص بك",
        "دعم كامل أثناء عملية التكامل والاختبار",
        "صيانة مستمرة لضمان استمرارية التكامل"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-bold mb-6">تكامل سلس مع جميع أنظمتك</h1>
              <p className="text-xl text-gray-700 mb-8">
                منصة أوفر مصممة للتكامل بسهولة مع الأنظمة والمنصات التي تستخدمها بالفعل
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/demo">
                  طلب عرض توضيحي <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">تكامل سريع</h3>
                <p className="text-gray-600">
                  تكامل سهل وسريع مع الأنظمة الحالية وإعداد في غضون أيام فقط
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Layers className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">منصة مفتوحة</h3>
                <p className="text-gray-600">
                  واجهات برمجة تطبيقات (APIs) مفتوحة وموثقة بشكل كامل للتكامل المرن
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <RefreshCw className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">تزامن ثنائي الاتجاه</h3>
                <p className="text-gray-600">
                  مزامنة البيانات في الوقت الفعلي بين أوفر وأنظمتك الأخرى
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">تكامل مع الأنظمة الأكثر استخدامًا</h2>
              <p className="text-lg text-gray-600">
                توفر منصة أوفر تكاملًا سهلًا مع مجموعة واسعة من أنظمة الأعمال والتطبيقات
              </p>
            </div>
            
            <Tabs defaultValue="crm" className="w-full">
              <TabsList className="w-full flex-wrap h-auto mb-8">
                {integrationSystems.map(system => (
                  <TabsTrigger key={system.id} value={system.id} className="flex-1 py-3">
                    {system.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {integrationSystems.map(system => (
                <TabsContent key={system.id} value={system.id}>
                  <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">{system.name}</h3>
                    <p className="text-gray-600 mb-6">{system.description}</p>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold mb-4">المزايا الرئيسية</h4>
                        <ul className="space-y-3">
                          {system.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <Button asChild className="gap-2">
                            <Link to="/demo">
                              طلب عرض توضيحي <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <Layers className="h-16 w-16 text-primary mx-auto mb-4" />
                          <p className="text-lg font-medium">صورة توضيحية للتكامل مع {system.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">طرق التكامل المتاحة</h2>
              <p className="text-lg text-gray-600">
                نوفر مجموعة متنوعة من الطرق للتكامل مع منصة أوفر لتناسب احتياجات عملك
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {integrationMethods.map(method => (
                <Card key={method.id} className="border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-50 p-3 rounded-full">
                        {method.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-4">{method.title}</h3>
                    <p className="text-gray-600 text-center mb-6">{method.description}</p>
                    <ul className="space-y-2">
                      {method.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 flex-shrink-0">
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                              <svg width="8" height="8" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">فريق دعم متخصص للتكامل</h2>
                  <p className="text-gray-700 mb-8">
                    فريقنا المتخصص جاهز لمساعدتك في عملية التكامل من البداية إلى النهاية، ضمان نجاح المشروع وتشغيله بسلاسة.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold">تقييم احتياجات التكامل</h3>
                        <p className="text-sm text-gray-600">تحليل متطلبات عملك وتحديد أفضل استراتيجية للتكامل</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold">خطة تنفيذ مفصلة</h3>
                        <p className="text-sm text-gray-600">وضع خطة عمل واضحة مع جدول زمني للتنفيذ والاختبار</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold">تنفيذ وتخصيص</h3>
                        <p className="text-sm text-gray-600">تنفيذ الحل وتخصيصه ليتناسب مع احتياجات عملك</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold">اختبار وتدريب</h3>
                        <p className="text-sm text-gray-600">اختبار شامل للتكامل وتدريب فريقك على استخدام النظام</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold">دعم مستمر</h3>
                        <p className="text-sm text-gray-600">دعم فني مستمر وتحديثات منتظمة لضمان استمرارية التكامل</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="hidden md:block h-full">
                  <img 
                    src="/public/placeholder.svg" 
                    alt="فريق دعم التكامل" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">جاهز للبدء بالتكامل؟</h2>
              <p className="text-lg text-gray-600 mb-8">
                تواصل مع فريقنا اليوم للحصول على استشارة مجانية حول كيفية تكامل منصة أوفر مع أنظمتك الحالية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/demo">
                    طلب عرض توضيحي <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:integration@awfar.com">تواصل مع فريق التكامل</a>
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

export default Integration;
