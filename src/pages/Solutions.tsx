
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BriefcaseBusiness, Users, Building2, GraduationCap, Home, ShoppingBag, HeartPulse, PlaneTakeoff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Solutions = () => {
  const solutions = [
    {
      id: "crm",
      title: "إدارة علاقات العملاء",
      description: "نظام متكامل لإدارة علاقات العملاء مع دعم الذكاء الاصطناعي",
      features: [
        "متابعة وتسجيل جميع تفاعلات العملاء",
        "تقارير وتحليلات مفصلة لسلوك العملاء",
        "أتمتة مهام التسويق والمبيعات",
        "تكامل مع جميع قنوات التواصل"
      ]
    },
    {
      id: "marketing",
      title: "التسويق الذكي",
      description: "حلول تسويقية متكاملة مدعومة بالذكاء الاصطناعي",
      features: [
        "إنشاء حملات تسويقية مخصصة",
        "استهداف العملاء المحتملين بدقة",
        "تحليل فعالية الحملات وتحسينها",
        "أتمتة عمليات التسويق من البداية للنهاية"
      ]
    },
    {
      id: "sales",
      title: "إدارة المبيعات",
      description: "تحسين عمليات البيع وزيادة معدل التحويل",
      features: [
        "متابعة الصفقات من البداية وحتى الإغلاق",
        "توقع المبيعات بدقة باستخدام الذكاء الاصطناعي",
        "إدارة العملاء المحتملين وتصنيفهم",
        "تقارير مبيعات شاملة وتحليلات متقدمة"
      ]
    },
    {
      id: "service",
      title: "خدمة العملاء",
      description: "تقديم تجربة استثنائية لعملائك",
      features: [
        "منصة موحدة لدعم العملاء عبر جميع القنوات",
        "نظام تذاكر ذكي مدعوم بالذكاء الاصطناعي",
        "قاعدة معرفة شاملة وإجابات آلية",
        "قياس رضا العملاء وتحسين الخدمة"
      ]
    }
  ];
  
  const industries = [
    { 
      id: "retail", 
      name: "التجزئة والتجارة الإلكترونية", 
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      benefits: [
        "زيادة المبيعات عبر الإنترنت",
        "تجربة تسوق شخصية",
        "دعم عملاء على مدار الساعة",
        "إدارة المخزون بكفاءة"
      ]
    },
    { 
      id: "realestate", 
      name: "العقارات", 
      icon: <Building2 className="h-8 w-8 text-primary" />,
      benefits: [
        "جذب عملاء محتملين مؤهلين",
        "إدارة عروض العقارات",
        "أتمتة عمليات الحجز والمعاينة",
        "تتبع حالة الصفقات العقارية"
      ]
    },
    { 
      id: "healthcare", 
      name: "الرعاية الصحية", 
      icon: <HeartPulse className="h-8 w-8 text-primary" />,
      benefits: [
        "حجز المواعيد وإدارتها",
        "متابعة حالة المرضى",
        "تذكيرات آلية للمواعيد",
        "تكامل مع أنظمة المستشفيات"
      ]
    },
    { 
      id: "education", 
      name: "التعليم", 
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      benefits: [
        "إدارة العلاقة مع الطلاب",
        "أتمتة عمليات القبول والتسجيل",
        "دعم الطلاب على مدار الساعة",
        "تتبع أداء الطلاب وتقدمهم"
      ]
    },
    { 
      id: "hospitality", 
      name: "الضيافة والفنادق", 
      icon: <Home className="h-8 w-8 text-primary" />,
      benefits: [
        "إدارة الحجوزات بكفاءة",
        "تخصيص تجربة الضيوف",
        "الرد الفوري على استفسارات العملاء",
        "تحسين معدل رضا العملاء"
      ]
    },
    { 
      id: "travel", 
      name: "السفر والسياحة", 
      icon: <PlaneTakeoff className="h-8 w-8 text-primary" />,
      benefits: [
        "إدارة الحجوزات والرحلات",
        "عروض سفر مخصصة",
        "دعم العملاء أثناء السفر",
        "تتبع المبيعات والعروض"
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
              <h1 className="text-4xl font-bold mb-6">الحلول الشاملة لعملك</h1>
              <p className="text-xl text-gray-700 mb-8">
                منصة أوفر توفر مجموعة متكاملة من الحلول لإدارة علاقات العملاء، المبيعات، التسويق، وخدمة العملاء في منصة واحدة
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/demo">
                  طلب عرض توضيحي <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {solutions.map(solution => (
                <Card key={solution.id} className="border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-semibold mb-4">{solution.title}</h3>
                    <p className="text-gray-600 mb-6">{solution.description}</p>
                    <ul className="space-y-3">
                      {solution.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full gap-1">
                      <Link to={`/solutions/${solution.id}`}>
                        اكتشف المزيد <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">حلول مخصصة لكل قطاع</h2>
              <p className="text-lg text-gray-600 mb-8">
                فهم متطلبات قطاعك وتوفير حلول مصممة خصيصًا لتلبية احتياجاتك
              </p>
            </div>
            
            <Tabs defaultValue={industries[0].id} className="w-full">
              <TabsList className="w-full flex-wrap h-auto mb-8">
                {industries.map(industry => (
                  <TabsTrigger key={industry.id} value={industry.id} className="flex-1 py-3">
                    <div className="flex flex-col items-center gap-1">
                      {industry.icon}
                      <span>{industry.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {industries.map(industry => (
                <TabsContent key={industry.id} value={industry.id}>
                  <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="mb-6">
                          {industry.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4">حلول {industry.name}</h3>
                        <p className="text-gray-600 mb-6">
                          حلول متكاملة مصممة خصيصًا لتلبية احتياجات قطاع {industry.name} وتحسين أداء عملك
                        </p>
                        <ul className="space-y-3">
                          {industry.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8">
                          <Button asChild className="gap-2">
                            <Link to={`/solutions/industries/${industry.id}`}>
                              اكتشف الحلول <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <BriefcaseBusiness className="h-16 w-16 text-primary mx-auto mb-4" />
                          <p className="text-lg font-medium">صورة توضيحية لحلول {industry.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">نهج شامل لنمو عملك</h2>
                  <p className="text-gray-700 mb-8">
                    مع أوفر، ستحصل على منصة متكاملة تغطي جميع جوانب إدارة علاقات العملاء والمبيعات والتسويق وخدمة العملاء، مما يساعدك على تحقيق نمو مستدام لعملك.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center shadow-md mb-4">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">فهم العملاء</h3>
                      <p className="text-sm text-gray-600">رؤى عميقة حول سلوك وتفضيلات عملائك</p>
                    </div>
                    <div>
                      <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center shadow-md mb-4">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">زيادة المبيعات</h3>
                      <p className="text-sm text-gray-600">تحسين معدل التحويل وزيادة قيمة الصفقات</p>
                    </div>
                    <div>
                      <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center shadow-md mb-4">
                        <BriefcaseBusiness className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">نمو الأعمال</h3>
                      <p className="text-sm text-gray-600">استراتيجيات متكاملة لتوسيع نطاق عملك</p>
                    </div>
                    <div>
                      <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center shadow-md mb-4">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">رضا العملاء</h3>
                      <p className="text-sm text-gray-600">تحسين تجربة العميل وزيادة الولاء</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block h-full">
                  <img 
                    src="/public/placeholder.svg" 
                    alt="نمو الأعمال" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">حالات نجاح من عملائنا</h2>
              <p className="text-lg text-gray-600">
                اطلع على قصص نجاح شركات مختلفة حققت نتائج استثنائية مع حلول أوفر
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">شركة التجارة الإلكترونية X</h3>
                  <p className="text-gray-600 mb-4">زيادة المبيعات بنسبة 45% بعد 6 أشهر من استخدام منصة أوفر</p>
                  <blockquote className="italic text-gray-700 border-r-4 border-primary pr-4">
                    "ساعدتنا حلول أوفر في تحسين تفاعلنا مع العملاء وتوحيد قنوات المبيعات، مما أدى إلى زيادة كبيرة في المبيعات والإيرادات."
                  </blockquote>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">شركة العقارات Y</h3>
                  <p className="text-gray-600 mb-4">تحسين معدل تحويل العملاء المحتملين بنسبة 60% وزيادة المبيعات</p>
                  <blockquote className="italic text-gray-700 border-r-4 border-primary pr-4">
                    "مكنتنا منصة أوفر من إدارة عملائنا المحتملين بشكل أفضل وتتبع جميع التفاعلات، مما ساهم في زيادة مبيعاتنا بشكل كبير."
                  </blockquote>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                    <HeartPulse className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">مركز طبي Z</h3>
                  <p className="text-gray-600 mb-4">تقليل نسبة الغياب عن المواعيد بنسبة 70% وتحسين رضا المرضى</p>
                  <blockquote className="italic text-gray-700 border-r-4 border-primary pr-4">
                    "ساعدنا نظام إدارة المواعيد والتذكيرات الآلية من أوفر في تقليل نسبة الغياب وتحسين كفاءة العمل في المركز."
                  </blockquote>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/case-studies">
                  اطلع على المزيد من قصص النجاح <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Solutions;
