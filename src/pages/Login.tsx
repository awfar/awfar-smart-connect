
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center max-w-6xl mx-auto">
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">مرحبًا بعودتك!</h1>
              <p className="text-gray-600 mb-8 text-center md:text-right max-w-md">
                سجل دخولك للوصول إلى منصة أوفر ومتابعة إدارة علاقات عملائك بكفاءة أعلى.
              </p>
              <img 
                src="/public/placeholder.svg" 
                alt="تسجيل الدخول" 
                className="w-full max-w-md hidden md:block"
              />
            </div>
            
            <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">تسجيل الدخول</h2>
                <p className="text-gray-600">أدخل بيانات حسابك للوصول إلى لوحة التحكم</p>
              </div>
              
              <form className="space-y-6">
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      تذكرني
                    </label>
                  </div>
                  <Link to="/forget-password" className="text-sm text-primary hover:underline">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                
                <Button type="submit" className="w-full">تسجيل الدخول</Button>
                
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
                  ليس لديك حساب؟{" "}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    إنشاء حساب
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

export default Login;
