
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 rtl">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-6">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
        </p>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate('/')}>
            الذهاب إلى الصفحة الرئيسية
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
            العودة إلى الصفحة السابقة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
