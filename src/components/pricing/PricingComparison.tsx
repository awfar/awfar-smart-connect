
import React from 'react';
import { Check, X } from 'lucide-react';

const PricingComparison = () => {
  const features = [
    {
      name: "مميزات أساسية",
      items: [
        {
          name: "الرد على رسائل العملاء",
          free: true,
          plus: true,
          pro: true
        },
        {
          name: "عدد المحادثات المتزامنة",
          free: "1",
          plus: "3",
          pro: "غير محدود"
        },
        {
          name: "وقت الاستجابة",
          free: "فوري",
          plus: "فوري",
          pro: "فوري"
        }
      ]
    },
    {
      name: "قنوات التواصل",
      items: [
        {
          name: "الموقع الإلكتروني (ويدجيت دردشة)",
          free: true,
          plus: true,
          pro: true
        },
        {
          name: "واتساب للأعمال",
          free: false,
          plus: true,
          pro: true
        },
        {
          name: "فيسبوك ماسنجر",
          free: false,
          plus: true,
          pro: true
        },
        {
          name: "انستغرام",
          free: false,
          plus: true,
          pro: true
        },
        {
          name: "تيليغرام",
          free: false,
          plus: false,
          pro: true
        }
      ]
    },
    {
      name: "الخدمات المتقدمة",
      items: [
        {
          name: "تخصيص الرد الآلي",
          free: "محدود",
          plus: "كامل",
          pro: "كامل مع API"
        },
        {
          name: "تكامل مع أنظمة CRM",
          free: false,
          plus: false,
          pro: true
        },
        {
          name: "التقارير والتحليلات",
          free: "أساسية",
          plus: "متقدمة",
          pro: "متقدمة مع تصدير"
        },
        {
          name: "مدير حساب مخصص",
          free: false,
          plus: false,
          pro: true
        }
      ]
    },
    {
      name: "الدعم الفني",
      items: [
        {
          name: "البريد الإلكتروني",
          free: true,
          plus: true,
          pro: true
        },
        {
          name: "الدردشة المباشرة",
          free: false,
          plus: true,
          pro: true
        },
        {
          name: "الدعم عبر الهاتف",
          free: false,
          plus: false,
          pro: true
        },
        {
          name: "وقت الاستجابة",
          free: "48 ساعة",
          plus: "24 ساعة",
          pro: "أولوية قصوى"
        }
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">مقارنة المميزات</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-right font-medium text-gray-500">المميزات</th>
                <th className="py-4 px-6 text-center font-medium text-gray-900">Free</th>
                <th className="py-4 px-6 text-center font-medium text-awfar-secondary">Plus</th>
                <th className="py-4 px-6 text-center font-medium text-awfar-primary">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {features.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="py-3 px-6 font-medium text-gray-900">{category.name}</td>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr key={`${categoryIndex}-${itemIndex}`} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-right">{item.name}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof item.free === 'boolean' ? (
                          item.free ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-700">{item.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof item.plus === 'boolean' ? (
                          item.plus ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-700">{item.plus}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof item.pro === 'boolean' ? (
                          item.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-700">{item.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;
