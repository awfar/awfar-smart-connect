
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const features = [
    'إدارة متكاملة لعلاقات العملاء',
    'واجهة سهلة الاستخدام',
    'تحليلات وتقارير متقدمة',
    'تكامل مع جميع قنوات التواصل',
    'دعم فني على مدار الساعة'
  ];

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center max-w-6xl mx-auto">
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">ابدأ رحلتك مع أوفر</h1>
              <p className="text-gray-600 mb-8 text-center md:text-right max-w-md">
                أنشئ حسابك الآن واستفد من جميع مزايا منصة أوفر لإدارة علاقات عملائك وزيادة مبيعاتك.
              </p>
              
              <div className="space-y-4 mb-8 w-full max-w-md">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <img 
                src="/public/placeholder.svg" 
                alt="إنشاء حساب" 
                className="w-full max-w-md hidden md:block"
              />
            </div>
            
            <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8 order-1 md:order-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h2>
                <p className="text-gray-600">املأ البيانات التالية للتسجيل في منصة أوفر</p>
              </div>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">الاسم الأول</label>
                    <Input 
                      id="firstName" 
                      placeholder="أدخل الاسم الأول" 
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">اسم العائلة</label>
                    <Input 
                      id="lastName" 
                      placeholder="أدخل اسم العائلة" 
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="أدخل بريدك الإلكتروني" 
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">اسم الشركة</label>
                  <Input 
                    id="company" 
                    placeholder="أدخل اسم شركتك" 
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="أدخل كلمة المرور" 
                      className="w-full"
                    />
                    <button 
                      type="button" 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="أعد إدخال كلمة المرور" 
                      className="w-full"
                    />
                    <button 
                      type="button" 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    أوافق على <Link to="/terms" className="text-primary hover:underline">شروط الاستخدام</Link> و <Link to="/privacy" className="text-primary hover:underline">سياسة الخصوصية</Link>
                  </label>
                </div>
                
                <Button type="submit" className="w-full">إنشاء حساب</Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">أو</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" className="w-full">
                    <img src="/public/placeholder.svg" alt="Google" className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <img src="/public/placeholder.svg" alt="Microsoft" className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
                    Microsoft
                  </Button>
                </div>
                
                <p className="text-sm text-center text-gray-600">
                  لديك حساب بالفعل؟{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    تسجيل الدخول
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
