
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      content: "موظف أوفر الذكي ساعدنا على زيادة مبيعاتنا بنسبة 35% في الشهر الأول من استخدامه. يرد على استفسارات العملاء على مدار الساعة مما يزيد من فرص البيع.",
      author: "أحمد محمد",
      position: "المدير التنفيذي",
      company: "شركة الخليج للتقنية",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 2,
      content: "كان العملاء يضطرون للانتظار لساعات للحصول على رد، الآن يحصلون على استجابة فورية في أي وقت. هذا غيّر تماماً تجربة العملاء معنا.",
      author: "سارة الخالد",
      position: "مديرة خدمة العملاء",
      company: "متجر الأناقة",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 3,
      content: "سهولة الاستخدام والتكامل مع أنظمتنا الحالية جعل تجربتنا مع أوفر رائعة. فريق الدعم الفني محترف وسريع الاستجابة.",
      author: "عبدالله الفارس",
      position: "مدير تقنية المعلومات",
      company: "مؤسسة الإبداع",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    {
      id: 4,
      content: "الموظف الذكي من أوفر أصبح جزءاً لا يتجزأ من فريقنا. قدرته على التعامل مع العملاء بلغتهم المحلية أمر مذهل حقاً.",
      author: "نورة العتيبي",
      position: "مديرة التسويق",
      company: "مجموعة الرؤية",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/15.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-awfar-accent/20 text-awfar-accent rounded-full text-sm font-semibold mb-3">آراء العملاء</span>
          <h2 className="text-3xl font-bold text-awfar-primary">ماذا يقول عملاؤنا عن خدماتنا</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">تعرف على تجارب بعض عملائنا الذين استفادوا من خدمة الموظف الذكي من أوفر</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border border-gray-200 overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6">"{testimonial.content}"</blockquote>
                <div className="flex items-center">
                  <div className="rounded-full h-12 w-12 overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.position}, {testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-awfar-primary/5 to-awfar-secondary/5 px-6 py-4">
                <p className="text-sm text-gray-600">عميل منذ 2023</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
