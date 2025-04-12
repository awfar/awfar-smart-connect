
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BotComparison = () => {
  const comparisons = [
    {
      feature: "المهام",
      awfar: "تنفيذ خدمة حقيقية",
      aiChat: "فهم وتحليل متقدم",
      chatbot: "ردود بسيطة فقط"
    },
    {
      feature: "البناء",
      awfar: "عالي - يفهم ويتعلم البيانات",
      aiChat: "متوسط - يفهم ويحلل",
      chatbot: "منخفض - يعتمد على ردود مسبقة"
    },
    {
      feature: "قدرة التعلم",
      awfar: <Check className="h-5 w-5 text-green-500 mx-auto" />,
      aiChat: <Check className="h-5 w-5 text-green-500 mx-auto" />,
      chatbot: <X className="h-5 w-5 text-red-500 mx-auto" />
    },
    {
      feature: "التفاعل لأجل الترقية",
      awfar: <Check className="h-5 w-5 text-green-500 mx-auto" />,
      aiChat: <X className="h-5 w-5 text-red-500 mx-auto" />,
      chatbot: <X className="h-5 w-5 text-red-500 mx-auto" />
    },
    {
      feature: "تحديث البيانات تلقائياً",
      awfar: <Check className="h-5 w-5 text-green-500 mx-auto" />,
      aiChat: <X className="h-5 w-5 text-red-500 mx-auto" />,
      chatbot: <X className="h-5 w-5 text-red-500 mx-auto" />
    },
    {
      feature: "التكلفة",
      awfar: <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-full text-xs font-bold">$</span>,
      aiChat: <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">$$</span>,
      chatbot: <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 rounded-full text-xs font-bold">$$$</span>
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">الفرق بين</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-right font-bold text-gray-900 w-1/4">الميزة</th>
                <th className="px-6 py-4 text-center font-bold text-awfar-primary w-1/4">
                  الموظف الذكي
                  <br />
                  <span className="font-normal">Awfar Chat Commerce</span>
                </th>
                <th className="px-6 py-4 text-center font-bold text-gray-900 w-1/4">AI Chat</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900 w-1/4">Chatbot</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 text-right text-gray-900 font-medium">{item.feature}</td>
                  <td className="px-6 py-4 text-center">{item.awfar}</td>
                  <td className="px-6 py-4 text-center">{item.aiChat}</td>
                  <td className="px-6 py-4 text-center">{item.chatbot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild className="bg-awfar-primary hover:bg-awfar-primary/90">
            <Link to="/demo">ابدأ موظفك الذكي الآن!</Link>
          </Button>
          
          <div className="mt-4 text-sm text-gray-500">
            <Link to="/pricing" className="text-awfar-secondary hover:underline">التكلفة مجاناً؟</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BotComparison;
