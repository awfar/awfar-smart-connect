
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

const CCommerce = () => {
  const comparisonData = [
    {
      title: "تجربة العميل",
      cCommerce: "يصل العميل إلى حلوله داخل المحادثة",
      eCommerce: "يصل العميل للمنتج بعد خطوات متعددة من البحث",
      icon: "User",
    },
    {
      title: "التسوق",
      cCommerce: "تجربة شراء مخصصة حسب طلبات العميل وإمكانية تعديلها خلال المحادثة",
      eCommerce: "تجربة تسوق موحدة لجميع العملاء، في السلة أو الشراء بدون أي تفاعل مباشر مع البائعين",
      icon: "ShoppingBag",
    },
    {
      title: "سرعة وسهولة الطلب",
      cCommerce: "إتمام عملية الشراء داخل المحادثة برسالة واحدة",
      eCommerce: "أكثر من 5 خطوات لإنهاء عملية التسوق وإتمام عملية الشراء",
      icon: "Zap",
    },
    {
      title: "متطلبات التشغيل",
      cCommerce: "وكيل خدمة عملاء بالذكاء الاصطناعي فقط",
      eCommerce: "فريق بناء الموقع الإلكتروني - فريق تصميم تجربة المستخدم - فريق التسويق - فريق خدمة العملاء - فريق تقنية المعلومات - فريق تصميم الهوية - وغيرهم",
      icon: "Users",
    },
    {
      title: "سرعة التفعيل",
      cCommerce: "120 دقيقة على الأكثرا",
      eCommerce: "43200 دقيقة على الأقل! (30 يوم)",
      icon: "Clock",
    },
    {
      title: "التأثير على المبيعات",
      cCommerce: "لوجود سلة متوفرة دائماً (أينما وُجِد عميل) مما يشجع على التسجيل برسالة للتسوق",
      eCommerce: "50% يتوقفون عن استكمال عملية الشراء لأسباب مجهولة",
      icon: "TrendingUp",
    },
    {
      title: "المتابعة",
      cCommerce: "متابعة العميل أثناء وبعد عملية الشراء ورد فوري على طلبات الإستفسارات وشكاوى العملاء",
      eCommerce: "الرد تقريباً 43200 على الأقل (12 ساعة)",
      icon: "MessageSquare",
    },
    {
      title: "سهولة تعديل الطلبات",
      cCommerce: "تعديل الطلبات من رسالة واحدة في أي وقت داخل المحادثة",
      eCommerce: "تعديل الطلبات يستغرق الكثير من الوقت وتعقيد عملية التواصل",
      icon: "Edit",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">تفضيل العملاء للمحادثة في التسوق</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-awfar-accent">89%</span>
            <span className="text-xl text-gray-700">من العملاء يفضلون التسوق عبر المحادثة</span>
          </div>
          <p className="text-gray-600 mb-6">
            المقارنة بين التجارة التقليدية E-Commerce والتجارة عبر المحادثات C-Commerce
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-10">
          {comparisonData.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm">
              <div className="bg-awfar-primary text-white p-3 rounded-t-lg text-center">
                <h3 className="font-bold">{item.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="bg-green-50 p-4 md:p-6 flex items-start gap-3 border-b md:border-b-0 md:border-l border-gray-200">
                  <div className="bg-green-100 rounded-full p-1 flex-shrink-0 mt-1">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-awfar-primary mb-1">C-Commerce</h4>
                    <p className="text-sm text-gray-700">{item.cCommerce}</p>
                  </div>
                </div>
                <div className="bg-red-50 p-4 md:p-6 flex items-start gap-3">
                  <div className="bg-red-100 rounded-full p-1 flex-shrink-0 mt-1">
                    <X size={16} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 mb-1">E-Commerce</h4>
                    <p className="text-sm text-gray-700">{item.eCommerce}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
            <Link to="/demo">تجربة C-Commerce الآن</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CCommerce;
