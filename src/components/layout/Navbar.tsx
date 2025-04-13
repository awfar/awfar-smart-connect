
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // تحقق من حجم الشاشة عند التحميل وعند التغيير
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const menuItems = [
    {
      title: "الرئيسية",
      path: "/",
    },
    {
      title: "الذكاء الاصطناعي",
      path: "/ai-agent",
    },
    {
      title: "جرّب الوكيل الذكي",
      path: "/demo",
    },
    {
      title: "قنوات التواصل",
      path: "/channels",
    },
    {
      title: "الحلول الشاملة",
      path: "/solutions",
    },
    {
      title: "التكامل",
      path: "/integration",
    },
    {
      title: "الأسعار",
      path: "/pricing",
    },
    {
      title: "من نحن",
      path: "/about",
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    console.log("Menu toggled, isOpen:", !isOpen); // إضافة سجل للتتبع
  };

  // إغلاق القائمة عند النقر على أي عنصر فيها
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img 
                src="/lovable-uploads/c404f91d-42bc-4601-8675-47a02888d011.png" 
                alt="Awfar Logo" 
                className="h-10" 
              />
            </Link>
          </div>

          {/* Mobile Menu Button - موضع معدل ليكون واضحاً */}
          <button
            onClick={toggleMenu}
            type="button"
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-awfar-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-awfar-primary z-50"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:block md:flex-1">
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-gray-700 hover:text-awfar-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center">
            <Button asChild variant="outline" className="mr-3">
              <Link to="/login">دخول</Link>
            </Button>
            <Button asChild>
              <Link to="/register">تسجيل</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - تم إعادة تصميمها لتكون أكثر وضوحاً */}
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-white z-40 transition-opacity duration-300 ease-in-out",
          isOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-6 overflow-y-auto">
          {/* Logo داخل القائمة */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/c404f91d-42bc-4601-8675-47a02888d011.png" 
              alt="Awfar Logo" 
              className="h-10" 
            />
          </div>
          
          {/* روابط القائمة */}
          <div className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={closeMenu}
                className="block text-center text-gray-700 hover:bg-gray-50 hover:text-awfar-primary px-3 py-3 rounded-md text-lg font-medium"
              >
                {item.title}
              </Link>
            ))}
          </div>
          
          {/* أزرار تسجيل الدخول داخل القائمة المتحركة */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login" onClick={closeMenu}>دخول</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/register" onClick={closeMenu}>تسجيل</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
