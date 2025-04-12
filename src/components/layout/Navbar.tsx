
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };
  
  const navLinks = [
    { href: '/', label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/ai-agent', label: language === 'ar' ? 'الذكاء الاصطناعي' : 'AI Agent' },
    { href: '/channels', label: language === 'ar' ? 'قنوات التواصل' : 'Channels' },
    { href: '/solutions', label: language === 'ar' ? 'الحلول الشاملة' : 'Solutions' },
    { href: '/integration', label: language === 'ar' ? 'التكامل' : 'Integration' },
    { href: '/pricing', label: language === 'ar' ? 'الأسعار' : 'Pricing' },
    { href: '/about', label: language === 'ar' ? 'من نحن' : 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-awfar-primary">Awfar</span>
            <span className="text-2xl font-bold text-awfar-accent">.com</span>
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-awfar-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full"
            aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline">
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Button>
            <Button className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
              {language === 'ar' ? 'تسجيل' : 'Sign up'}
            </Button>
          </div>
          
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-3 mt-4">
                    <Button variant="outline" className="w-full">
                      {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
                      {language === 'ar' ? 'تسجيل' : 'Sign up'}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
