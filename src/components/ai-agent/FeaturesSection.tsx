
import { MessageSquare, Zap, Globe, BarChart3, Bot, Braces } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: MessageSquare,
    title: "ردود تلقائية فورية",
    description: "يوفر إجابات سريعة ودقيقة للاستفسارات الشائعة للعملاء، مما يقلل من وقت الانتظار ويحسن تجربة العملاء."
  },
  {
    icon: Globe,
    title: "فهم اللهجات والثقافات",
    description: "قادر على فهم مختلف اللهجات العربية والتفاعل بطريقة مناسبة ثقافياً مع العملاء، مما يعزز التواصل الفعال."
  },
  {
    icon: BarChart3,
    title: "تحليل البيانات",
    description: "تخصيص الردود وجمع البيانات وتحليلها لتحسين خدمة العملاء، مما يتيح اتخاذ قرارات مستندة إلى البيانات."
  },
  {
    icon: Zap,
    title: "دعم متعدد اللغات",
    description: "يتفاعل مع العملاء بلغات متعددة، مما يوسع نطاق خدمات الدعم ويعزز الوصول إلى جمهور أوسع عالمياً."
  },
  {
    icon: Bot,
    title: "التعلم المستمر",
    description: "يعتمد على التعلم الآلي لتحسين الأداء وتوقع احتياجات العملاء المستقبلية وتطوير استراتيجيات الدعم الاستباقية."
  },
  {
    icon: Braces,
    title: "التكامل والتوافق",
    description: "يتكامل بسهولة مع أنظمة CRM الحالية والأدوات الأخرى، مما يضمن تدفق سلس للبيانات وعمليات متسقة."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">المميزات الأساسية</h2>
          <p className="text-gray-600 text-lg">
            تعرف على مميزات وكيل الذكاء الاصطناعي من أوفر وكيف يمكنه تحسين تجربة عملائك وزيادة كفاءة فريق الدعم لديك
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
