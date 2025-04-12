
import { useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "شركة المراعي",
      role: "قطاع الأغذية والمشروبات",
      content: "ساعدنا نظام أوفر في توحيد كافة منصات التواصل وتحسين تجربة العملاء بشكل كبير. الذكاء الاصطناعي المدمج يوفر علينا الكثير من الوقت في الرد على الاستفسارات المتكررة.",
      logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNvcnBvcmF0ZSUyMGxvZ298ZW58MHx8MHx8fDA%3D"
    },
    {
      name: "بنك الرياض",
      role: "القطاع المصرفي",
      content: "تمكنا بفضل منصة أوفر من تحسين معدل الاستجابة للعملاء بنسبة 80% وزيادة رضا العملاء. الدعم متعدد اللغات كان مفيداً جداً لتلبية احتياجات عملائنا المتنوعين.",
      logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRlY2h8ZW58MHx8MHx8fDA%3D"
    },
    {
      name: "مجموعة الحكير",
      role: "قطاع التجزئة والترفيه",
      content: "ساعدتنا خدمات أوفر في إدارة قنوات التواصل الاجتماعي بكفاءة عالية وتحسين تفاعل العملاء. نظام التقارير التحليلية يساعدنا في اتخاذ قرارات أفضل لتحسين خدماتنا.",
      logo: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29ycG9yYXRlJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D"
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">شركاء النجاح</h2>
          <p className="text-gray-600 text-lg">
            استمع إلى تجارب عملائنا وكيف ساهمت حلولنا في تطوير أعمالهم وتحسين تجربة عملائهم
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {testimonials.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-0 shadow-md h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <img 
                      src={item.logo} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-full mb-4"
                    />
                    <p className="text-gray-600 mb-6 flex-grow">{item.content}</p>
                    <div>
                      <p className="font-bold text-awfar-primary">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="static transform-none mx-2" />
            <CarouselNext className="static transform-none mx-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
