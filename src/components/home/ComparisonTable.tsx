
import { Check, X } from "lucide-react";

const ComparisonTable = () => {
  const features = [
    { name: "المهام", chatbot: "ردود بسيطة فقط", aiChat: "فهم وتحليل متقدم", aiAgent: "تنفيذ مهام حقيقية" },
    { name: "الذكاء", chatbot: "منخفض - يعتمد على ردود مبرمجة سلفاً", aiChat: "متوسط - يفهم ويحلل النصوص", aiAgent: "عالي - يفهم وينفذ العمليات" },
    { name: "قدرة التعلم", chatbot: "لا يتعلم", aiChat: "يتعلم من المحادثات", aiAgent: "يتعلم وينفذ قرارات" },
    { name: "التنفيذ داخل الأنظمة", chatbot: "لا ينفذ عمليات", aiChat: "لا ينفذ عمليات حقيقية", aiAgent: "ينفذ الأوامر ويتعامل مع البيانات" },
    { name: "تحديث البيانات تلقائياً", chatbot: "لا يقوم بالتحديث", aiChat: "لا يقوم بالتحديث", aiAgent: "يبحث الأسعار والمنتجات أو الخدمات تلقائياً" },
    { name: "التكلفة", chatbot: "منخفضة", aiChat: "متوسطة", aiAgent: "أعلى تكلفة" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">مقارنة بين أنواع الذكاء الاصطناعي</h2>
          <p className="text-gray-600 text-lg">
            تعرف على الفرق بين Chatbot التقليدي، AI Chat، وتقنية AI Agent المتطورة التي تقدمها منصة أوفر
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr>
                <th className="p-4 border bg-gray-50"></th>
                <th className="p-4 border bg-indigo-100">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-700">Chatbot</span>
                    <span className="text-sm text-gray-500">الروبوت التقليدي</span>
                  </div>
                </th>
                <th className="p-4 border bg-yellow-100">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-700">AI Chat</span>
                    <span className="text-sm text-gray-500">دردشة ذكية</span>
                  </div>
                </th>
                <th className="p-4 border bg-green-100">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-awfar-primary">AI Agent</span>
                    <span className="text-sm text-gray-500">وكيل ذكي</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td className="p-4 border font-bold bg-gray-50">{feature.name}</td>
                  <td className="p-4 border text-center">{feature.chatbot}</td>
                  <td className="p-4 border text-center">{feature.aiChat}</td>
                  <td className="p-4 border text-center font-medium">{feature.aiAgent}</td>
                </tr>
              ))}
              <tr>
                <td className="p-4 border font-bold bg-gray-50">الاستخدام الأمثل</td>
                <td className="p-4 border text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span>تحتاج مجرد ردود سريعة</span>
                    <div className="inline-block bg-indigo-100 rounded-full px-3 py-1 text-sm">
                      استخدم Chatbot
                    </div>
                  </div>
                </td>
                <td className="p-4 border text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span>تريد محادثات أكثر ذكاءً</span>
                    <div className="inline-block bg-yellow-100 rounded-full px-3 py-1 text-sm">
                      استخدم AI Chat
                    </div>
                  </div>
                </td>
                <td className="p-4 border text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span>تريد تنفيذ عمليات وإدارة الطلبات تلقائياً</span>
                    <div className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm">
                      استخدم AI Agent
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
