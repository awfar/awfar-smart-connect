
import { useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import CreateSuperAdminTool from "@/components/users/CreateSuperAdminTool";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const CreateSuperAdmin = () => {
  const navigate = useNavigate();

  // بعد إنشاء المستخدم بنجاح، يمكن للمستخدم النقر على هذا الزر للانتقال إلى صفحة المستخدمين
  const handleGoToUsers = () => {
    navigate('/dashboard/users');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center mt-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">إنشاء مستخدم جديد كمسؤول (سوبر أدمن)</h1>
              <div className="w-full max-w-md">
                <CreateSuperAdminTool />
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
        </main>
      </div>
    </div>
  );
};

export default CreateSuperAdmin;
