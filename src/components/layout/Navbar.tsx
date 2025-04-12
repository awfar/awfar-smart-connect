
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الذكاء الاصطناعي', path: '/ai-agent' },
    { name: 'جرّب الوكيل الذكي', path: '/try-ai-agent' },
    { name: 'قنوات التواصل', path: '/channels' },
    { name: 'الحلول الشاملة', path: '/solutions' },
    { name: 'التكامل', path: '/integration' },
    { name: 'الأسعار', path: '/pricing' },
    { name: 'من نحن', path: '/about-us' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1">
              <span className="text-xl md:text-2xl font-bold text-gray-900">Awfar</span>
              <span className="text-xl md:text-2xl font-bold text-awfar-primary">.com</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="mr-4 rtl:ml-4 rtl:mr-0">
              <Button asChild variant="outline" size="sm">
                <Link to="/auth/login">تسجيل الدخول</Link>
              </Button>
            </div>
            <Button asChild size="sm">
              <Link to="/auth/register">تسجيل</Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-4 md:hidden">
            <Button asChild variant="outline" size="sm" className="ml-2 rtl:mr-2 rtl:ml-0">
              <Link to="/auth/login">تسجيل الدخول</Link>
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="القائمة">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] rtl">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-2 border-b">
                    <Link to="/" className="flex items-center gap-1" onClick={() => setIsOpen(false)}>
                      <span className="text-xl font-bold text-gray-900">Awfar</span>
                      <span className="text-xl font-bold text-awfar-primary">.com</span>
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pt-4 pb-8">
                    <nav className="flex flex-col gap-1">
                      {navItems.map((item) => (
                        <SheetClose asChild key={item.name}>
                          <Link
                            to={item.path}
                            className={`px-4 py-3 text-base font-medium rounded-md transition-colors hover:bg-gray-100 ${
                              isActive(item.path) ? 'text-primary bg-primary/5' : 'text-gray-600'
                            }`}
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>
                  
                  <div className="pt-4 pb-6 border-t">
                    <div className="flex flex-col gap-4 px-4">
                      <Button asChild size="sm">
                        <Link to="/auth/register">تسجيل</Link>
                      </Button>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Globe className="h-4 w-4" />
                        <span>العربية</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
