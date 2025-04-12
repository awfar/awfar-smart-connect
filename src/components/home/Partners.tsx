
import { cn } from "@/lib/utils";

type PartnerGroup = {
  title: string;
  logos: {
    src: string;
    alt: string;
  }[];
};

const Partners = () => {
  const partnerGroups: PartnerGroup[] = [
    {
      title: "سلاسل الهايبر ماركت",
      logos: [
        { src: "/lovable-uploads/dcd59e68-f146-4131-974a-e7ead8c0028a.png", alt: "هايبر وان" },
        { src: "/lovable-uploads/70fad303-ee74-4179-8904-3f0934a95ed9.png", alt: "مترو" },
        { src: "/lovable-uploads/32c6ae7e-060d-4761-b4a2-7797baf6895b.png", alt: "خير زمان" },
        { src: "/lovable-uploads/8e9c9d8d-a991-4351-9792-a33655f595e0.png", alt: "The Grocer" },
      ],
    },
    {
      title: "الصيدليات",
      logos: [
        { src: "/lovable-uploads/b046feaa-46b2-4918-a814-96f74b7ff2dd.png", alt: "العزبى" },
        { src: "/lovable-uploads/bbd72bc9-9fe5-4f84-917e-505f720542ee.png", alt: "سيف" },
      ],
    },
    {
      title: "المطاعم والمقاهي",
      logos: [
        { src: "/lovable-uploads/2e6bbaf2-fc05-44a8-9e34-77b9daa97260.png", alt: "ألبان المالكى" },
        { src: "/lovable-uploads/2eed9290-a7fd-4180-aa6a-6c318997ad84.png", alt: "مطاعم شاورمر" },
      ],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">عملاؤنا</h2>
          <p className="text-gray-600 text-lg">
            تثق بنا مئات الشركات الرائدة في مختلف القطاعات في مصر والسعودية وخمس دول أخرى
          </p>
        </div>

        <div className="space-y-10">
          {partnerGroups.map((group, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-awfar-primary mb-4 text-center">
                {group.title}
              </h3>
              <div className={cn(
                "grid gap-6 justify-items-center",
                group.logos.length > 3 ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"
              )}>
                {group.logos.map((logo, logoIndex) => (
                  <div key={logoIndex} className="bg-white p-4 rounded-lg shadow-sm w-full max-w-[160px] h-[120px] flex items-center justify-center">
                    <img 
                      src={logo.src} 
                      alt={logo.alt} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
