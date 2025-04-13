
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X, Clock, ShoppingCart, MessageCircle, Zap, Users, TrendingUp, Edit } from "lucide-react";

const CCommerce = () => {
  const comparisonData = [
    {
      title: "تجربة العميل",
      cCommerce: "يصل العميل إلى حلوله داخل المحادثة",
      eCommerce: "يصل العميل للمنتج بعد خطوات متعددة من البحث",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "التسوق",
      cCommerce: "تجربة شراء مخصصة حسب طلبات العميل وإمكانية تعديلها خلال المحادثة",
      eCommerce: "تجربة تسوق موحدة لجميع العملاء، في السلة أو الشراء بدون أي تفاعل مباشر مع البائعين",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "سرعة وسهولة الطلب",
      cCommerce: "إتمام عملية الشراء داخل المحادثة برسالة واحدة",
      eCommerce: "أكثر من 5 خطوات لإنهاء عملية التسوق وإتمام عملية الشراء",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      title: "متطلبات التشغيل",
      cCommerce: "وكيل خدمة عملاء بالذكاء الاصطناعي فقط",
      eCommerce: "فريق بناء الموقع الإلكتروني - فريق تصميم تجربة المستخدم - فريق التسويق - فريق خدمة العملاء - فريق تقنية المعلومات - فريق تصميم الهوية - وغيرهم",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "سرعة التفعيل",
      cCommerce: "120 دقيقة على الأكثر",
      eCommerce: "43200 دقيقة على الأقل! (30 يوم)",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "التأثير على المبيعات",
      cCommerce: "لوجود سلة متوفرة دائماً (أينما وُجِد عميل) مما يشجع على التسجيل برسالة للتسوق",
      eCommerce: "50% يتوقفون عن استكمال عملية الشراء لأسباب مجهولة",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "المتابعة",
      cCommerce: "متابعة العميل أثناء وبعد عملية الشراء ورد فوري على طلبات الإستفسارات وشكاوى العملاء",
      eCommerce: "الرد تقريباً 43200 على الأقل (12 ساعة)",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      title: "سهولة تعديل الطلبات",
      cCommerce: "تعديل الطلبات من رسالة واحدة في أي وقت داخل المحادثة",
      eCommerce: "تعديل الطلبات يستغرق الكثير من الوقت وتعقيد عملية التواصل",
      icon: <Edit className="h-5 w-5" />,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3 px-3 py-1 bg-awfar-accent/10 rounded-full text-awfar-accent font-medium">
            تجربة تسوق متميزة
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">تفضيل العملاء للمحادثة في التسوق</h2>
          <div className="inline-flex items-center justify-center gap-3 mb-6 bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white px-6 py-3 rounded-xl">
            <span className="text-3xl font-bold">89%</span>
            <span className="text-xl">من العملاء يفضلون التسوق عبر المحادثة</span>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            المقارنة بين التجارة التقليدية E-Commerce والتجارة عبر المحادثات C-Commerce
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-16">
          {comparisonData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white p-4 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-full">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x rtl:divide-x-reverse">
                <div className="bg-green-50 p-6 flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-full flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-awfar-primary mb-2 text-lg">C-Commerce</h4>
                    <p className="text-gray-700">{item.cCommerce}</p>
                  </div>
                </div>
                <div className="bg-red-50 p-6 flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-full flex-shrink-0 mt-1">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 mb-2 text-lg">E-Commerce</h4>
                    <p className="text-gray-700">{item.eCommerce}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90 shadow-xl px-8 py-6 text-lg">
            <Link to="/demo">تجربة C-Commerce الآن</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CCommerce;
