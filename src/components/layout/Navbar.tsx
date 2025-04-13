
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

          {/* Mobile Menu Button - وضع في الطرف الأيمن */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-awfar-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-awfar-primary"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

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

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-20 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="px-4 py-3 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={closeMenu}
              className="block text-gray-700 hover:bg-gray-50 hover:text-awfar-primary px-3 py-2 rounded-md text-base font-medium"
            >
              {item.title}
            </Link>
          ))}
        </div>
        {/* Mobile Auth Buttons - تم نقلها إلى داخل القائمة المنسدلة */}
        <div className="pt-4 pb-3 border-t border-gray-200 px-4">
          <div className="flex flex-col space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/login" onClick={closeMenu}>دخول</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/register" onClick={closeMenu}>تسجيل</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
