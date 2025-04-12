
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WorkHoursComparison = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-awfar-primary mb-4">
            الفرق بين ساعات عمل
          </h2>
          <h3 className="text-2xl text-awfar-secondary">
            موظف Awfar Chat Commerce الذكي والموظف البشري
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png"
                alt="AI Employee"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-awfar-primary">جدول موظف Awfar Chat</h4>
                <p className="text-sm text-gray-600">Commerce الذكي في 8 ساعات عمل 24 ســــــاعة يومياً!</p>
              </div>
            </div>
            
            <div className="relative h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-lg font-bold">
                  24
                </text>
                <text x="50" y="60" textAnchor="middle" dy="0.3em" className="text-sm">
                  ساعة
                </text>
              </svg>
            </div>
            
            <p className="text-center text-gray-600 text-sm">يعمل بكامل طاقته طوال اليوم</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png"
                alt="Human Employee"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-700">جدول موظف خدمة العــــلاء</h4>
                <p className="text-sm text-gray-600">فـــي 8 ساعات عمل</p>
              </div>
            </div>
            
            <div className="relative h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="167.5"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-lg font-bold">
                  8
                </text>
                <text x="50" y="60" textAnchor="middle" dy="0.3em" className="text-sm">
                  ساعات
                </text>
              </svg>
            </div>
            
            <p className="text-center text-gray-600 text-sm">مع ساعات راحة وإجازات وعطلات</p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild className="bg-awfar-primary hover:bg-awfar-primary/90">
            <Link to="/demo">قم بتجربة الموظف الذكي الآن</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WorkHoursComparison;
