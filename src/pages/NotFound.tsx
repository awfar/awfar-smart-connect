
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl">
      <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-awfar-primary">404</h1>
        <p className="text-xl text-gray-600 mb-6">عذراً، الصفحة المطلوبة غير موجودة</p>
        <p className="text-gray-600 mb-8">
          قد تكون الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو لم تعد متاحة.
        </p>
        <Button asChild className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
          <Link to="/">العودة إلى الصفحة الرئيسية</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
