
import CheckItem from "./CheckItem";

const AdvancedFeatures = () => {
  const chatbotFeatures = [
    "أتمتة الرد على استفسارات العملاء الشائعة بسرعة ودقة",
    "فهم السياق والرد على استفسارات معقدة",
    "تقديم ردود مخصصة بناءً على تاريخ العميل",
    "توجيه العملاء إلى الخدمات المناسبة"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-awfar-primary mb-4">روبوت المحادثات بالذكاء الاصطناعي</h3>
              <p className="text-gray-600 mb-4">
                ساعد عملاءك بشكل فوري عبر روبوت محادثات ذكي بإمكانه:
              </p>
              <ul className="space-y-3 mb-6">
                {chatbotFeatures.map((feature, index) => (
                  <CheckItem key={index} text={feature} />
                ))}
              </ul>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 text-center lg:text-right">
            <h2 className="text-3xl font-bold text-awfar-primary mb-4">
              إدارة الكفاءة بشكل متطور
            </h2>
            <p className="text-gray-600 mb-6">
              إدارة فعالة لكمية كبيرة من العملاء باستخدام خوارزميات توزيع المحادثات الذكية.
            </p>
            
            <h3 className="text-xl font-bold text-awfar-primary mb-3">تحليلات وإعداد تقارير في الوقت الفعلي</h3>
            <p className="text-gray-600 mb-6">
              احصل على بيانات دقيقة لتحسين خدمة العملاء وقياس أداء وكلاء الدعم.
            </p>
            
            <h3 className="text-xl font-bold text-awfar-primary mb-3">التكامل السلس مع الأنظمة المختلفة</h3>
            <p className="text-gray-600 mb-6">
              دمج سهل مع واتساب، فيسبوك، إنستغرام لتحسين تجربة العملاء.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;
