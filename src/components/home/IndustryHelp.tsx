
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface IndustryCard {
  title: string;
  icon: string;
  link: string;
}

const IndustryHelp = () => {
  const industries: IndustryCard[] = [
    { 
      title: "السيارات", 
      icon: "🚗", 
      link: "/industries/automotive" 
    },
    { 
      title: "السياحة", 
      icon: "🏨", 
      link: "/industries/tourism" 
    },
    { 
      title: "المتاجر الإلكترونية", 
      icon: "💻", 
      link: "/industries/ecommerce" 
    },
    { 
      title: "الصيدلة", 
      icon: "💊", 
      link: "/industries/pharmacy" 
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">
            كيف سيساعدك الموظف الذكي في قطاعك؟
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden group">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={`/lovable-uploads/${index === 0 ? '18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png' : '193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png'}`} 
                  alt={industry.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="bg-green-500 text-white px-2 py-1 rounded self-start">
                    <span>مثال</span>
                  </div>
                  
                  <div>
                    <Button className="bg-white hover:bg-gray-100 text-awfar-primary rounded-full w-12 h-12 flex items-center justify-center mb-2">
                      <Play className="h-5 w-5 ml-0.5" />
                    </Button>
                    
                    <h3 className="text-white font-bold text-lg">{industry.icon} {industry.title}</h3>
                  </div>
                </div>
              </div>
              
              <Link 
                to={industry.link}
                className="absolute inset-0 z-10"
                aria-label={`تعرف على الموظف الذكي في قطاع ${industry.title}`}
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 flex-wrap gap-4">
          {industries.map((industry, index) => (
            <Button 
              key={index} 
              asChild
              variant="outline" 
              className="border-awfar-primary text-awfar-primary"
            >
              <Link to={industry.link}>
                <span>{industry.icon}</span>
                <span>ابني موظف {industry.title} الذكي</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryHelp;
