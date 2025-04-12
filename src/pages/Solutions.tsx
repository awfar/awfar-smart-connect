
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Globe, Users, Shield, Server } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const Solutions = () => {
  const solutions = [
    {
      id: 1,
      title: 'حل إدارة علاقات العملاء',
      description: 'منصة متكاملة لإدارة جميع تفاعلات العملاء وبناء علاقات طويلة الأمد معهم',
      icon: <Users className="h-12 w-12 text-primary" />,
      benefits: [
        'توحيد بيانات العملاء من جميع القنوات',
        'متابعة تاريخ التفاعلات والمبيعات',
        'تقارير وتحليلات متقدمة',
        'إدارة الفرص والصفقات المحتملة'
      ]
    },
    {
      id: 2,
      title: 'حل مركز الاتصال الذكي',
      description: 'مركز اتصال متكامل مدعوم بتقنيات الذكاء الاصطناعي لتحسين تجربة العملاء',
      icon: <Zap className="h-12 w-12 text-primary" />,
      benefits: [
        'الرد التلقائي على الاستفسارات الشائعة',
        'توزيع ذكي للمكالمات على الموظفين',
        'تحليل المكالمات وتقييم الأداء',
        'تكامل مع أنظمة إدارة علاقات العملاء'
      ]
    },
    {
      id: 3,
      title: 'حل التجارة الإلكترونية الشامل',
      description: 'منصة متكاملة للتجارة الإلكترونية مع دعم للمبيعات والتسويق وخدمة العملاء',
      icon: <Globe className="h-12 w-12 text-primary" />,
      benefits: [
        'تكامل مع قنوات البيع المختلفة',
        'إدارة المخزون والطلبات بشكل متكامل',
        'أنظمة دفع متعددة وآمنة',
        'تجربة مستخدم سلسة وسريعة'
      ]
    },
    {
      id: 4,
      title: 'حل الأمن والحماية',
      description: 'أنظمة حماية متطورة لضمان أمن البيانات وخصوصية العملاء',
      icon: <Shield className="h-12 w-12 text-primary" />,
      benefits: [
        'تشفير البيانات بأحدث التقنيات',
        'حماية متكاملة من الاختراقات',
        'أنظمة مراقبة وتنبيه فورية',
        'امتثال كامل للمعايير العالمية للخصوصية'
      ]
    },
    {
      id: 5,
      title: 'حل البنية التحتية السحابية',
      description: 'بنية تحتية سحابية متطورة لضمان أداء عالي وتوافرية مستمرة',
      icon: <Server className="h-12 w-12 text-primary" />,
      benefits: [
        'خوادم عالية الأداء والموثوقية',
        'نسخ احتياطية تلقائية ومنتظمة',
        'قابلية التوسع حسب الحاجة',
        'دعم فني على مدار الساعة'
      ]
    }
  ];

  const industries = [
    { name: 'التجزئة والتجارة الإلكترونية', users: '1200+' },
    { name: 'الخدمات المالية والمصرفية', users: '800+' },
    { name: 'الرعاية الصحية', users: '650+' },
    { name: 'التعليم والتدريب', users: '920+' },
    { name: 'السياحة والفنادق', users: '780+' },
    { name: 'العقارات والإنشاءات', users: '550+' },
    { name: 'المطاعم وخدمات الطعام', users: '1100+' },
    { name: 'الاتصالات وتقنية المعلومات', users: '950+' }
  ];

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-bold mb-6">الحلول الشاملة</h1>
              <p className="text-xl text-gray-700 mb-8">
                نقدم حلولاً متكاملة ومصممة خصيصاً لتلبية احتياجات عملك وتحسين تجربة عملائك
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/demo">
                  طلب عرض توضيحي <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.slice(0, 3).map(solution => (
                <div key={solution.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="p-8">
                    <div className="flex justify-center mb-6">
                      <div className="p-3 bg-primary/10 rounded-full">
                        {solution.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-4">{solution.title}</h3>
                    <p className="text-gray-600 text-center mb-6">{solution.description}</p>
                    <ul className="space-y-3">
                      {solution.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                    <Button asChild variant="link" className="w-full justify-center">
                      <Link to="/demo" className="flex items-center gap-2">
                        تعرف على المزيد <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">حلول مخصصة لمختلف الصناعات</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  لدينا خبرة واسعة في تقديم حلول مخصصة تناسب احتياجات مختلف القطاعات والصناعات، مدعومة بفهم عميق لمتطلبات كل قطاع وتحدياته.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {industries.map((industry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{industry.name}</p>
                        <p className="text-sm text-gray-500">{industry.users} عميل</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild>
                  <Link to="/demo">اطلب استشارة مجانية</Link>
                </Button>
              </div>
              <div>
                <img 
                  src="/public/placeholder.svg" 
                  alt="حلول مخصصة للصناعات" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">المزيد من الحلول المتكاملة</h2>
              <p className="text-lg text-gray-600">
                حلول متكاملة أخرى تساعد عملك على النمو والتطور
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {solutions.slice(3, 5).map(solution => (
                <div key={solution.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="p-8">
                    <div className="flex justify-center mb-6">
                      <div className="p-3 bg-primary/10 rounded-full">
                        {solution.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-4">{solution.title}</h3>
                    <p className="text-gray-600 text-center mb-6">{solution.description}</p>
                    <ul className="space-y-3">
                      {solution.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                    <Button asChild variant="link" className="w-full justify-center">
                      <Link to="/demo" className="flex items-center gap-2">
                        تعرف على المزيد <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-awfar-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">نجاحك هو هدفنا</h2>
                <p className="text-xl mb-8">
                  نحن ملتزمون بتوفير حلول مبتكرة وفعالة تساعدك على تحقيق أهدافك وتجاوز توقعات عملائك.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-lg">فريق متخصص من الخبراء لدعمك</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-lg">حلول مخصصة حسب احتياجاتك</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-lg">تقنيات متطورة وقابلة للتطوير</span>
                  </div>
                </div>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/about-us">تعرف على فريقنا</Link>
                </Button>
              </div>
              <div>
                <img 
                  src="/public/placeholder.svg" 
                  alt="فريق أوفر" 
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Solutions;
