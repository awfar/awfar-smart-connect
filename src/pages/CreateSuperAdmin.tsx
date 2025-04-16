
import { useNavigate } from "react-router-dom";
import CreateSuperAdminTool from "@/components/users/CreateSuperAdminTool";
import { ScrollArea } from "@/components/ui/scroll-area";
import MobileOptimizedContainer from "@/components/ui/mobile-optimized-container";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const CreateSuperAdmin = () => {
  const navigate = useNavigate();

  // بعد إنشاء المستخدم بنجاح، يمكن للمستخدم النقر على هذا الزر للانتقال إلى صفحة المستخدمين
  const handleGoToUsers = () => {
    navigate('/users');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center mt-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">إنشاء مستخدم جديد كمسؤول (سوبر أدمن)</h1>
          <div className="w-full max-w-md">
            <MobileOptimizedContainer>
              <CreateSuperAdminTool />
            </MobileOptimizedContainer>
          </div>
          <div className="mt-6 pb-8">
            <p className="text-center mb-4">بعد إنشاء المستخدم، يمكنك الانتقال إلى صفحة إدارة المستخدمين</p>
            <button
              onClick={handleGoToUsers}
              className="mx-auto block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition"
            >
              الانتقال لصفحة المستخدمين
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateSuperAdmin;
