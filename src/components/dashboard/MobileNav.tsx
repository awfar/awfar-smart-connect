
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { navItems } from './navItemsConfig';
import NavItem from './NavItem';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { pathname } = useLocation();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="rtl p-0 w-[80%] sm:max-w-sm bg-awfar-primary text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="font-semibold text-white">القائمة</h2>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-awfar-primary/50">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
          
          <div className="flex justify-center my-4">
            <img 
              src="/lovable-uploads/2469fa9e-f2ef-495c-b429-586ab2bf0574.png" 
              alt="Awfar Logo" 
              className="h-9" 
            />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={pathname === item.href}
                  isMobile={true}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
