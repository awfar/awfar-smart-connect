
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-awfar-primary/10 mb-6">
              <span className="text-6xl font-bold text-awfar-primary">404</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">عذراً، الصفحة غير موجودة</h1>
            <p className="max-w-md mx-auto text-gray-600 mb-8">
              يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>العودة للرئيسية</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/demo">
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                <span>طلب عرض توضيحي</span>
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-awfar-primary/10 mx-auto mb-4">
                <Search className="h-6 w-6 text-awfar-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">استكشف خدماتنا</h3>
              <p className="text-gray-600 mb-4">اطلع على مجموعة الخدمات والمنتجات المتميزة التي نقدمها</p>
              <Link to="/ai-agent" className="text-awfar-primary font-medium hover:underline">
                تعرف على خدماتنا
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-awfar-primary/10 mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-awfar-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">هل تحتاج للمساعدة؟</h3>
              <p className="text-gray-600 mb-4">فريق الدعم الفني جاهز للإجابة على استفساراتك</p>
              <Link to="/demo" className="text-awfar-primary font-medium hover:underline">
                تواصل معنا
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-awfar-primary/10 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-awfar-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">جرب الموظف الذكي</h3>
              <p className="text-gray-600 mb-4">احصل على تجربة مجانية لمدة 14 يوم واستمتع بكامل المميزات</p>
              <Link to="/demo" className="text-awfar-primary font-medium hover:underline">
                ابدأ التجربة المجانية
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
