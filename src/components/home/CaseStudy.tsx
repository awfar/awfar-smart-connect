
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CirclePercentage } from "../ui/circle-percentage";

const CaseStudy = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">
            كيف غيَّر Awfar Chat Commerce تجربة عملاء شركة حمادة؟
          </h2>
          <h3 className="text-2xl text-awfar-secondary mb-2">من 10 دقائق إلى 10 ثوان!</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img 
              src="/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png" 
              alt="Case Study" 
              className="w-full rounded-lg shadow-lg"
            />
            <div className="absolute bottom-4 right-4 bg-awfar-primary text-white p-3 rounded-lg max-w-[200px]">
              <p className="text-sm">أهلاً السيد أيمن أهلاً</p>
              <p className="text-xs text-gray-300 mt-1">موظف الذكاء الاصطناعي</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="text-right">
                <h4 className="font-bold text-awfar-primary">تحسين تجربة العملاء</h4>
                <p className="text-gray-600">تحسن الرضا والاستجابة</p>
              </div>
              <CirclePercentage percentage={98} color="bg-purple-500" />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-right">
                <h4 className="font-bold text-awfar-primary">بدون تأخير</h4>
                <p className="text-gray-600">رد فوري على مدار 24 ساعة</p>
              </div>
              <CirclePercentage percentage={100} color="bg-blue-500" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-16 bg-green-100 rounded-t-lg relative">
                  <div className="absolute bottom-0 left-0 w-full bg-green-500 h-12"></div>
                </div>
                <p className="text-center mt-2">
                  <span className="block text-xl font-bold text-green-500">1550</span>
                  <span className="text-sm text-gray-600">رسائل يومية تم الرد عليها دون تدخل بشري</span>
                </p>
              </div>
            </div>
            
            <Button asChild className="w-full bg-awfar-primary hover:bg-awfar-primary/90">
              <Link to="/case-studies">تعرف على المزيد من قصص النجاح</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;
