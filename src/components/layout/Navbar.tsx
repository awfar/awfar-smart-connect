
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="/lovable-uploads/3020e17e-f138-47f6-ad1e-029e32c4540f.png" 
                alt="Awfar Logo" 
                className="h-10" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center">
            <Button asChild variant="outline" className="mr-3">
              <Link to="/login">دخول</Link>
            </Button>
            <Button asChild>
              <Link to="/register">تسجيل</Link>
            </Button>
          </div>

          {/* Mobile Menu Button - Moved to the right side */}
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
        </div>
      </div>

      {/* Mobile Menu - Fixed positioning for better mobile experience */}
      <div
        className={cn(
          "md:hidden bg-white absolute top-20 left-0 right-0 w-full z-20 shadow-lg transition-all duration-300 ease-in-out",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={toggleMenu}
              className="text-gray-700 hover:bg-gray-50 hover:text-awfar-primary block px-3 py-2 rounded-md text-base font-medium"
            >
              {item.title}
            </Link>
          ))}
        </div>
        {/* Mobile Auth Buttons - Inside the menu */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex flex-col px-4 space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/login" onClick={toggleMenu}>دخول</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/register" onClick={toggleMenu}>تسجيل</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
