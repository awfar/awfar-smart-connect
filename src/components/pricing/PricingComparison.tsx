
import React from "react";
import { Check, X } from "lucide-react";

interface FeatureItem {
  name: string;
  free: boolean;
  basic: boolean;
  premium: boolean;
}

const PricingComparison = () => {
  const features: FeatureItem[] = [
    { name: "موظف ذكي 24/7", free: true, basic: true, premium: true },
    { name: "التفاعل مع العملاء عبر الواتساب", free: true, basic: true, premium: true },
    { name: "تفاعل مع العملاء عبر الماسنجر", free: true, basic: true, premium: true },
    { name: "تفاعل مع العملاء عبر إنستجرام", free: false, basic: true, premium: true },
    { name: "تفاعل مع العملاء عبر الموقع", free: false, basic: true, premium: true },
    { name: "تفاعل مع العملاء عبر تويتر", free: false, basic: false, premium: true },
    { name: "تكامل مع أنظمة CRM", free: false, basic: true, premium: true },
    { name: "تدريب مخصص للموظف الذكي", free: false, basic: false, premium: true },
    { name: "مدير حساب مخصص", free: false, basic: false, premium: true },
    { name: "تقارير أداء متقدمة", free: false, basic: false, premium: true },
    { name: "API مخصصة", free: false, basic: false, premium: true },
    { name: "دعم فني متخصص 24/7", free: false, basic: false, premium: true },
    { name: "واجهة تحكم متقدمة", free: false, basic: true, premium: true },
    { name: "عدد المحادثات", free: "محدود", basic: "غير محدود", premium: "غير محدود" },
    { name: "عدد المستخدمين", free: "1", basic: "5", premium: "غير محدود" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-right font-bold text-gray-900 w-1/4">الميزة</th>
            <th className="px-6 py-4 text-center font-bold text-gray-900 w-1/4">مجاني</th>
            <th className="px-6 py-4 text-center font-bold text-awfar-primary w-1/4">
              الأساسي
              <div className="text-sm font-normal text-gray-500">199 ريال/شهرياً</div>
            </th>
            <th className="px-6 py-4 text-center font-bold text-gray-900 w-1/4">
              المتقدم
              <div className="text-sm font-normal text-gray-500">499 ريال/شهرياً</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="px-6 py-4 text-right text-gray-800 font-medium">{feature.name}</td>
              
              <td className="px-6 py-4 text-center">
                {typeof feature.free === "boolean" ? (
                  feature.free ? 
                    <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                ) : (
                  <span>{feature.free}</span>
                )}
              </td>
              
              <td className="px-6 py-4 text-center">
                {typeof feature.basic === "boolean" ? (
                  feature.basic ? 
                    <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                ) : (
                  <span>{feature.basic}</span>
                )}
              </td>
              
              <td className="px-6 py-4 text-center">
                {typeof feature.premium === "boolean" ? (
                  feature.premium ? 
                    <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                ) : (
                  <span>{feature.premium}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingComparison;
