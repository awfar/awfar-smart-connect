
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Database, Zap, LineChart, MessageSquare, CheckCircle, ExternalLink, Settings, ServerCog } from 'lucide-react';

const Integration = () => {
  const integrations = [
    {
      category: "أنظمة إدارة علاقات العملاء",
      systems: [
        { name: "Salesforce", logo: "/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png", popular: true },
        { name: "Microsoft Dynamics", logo: "/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png" },
        { name: "HubSpot", logo: "/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png", popular: true },
        { name: "Zoho CRM", logo: "/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png" },
      ]
    },
    {
      category: "أنظمة التجارة الإلكترونية",
      systems: [
        { name: "Shopify", logo: "/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png", popular: true },
        { name: "WooCommerce", logo: "/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png", popular: true },
        { name: "Magento", logo: "/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png" },
        { name: "Salla", logo: "/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png", popular: true },
      ]
    },
    {
      category: "أنظمة إدارة المحتوى",
      systems: [
        { name: "WordPress", logo: "/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png", popular: true },
        { name: "Joomla", logo: "/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png" },
        { name: "Drupal", logo: "/lovable-uploads/bf8a59d9-e92a-42fc-b7f5-5f96e1497988.png" },
        { name: "Contentful", logo: "/lovable-uploads/adf52374-3db1-45dd-a60b-018ee4627394.png" },
      ]
    },
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-awfar-accent" />,
      title: "تكامل بدون شفرة برمجية",
      description: "استخدم واجهة سهلة لربط أنظمتك دون الحاجة لمعرفة برمجية"
    },
    {
      icon: <Database className="h-8 w-8 text-awfar-accent" />,
      title: "مزامنة البيانات في الوقت الفعلي",
      description: "استفد من مزامنة فورية للبيانات بين جميع أنظمتك المتكاملة"
    },
    {
      icon: <LineChart className="h-8 w-8 text-awfar-accent" />,
      title: "تقارير وتحليلات متكاملة",
      description: "احصل على تقارير موحدة من كافة مصادر البيانات المختلفة"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-awfar-accent" />,
      title: "الوصول لسجل العميل الموحد",
      description: "اطلع على كامل سجل العميل وتفاعلاته عبر كافة المنصات"
    },
    {
      icon: <ServerCog className="h-8 w-8 text-awfar-accent" />,
      title: "أتمتة العمليات المتقاطعة",
      description: "أنشئ مهام آلية تعمل عبر مختلف الأنظمة في مؤسستك"
    },
    {
      icon: <Settings className="h-8 w-8 text-awfar-accent" />,
      title: "إعدادات متقدمة وتخصيص",
      description: "خصص التكاملات لتلبية احتياجات عملك الفريدة"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block mb-3 px-3 py-1 bg-awfar-accent/10 rounded-full text-awfar-accent font-medium">
                تكامل سلس
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">التكامل مع الأنظمة الحالية</h1>
              <p className="text-xl text-gray-600 mb-8">
                يوفر نظام Awfar إمكانية التكامل السلس مع أنظمتك وتطبيقاتك الحالية، مما يسمح بتدفق المعلومات بشكل آلي وسهل
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
                <Link to="/demo">جرّب التكامل الآن</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="bg-gray-50 p-3 inline-flex rounded-lg mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-center mb-10">تكامل مع أنظمة ومنصات متعددة</h2>
              
              {integrations.map((category, index) => (
                <div key={index} className="mb-10">
                  <h3 className="text-2xl font-bold mb-6">{category.category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {category.systems.map((system, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                          <img src={system.logo} alt={system.name} className="h-10 w-10 object-contain" />
                        </div>
                        <h4 className="font-bold">{system.name}</h4>
                        {system.popular && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                            الأكثر استخداماً
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-8 text-center">
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/contact">
                    اطلب تكامل مع نظام آخر
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">عملية تكامل سلسة وسريعة</h2>
              <p className="text-xl mb-10">
                فريق الدعم الفني لدينا سيقوم بمساعدتك في عملية التكامل مع أنظمتك الحالية بسرعة وكفاءة
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">تحليل الاحتياجات</h3>
                  <p className="text-white/80">نحدد معاً الأنظمة التي تحتاج للتكامل معها</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">إعداد التكامل</h3>
                  <p className="text-white/80">يقوم فريقنا بإعداد وتهيئة التكامل بين الأنظمة</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">التشغيل والمتابعة</h3>
                  <p className="text-white/80">نتأكد من عمل التكامل بكفاءة ونقدم الدعم المستمر</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl font-bold mb-6">واجهة برمجة تطبيقات API قوية ومرنة</h2>
                <p className="text-gray-600 mb-8">
                  نوفر واجهة برمجة تطبيقات (API) متكاملة تتيح لفريقك التقني إنشاء تكاملات مخصصة، وتطوير حلول فريدة تلبي احتياجات عملك.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <p className="text-gray-700">توثيق شامل لواجهة برمجة التطبيقات</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <p className="text-gray-700">دعم للعديد من لغات البرمجة والأطر</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <p className="text-gray-700">أمان متقدم وإدارة للصلاحيات</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <p className="text-gray-700">تحديثات منتظمة وتطوير مستمر</p>
                  </div>
                </div>
                
                <Button asChild>
                  <Link to="/contact">طلب معلومات عن API</Link>
                </Button>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-400">awfar-api-example.json</span>
                  </div>
                  <pre className="text-green-400 text-sm text-left overflow-x-auto">
                    <code>
{`// Awfar API Integration Example
{
  "endpoint": "/api/v1/customers",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer {YOUR_API_KEY}",
    "Content-Type": "application/json"
  },
  "response": {
    "status": 200,
    "data": [
      {
        "id": "cust123",
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "interactions": 15,
        "lastContact": "2023-08-15T14:30:00Z"
      },
      // More customer data...
    ]
  }
}`}
                    </code>
                  </pre>
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
