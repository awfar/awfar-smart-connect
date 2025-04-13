
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle, MessageSquare, Phone, Globe, Users, CheckCircle, ArrowRight } from 'lucide-react';

const Channels = () => {
  const channelTypes = [
    {
      icon: <MessageCircle className="h-10 w-10 text-white" />,
      name: 'الواتساب',
      description: 'تواصل مع عملائك عبر تطبيق الواتساب الأكثر استخداماً في العالم',
      color: 'bg-green-500',
      features: [
        'ردود تلقائية فورية 24/7',
        'إمكانية إرسال الصور والفيديوهات',
        'دعم المحادثات الجماعية',
        'متابعة تلقائية للعملاء'
      ]
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-white" />,
      name: 'ماسنجر الفيسبوك',
      description: 'تواصل مع جمهورك على منصة فيسبوك مباشرة من خلال الماسنجر',
      color: 'bg-blue-500',
      features: [
        'تكامل مع صفحات الفيسبوك',
        'استجابة فورية لاستفسارات العملاء',
        'بوت مخصص للرد التلقائي',
        'إدارة محادثات متعددة'
      ]
    },
    {
      icon: <Phone className="h-10 w-10 text-white" />,
      name: 'المكالمات الهاتفية',
      description: 'خدمة الرد الآلي الذكي للمكالمات الهاتفية وتحويلها للموظف المختص',
      color: 'bg-yellow-500',
      features: [
        'رد آلي ذكي على المكالمات',
        'تحويل المكالمات للموظفين المعنيين',
        'تسجيل المكالمات وتحليلها',
        'تقارير مفصلة عن أداء الخدمة'
      ]
    },
    {
      icon: <Globe className="h-10 w-10 text-white" />,
      name: 'الموقع الإلكتروني',
      description: 'شات بوت ذكي لموقعك الإلكتروني للإجابة على استفسارات الزوار',
      color: 'bg-purple-500',
      features: [
        'تخصيص شكل الشات حسب تصميم موقعك',
        'تكامل سلس مع نظام الموقع',
        'تشغيل آلي بدون تدخل بشري',
        'تحليل سلوك المستخدمين'
      ]
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      name: 'تطبيقات الجوال',
      description: 'دمج الوكيل الذكي مع تطبيقات الهواتف الذكية لتحسين تجربة المستخدم',
      color: 'bg-pink-500',
      features: [
        'واجهة برمجة تطبيقات سهلة الاستخدام',
        'دعم لنظامي iOS و Android',
        'تكامل سلس مع واجهة التطبيق',
        'دعم اللغة العربية والإنجليزية'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block mb-3 px-3 py-1 bg-awfar-primary/10 rounded-full text-awfar-primary font-medium">
                تعدد القنوات
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">تواصل مع عملائك عبر كافة القنوات</h1>
              <p className="text-xl text-gray-600 mb-8">
                يتيح لك نظام Awfar التواصل مع عملائك بشكل فعال عبر جميع منصات التواصل المعروفة مع خدمة موحدة وتجربة متكاملة
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
                  <Link to="/demo">جرّب الآن</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">استعرض الباقات</Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {channelTypes.map((channel, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className={`${channel.color} p-6`}>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-3 rounded-full">
                        {channel.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white">{channel.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{channel.description}</p>
                    <ul className="space-y-3">
                      {channel.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-awfar-primary to-awfar-secondary rounded-2xl p-8 text-white text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">تكامل مع جميع منصات التواصل الاجتماعي</h2>
              <p className="text-xl mb-8">
                يقدم نظام Awfar تكاملاً سلساً مع كافة منصات التواصل الاجتماعي الشهيرة، مما يتيح لك إدارة جميع قنوات التواصل من مكان واحد
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 p-4 rounded-full mb-3">
                    <img src="/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png" alt="WhatsApp" className="h-10 w-10" />
                  </div>
                  <span>واتساب</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 p-4 rounded-full mb-3">
                    <img src="/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png" alt="Facebook" className="h-10 w-10" />
                  </div>
                  <span>فيسبوك</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 p-4 rounded-full mb-3">
                    <img src="/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png" alt="Instagram" className="h-10 w-10" />
                  </div>
                  <span>انستغرام</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 p-4 rounded-full mb-3">
                    <img src="/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png" alt="Twitter" className="h-10 w-10" />
                  </div>
                  <span>تويتر</span>
                </div>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link to="/integration" className="flex items-center gap-2">
                  اكتشف المزيد من التكاملات
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/lovable-uploads/72cbf72d-0947-4e2f-8a78-d00fce992254.png" 
                  alt="Centralized communication" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold mb-6">إدارة موحدة لجميع قنوات التواصل</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  مع منصة Awfar، يمكنك إدارة جميع محادثاتك مع العملاء عبر مختلف القنوات في مكان واحد. لم تعد هناك حاجة للتنقل بين تطبيقات متعددة أو أنظمة منفصلة للتعامل مع استفسارات العملاء.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">رؤية شاملة لتفاعلات العملاء</h3>
                      <p className="text-gray-600">متابعة جميع المحادثات والتفاعلات مع العملاء في لوحة تحكم موحدة</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">تحويل المحادثات بين القنوات</h3>
                      <p className="text-gray-600">إمكانية نقل المحادثة من قناة إلى أخرى دون فقدان سياق المحادثة</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">تقارير موحدة عن أداء القنوات</h3>
                      <p className="text-gray-600">تحليلات شاملة تساعدك على فهم أي القنوات أكثر فعالية لعملك</p>
                    </div>
                  </div>
                </div>
                
                <Button asChild>
                  <Link to="/demo">جرّب نظام إدارة القنوات</Link>
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

export default Channels;
