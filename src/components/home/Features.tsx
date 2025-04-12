
import { 
  MessageSquare, 
  Globe, 
  Bot, 
  Zap, 
  BarChart3, 
  Layers 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-awfar-accent" />,
      title: "وكيل الذكاء الاصطناعي",
      description: "موظفون افتراضيون مدعومون بالذكاء الاصطناعي للرد الفوري على استفسارات العملاء بفهم كامل للهجات المختلفة."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-awfar-accent" />,
      title: "منصة تواصل موحدة",
      description: "دمج كافة قنوات التواصل (واتساب، انستجرام، فيسبوك) في منصة واحدة لإدارة جميع المحادثات بكفاءة عالية."
    },
    {
      icon: <Layers className="w-8 h-8 text-awfar-accent" />,
      title: "حلول شاملة",
      description: "نظام متكامل لإدارة الطلبات، الدفع، والتواصل الداخلي لتغطية كافة احتياجات عملك."
    },
    {
      icon: <Zap className="w-8 h-8 text-awfar-accent" />,
      title: "تكامل مع الأنظمة",
      description: "سهولة الربط مع أنظمة CRM، قواعد البيانات، وأنظمة الدفع الحالية لتعزيز كفاءة العمليات."
    },
    {
      icon: <Globe className="w-8 h-8 text-awfar-accent" />,
      title: "دعم متعدد اللغات",
      description: "دعم كامل للغة العربية واللهجات المختلفة بالإضافة للغات العالمية لخدمة عملائك في كل مكان."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-awfar-accent" />,
      title: "تحليلات متقدمة",
      description: "لوحات تحكم وتقارير تفاعلية لقياس أداء خدمة العملاء وتحسين تجربتهم باستمرار."
    },
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">خدماتنا</h2>
          <p className="text-gray-600 text-lg">
            نقدم باقة متكاملة من الحلول التقنية المبتكرة لتحسين تواصلك مع العملاء وتعزيز أداء فريق المبيعات والدعم
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-awfar-primary/5 inline-flex p-3 rounded-lg mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-awfar-primary">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
