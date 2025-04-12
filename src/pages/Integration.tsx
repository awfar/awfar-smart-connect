
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Layers, Database, Share2, Lock, BarChart, Code } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Integration = () => {
  const integrations = [
    {
      id: 1,
      title: 'أنظمة إدارة علاقات العملاء',
      description: 'تكامل سلس مع أشهر أنظمة CRM مثل Salesforce وHubSpot وMicrosoft Dynamics',
      icon: <Layers className="h-8 w-8 text-primary" />,
      logos: ['/public/placeholder.svg', '/public/placeholder.svg', '/public/placeholder.svg']
    },
    {
      id: 2,
      title: 'أنظمة المحاسبة والفوترة',
      description: 'ربط مباشر مع أنظمة المحاسبة مثل QuickBooks وXero وFreshBooks',
      icon: <Database className="h-8 w-8 text-primary" />,
      logos: ['/public/placeholder.svg', '/public/placeholder.svg', '/public/placeholder.svg']
    },
    {
      id: 3,
      title: 'منصات التجارة الإلكترونية',
      description: 'تكامل مع منصات التجارة الإلكترونية مثل Shopify وWooCommerce وMagento',
      icon: <Share2 className="h-8 w-8 text-primary" />,
      logos: ['/public/placeholder.svg', '/public/placeholder.svg', '/public/placeholder.svg']
    },
    {
      id: 4,
      title: 'بوابات الدفع الإلكتروني',
      description: 'دعم لمختلف بوابات الدفع مثل Stripe وPayPal ومدى وApple Pay',
      icon: <Lock className="h-8 w-8 text-primary" />,
      logos: ['/public/placeholder.svg', '/public/placeholder.svg', '/public/placeholder.svg']
    },
    {
      id: 5,
      title: 'أدوات التحليل والتقارير',
      description: 'ربط مع منصات التحليل مثل Google Analytics وMixpanel وPower BI',
      icon: <BarChart className="h-8 w-8 text-primary" />,
      logos: ['/public/placeholder.svg', '/public/placeholder.svg', '/public/placeholder.svg']
    },
    {
      id: 6,
      title: 'واجهات برمجة التطبيقات المخصصة',
      description: 'إمكانية التكامل مع أي نظام عبر واجهات برمجة التطبيقات (APIs) المخصصة',
      icon: <Code className="h-8 w-8 text-primary" />,
      logos: ['/public/placeholder.svg', '/public/placeholder.svg', '/public/placeholder.svg']
    }
  ];

  const benefits = [
    {
      title: 'تكامل سريع وسلس',
      description: 'واجهات برمجة سهلة الاستخدام وإعداد سريع للتكامل'
    },
    {
      title: 'تزامن البيانات في الوقت الفعلي',
      description: 'مزامنة فورية للبيانات بين جميع الأنظمة المتكاملة'
    },
    {
      title: 'أمان عالي للبيانات',
      description: 'تشفير متقدم وحماية كاملة للبيانات أثناء النقل والتخزين'
    },
    {
      title: 'تخصيص مرن',
      description: 'إمكانية تخصيص التكامل حسب احتياجات عملك الفريدة'
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
                صمم بنية تكامل مرنة تربط منصة أوفر بجميع أنظمتك وتطبيقاتك الحالية بسلاسة ودون عناء
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/demo">
                  طلب استشارة فنية <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map(integration => (
                <Card key={integration.id} className="border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-50 p-3 rounded-full">
                        {integration.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-3">{integration.title}</h3>
                    <p className="text-gray-600 text-center mb-6">{integration.description}</p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                      {integration.logos.map((logo, idx) => (
                        <img key={idx} src={logo} alt="شعار الشركة" className="h-8 w-auto grayscale hover:grayscale-0 transition-all" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-6">واجهات برمجة تطبيقات قوية ومرنة</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  توفر منصة أوفر واجهات برمجة تطبيقات (APIs) قوية ومرنة تسمح لك بدمج منصتنا مع أي نظام أو تطبيق بسهولة. سواء كنت ترغب في نقل البيانات، أو تزامن المعلومات، أو إنشاء تكاملات مخصصة، فإن واجهات برمجة التطبيقات لدينا توفر لك المرونة والقوة التي تحتاجها.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>واجهات RESTful API سهلة الاستخدام</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>دعم لمختلف صيغ البيانات (JSON, XML)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>توثيق شامل وأمثلة تطبيقية</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>بيئة اختبار كاملة للتطوير</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>مكتبات ومجموعات أدوات للغات البرمجة الشائعة</span>
                  </li>
                </ul>
                <div className="flex gap-4">
                  <Button asChild>
                    <Link to="/demo">طلب العرض التقني</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      توثيق واجهات البرمجة
                    </a>
                  </Button>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="/public/placeholder.svg" 
                  alt="واجهات برمجة التطبيقات" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">مزايا التكامل مع أوفر</h2>
              <p className="text-lg text-gray-600">
                تم تصميم منصة أوفر لتوفير تكامل سلس وفعال مع مختلف الأنظمة والتطبيقات
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 mb-6">
                لدينا فريق متخصص من المهندسين جاهز لمساعدتك في تخطيط وتنفيذ التكامل المثالي لاحتياجات عملك
              </p>
              <Button asChild size="lg">
                <Link to="/demo">تحدث مع فريق التكامل</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-primary/10 rounded-lg p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">هل لديك نظام مخصص؟</h2>
                  <p className="text-lg mb-6">
                    يمكن لفريقنا التقني مساعدتك في تطوير تكامل مخصص يناسب احتياجاتك الفريدة، بغض النظر عن نوع الأنظمة التي تستخدمها.
                  </p>
                  <Button asChild>
                    <Link to="/demo">تواصل مع فريق التطوير</Link>
                  </Button>
                </div>
                <div className="hidden md:block text-center">
                  <Code className="h-24 w-24 text-primary mx-auto" />
                </div>
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
