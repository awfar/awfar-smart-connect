
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Check if a path is active, considering both exact matches and subpaths
  const isPathActive = (path: string) => {
    if (!path) return false;
    
    // Home page (dashboard) special case
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    
    // For other paths, check if the current path starts with this path
    // But only if it's not the dashboard path (to avoid matching all dashboard/* paths)
    return path !== '/dashboard' && pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="rtl p-0 w-[85%] sm:w-[80%] sm:max-w-sm bg-awfar-primary text-white overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="font-semibold text-white text-lg">القائمة</h2>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-awfar-primary/50">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
          
          <div className="flex justify-center my-4">
            <img 
              src="/lovable-uploads/2469fa9e-f2ef-495c-b429-586ab2bf0574.png" 
              alt="Awfar Logo" 
              className="h-10" 
            />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={isPathActive(item.href)}
                  isMobile={true}
                  onClose={onClose}
                  subItems={item.subItems}
                  expanded={item.subItems && item.subItems.some(subItem => isPathActive(subItem.href))}
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
