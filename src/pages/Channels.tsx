
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Mail, Instagram, Twitter, Facebook, Globe, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Channels = () => {
  const channels = [
    {
      id: 1,
      title: 'المحادثات المباشرة',
      description: 'تفاعل فوري مع عملائك على موقعك الإلكتروني والتطبيقات',
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      benefits: [
        'تواصل فوري مع العملاء أثناء تصفحهم لموقعك',
        'رد الوكيل الذكي تلقائياً على الاستفسارات الشائعة',
        'تحويل سلس للمحادثة إلى موظف حقيقي عند الحاجة'
      ]
    },
    {
      id: 2,
      title: 'الهاتف الذكي',
      description: 'مركز اتصال ذكي مدعوم بتقنيات الذكاء الاصطناعي',
      icon: <Phone className="h-8 w-8 text-primary" />,
      benefits: [
        'استقبال المكالمات وتوجيهها بشكل ذكي',
        'الرد التلقائي على الاستفسارات المتكررة',
        'تسجيل المكالمات وتحليلها لتحسين الخدمة'
      ]
    },
    {
      id: 3,
      title: 'البريد الإلكتروني',
      description: 'إدارة ذكية وفعالة للمراسلات الإلكترونية',
      icon: <Mail className="h-8 w-8 text-primary" />,
      benefits: [
        'تصنيف تلقائي للرسائل حسب الأولوية',
        'إعداد ردود تلقائية ذكية على الاستفسارات الشائعة',
        'متابعة وتحليل أداء حملات البريد الإلكتروني'
      ]
    },
    {
      id: 4,
      title: 'منصات التواصل الاجتماعي',
      description: 'إدارة موحدة لجميع حسابات التواصل الاجتماعي',
      icon: <Instagram className="h-8 w-8 text-primary" />,
      benefits: [
        'نشر المحتوى على جميع المنصات من مكان واحد',
        'الرد الآلي على التعليقات والرسائل',
        'تحليل أداء المنشورات وتفاعل الجمهور'
      ]
    },
    {
      id: 5,
      title: 'تطبيقات المراسلة',
      description: 'التواصل عبر واتساب وتلغرام وتطبيقات المراسلة الأخرى',
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      benefits: [
        'دعم لجميع تطبيقات المراسلة الشائعة',
        'نماذج رسائل جاهزة ومخصصة',
        'ردود آلية ذكية على الاستفسارات'
      ]
    },
    {
      id: 6,
      title: 'موقعك الإلكتروني',
      description: 'تكامل سلس مع موقعك الإلكتروني وبوابات العملاء',
      icon: <Globe className="h-8 w-8 text-primary" />,
      benefits: [
        'واجهات برمجة تطبيقات سهلة الاستخدام',
        'تخصيص حسب تصميم موقعك',
        'تحسين تجربة المستخدم وزيادة معدل التحويل'
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-bold mb-6">قنوات التواصل المتكاملة</h1>
              <p className="text-xl text-gray-700 mb-8">
                نوفر لك منصة متكاملة لإدارة جميع قنوات التواصل مع عملائك من مكان واحد، مدعومة بتقنيات الذكاء الاصطناعي
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/demo">
                  طلب عرض توضيحي <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map(channel => (
                <Card key={channel.id} className="border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-50 p-3 rounded-full">
                        {channel.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-4">{channel.title}</h3>
                    <p className="text-gray-600 text-center mb-6">{channel.description}</p>
                    <ul className="space-y-2">
                      {channel.benefits.map((benefit, index) => (
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
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">تجربة عملاء متكاملة وموحدة</h2>
                  <p className="text-gray-600 mb-8">
                    مع أوفر يمكنك توحيد جميع قنوات التواصل مع عملائك في منصة واحدة، مما يوفر تجربة سلسة ومتناغمة لعملائك بغض النظر عن القناة التي يختارونها للتواصل معك.
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
                        <h3 className="font-medium">تاريخ تواصل موحد</h3>
                        <p className="text-sm text-gray-500">رؤية شاملة لجميع تفاعلات العميل عبر مختلف القنوات</p>
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
                        <h3 className="font-medium">تكامل سلس</h3>
                        <p className="text-sm text-gray-500">ربط سهل مع أنظمتك وبرامجك الحالية</p>
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
                        <h3 className="font-medium">تحليلات شاملة</h3>
                        <p className="text-sm text-gray-500">تقارير وإحصائيات مفصلة لأداء جميع قنوات التواصل</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 h-full flex items-center justify-center p-8 md:p-0">
                  <img 
                    src="/lovable-uploads/5d1bb1dd-d818-4445-b619-efc19f9cee42.png" 
                    alt="قنوات التواصل المتكاملة" 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">أسئلة شائعة حول قنوات التواصل</h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">ما هي القنوات المدعومة في منصة أوفر؟</h3>
                <p className="text-gray-600">
                  تدعم منصة أوفر العديد من قنوات التواصل بما في ذلك المحادثات المباشرة على الموقع، البريد الإلكتروني، الهاتف، وسائل التواصل الاجتماعي، تطبيقات المراسلة مثل واتساب وتلغرام، بالإضافة إلى تكامل سلس مع موقعك الإلكتروني.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">هل يمكن إضافة قنوات تواصل مخصصة؟</h3>
                <p className="text-gray-600">
                  نعم، يمكن تخصيص وإضافة قنوات تواصل جديدة حسب احتياجات عملك. فريقنا التقني مستعد للعمل معك لضمان تكامل أي قناة تواصل تحتاجها مع منصة أوفر.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">كيف يساعد الذكاء الاصطناعي في إدارة قنوات التواصل؟</h3>
                <p className="text-gray-600">
                  يوفر الذكاء الاصطناعي في أوفر العديد من المزايا مثل الرد التلقائي على الاستفسارات الشائعة، توجيه الرسائل للفريق المناسب، تحليل مشاعر العملاء، وتقديم اقتراحات للردود المناسبة، مما يساعد في تحسين كفاءة خدمة العملاء وتجربتهم.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">هل يمكنني رؤية سجل تفاعلات العميل عبر جميع القنوات؟</h3>
                <p className="text-gray-600">
                  نعم، توفر منصة أوفر سجلًا موحدًا وشاملًا لجميع تفاعلات العميل عبر مختلف قنوات التواصل، مما يتيح لفريقك رؤية كاملة لتاريخ العميل وتقديم خدمة أفضل وأكثر تخصيصًا.
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

export default Channels;
