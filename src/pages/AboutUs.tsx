
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Award, Star, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "أحمد محمد",
      position: "المؤسس والرئيس التنفيذي",
      image: "/public/placeholder.svg",
      bio: "خبرة أكثر من 15 عامًا في مجال تقنية المعلومات وحلول الأعمال، قاد العديد من المشاريع الناجحة في مجال خدمة العملاء والذكاء الاصطناعي."
    },
    {
      id: 2,
      name: "سارة علي",
      position: "المدير التنفيذي للتكنولوجيا",
      image: "/public/placeholder.svg",
      bio: "متخصصة في تطوير حلول الذكاء الاصطناعي ومعالجة اللغات الطبيعية، عملت سابقًا في شركات عالمية مثل Google وMicrosoft."
    },
    {
      id: 3,
      name: "محمد عبدالله",
      position: "مدير المنتجات",
      image: "/public/placeholder.svg",
      bio: "خبير في تطوير المنتجات وتحسين تجربة المستخدم، عمل على تطوير العديد من المنتجات الناجحة في مجال البرمجيات كخدمة (SaaS)."
    },
    {
      id: 4,
      name: "نورة الأحمد",
      position: "مديرة التسويق",
      image: "/public/placeholder.svg",
      bio: "متخصصة في التسويق الرقمي واستراتيجيات النمو، ساهمت في نجاح العديد من الشركات الناشئة في المنطقة العربية."
    },
    {
      id: 5,
      name: "خالد العلي",
      position: "مدير تطوير الأعمال",
      image: "/public/placeholder.svg",
      bio: "خبير في تطوير الأعمال والشراكات الاستراتيجية، عمل على توسيع العديد من الشركات في الشرق الأوسط وشمال أفريقيا."
    },
    {
      id: 6,
      name: "ليلى محمود",
      position: "مديرة خدمة العملاء",
      image: "/public/placeholder.svg",
      bio: "متخصصة في تحسين تجربة العملاء وبناء علاقات قوية معهم، بخبرة تزيد عن 10 سنوات في مجال خدمة العملاء."
    }
  ];
  
  const offices = [
    {
      id: 1,
      city: "الرياض",
      country: "المملكة العربية السعودية",
      address: "طريق الملك فهد، حي العليا، الرياض",
      image: "/public/placeholder.svg"
    },
    {
      id: 2,
      city: "دبي",
      country: "الإمارات العربية المتحدة",
      address: "مركز دبي المالي العالمي، شارع الشيخ زايد، دبي",
      image: "/public/placeholder.svg"
    },
    {
      id: 3,
      city: "القاهرة",
      country: "مصر",
      address: "القرية الذكية، طريق مصر اسكندرية الصحراوي، الجيزة",
      image: "/public/placeholder.svg"
    }
  ];
  
  const values = [
    {
      title: "الابتكار",
      description: "نسعى دائمًا لتقديم حلول مبتكرة تلبي احتياجات عملائنا وتتجاوز توقعاتهم",
      icon: <Star className="h-8 w-8 text-primary" />
    },
    {
      title: "التميز",
      description: "نلتزم بتقديم أعلى مستويات الجودة في جميع منتجاتنا وخدماتنا",
      icon: <Award className="h-8 w-8 text-primary" />
    },
    {
      title: "العميل أولاً",
      description: "نضع احتياجات عملائنا في مقدمة أولوياتنا ونعمل على تحقيق نجاحهم",
      icon: <Users className="h-8 w-8 text-primary" />
    },
    {
      title: "النزاهة",
      description: "نعمل بشفافية ونزاهة في جميع تعاملاتنا مع العملاء والشركاء والموظفين",
      icon: <Target className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-6">من نحن</h1>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  أوفر هي شركة رائدة في مجال تقنية المعلومات، متخصصة في تطوير حلول ذكية لإدارة علاقات العملاء والمبيعات والتسويق، مدعومة بتقنيات الذكاء الاصطناعي المتقدمة.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  تأسست الشركة في عام 2018 بهدف مساعدة الشركات على تحسين تواصلها مع العملاء وزيادة مبيعاتها من خلال الاستفادة من أحدث التقنيات.
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/careers">
                    انضم إلى فريقنا <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div>
                <img 
                  src="/public/placeholder.svg" 
                  alt="فريق أوفر" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">رؤيتنا ومهمتنا</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">رؤيتنا</h3>
                <p className="text-lg leading-relaxed">
                  أن نكون الشريك الأول للشركات في المنطقة العربية في مجال الحلول الذكية لإدارة علاقات العملاء، وأن نساهم في تمكين الشركات من تحقيق النمو المستدام والنجاح من خلال تقديم تجارب استثنائية لعملائها.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">مهمتنا</h3>
                <p className="text-lg leading-relaxed">
                  تمكين الشركات من تحسين تواصلها مع العملاء وزيادة مبيعاتها من خلال توفير حلول ذكية مدعومة بتقنيات الذكاء الاصطناعي المتقدمة، وتقديم خدمات استثنائية تساعدها على تحقيق أهدافها.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">قيمنا</h2>
              <p className="text-lg text-gray-600">
                القيم التي توجه عملنا وتشكل ثقافتنا وتحدد تفاعلنا مع العملاء والشركاء والموظفين
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-none shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">فريقنا</h2>
              <p className="text-lg text-gray-600">
                نحن فريق من المتخصصين والمبدعين الملتزمين بتقديم أفضل الحلول لعملائنا
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map(member => (
                <Card key={member.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-100">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-4">{member.position}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">مكاتبنا</h2>
              <p className="text-lg text-gray-600">
                نتواجد في عدة مدن رئيسية في المنطقة العربية لنكون قريبين من عملائنا
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map(office => (
                <Card key={office.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-100">
                      <img 
                        src={office.image} 
                        alt={office.city} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-bold">{office.city}, {office.country}</h3>
                      </div>
                      <p className="text-gray-600">{office.address}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-primary/10 rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">انضم إلى فريقنا</h2>
                  <p className="text-gray-700 mb-8">
                    نحن دائمًا نبحث عن مواهب جديدة للانضمام إلى فريقنا المتنامي. إذا كنت متحمسًا للابتكار وترغب في المساهمة في نجاح عملائنا، فنحن نرحب بك للانضمام إلينا.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="bg-primary/10 p-1 rounded-full">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">بيئة عمل محفزة</h3>
                        <p className="text-sm text-gray-500">نوفر بيئة عمل إيجابية تشجع على الإبداع والابتكار</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="bg-primary/10 p-1 rounded-full">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">فرص تطوير مهنية</h3>
                        <p className="text-sm text-gray-500">نقدم فرصًا للنمو والتطور المهني المستمر</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="bg-primary/10 p-1 rounded-full">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">مزايا تنافسية</h3>
                        <p className="text-sm text-gray-500">حزمة مزايا شاملة تشمل التأمين الصحي والمكافآت</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button asChild size="lg" className="gap-2">
                      <Link to="/careers">
                        استعرض الوظائف المتاحة <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block h-full">
                  <img 
                    src="/public/placeholder.svg" 
                    alt="انضم إلى فريقنا" 
                    className="w-full h-full object-cover"
                  />
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

export default AboutUs;
