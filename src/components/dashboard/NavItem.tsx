
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ChevronDown, ChevronLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { NavItemConfig } from './navItemsConfig';

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isMobile?: boolean;
  onClose?: () => void;
  subItems?: NavItemConfig[];
  expanded?: boolean;
}

const NavItem = ({ 
  href, 
  label, 
  icon: Icon, 
  isActive, 
  isMobile, 
  onClose,
  subItems,
  expanded: defaultExpanded = false
}: NavItemProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggleExpand = (e: React.MouseEvent) => {
    if (subItems && subItems.length > 0) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  // Определяем, активен ли элемент или любой из его дочерних элементов
  const isActiveItem = isActive || (subItems?.some(item => window.location.pathname === item.href) ?? false);
  
  const renderContent = () => (
    <Button
      variant={isActiveItem ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-between gap-2 text-right",
        isActiveItem
          ? "bg-awfar-accent text-awfar-primary hover:bg-awfar-accent/90"
          : "text-white hover:bg-awfar-primary/50 hover:text-gray-200"
      )}
      onClick={subItems?.length ? handleToggleExpand : undefined}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      {subItems && subItems.length > 0 && (
        expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {subItems && subItems.length > 0 ? (
          <div className="space-y-1">
            {renderContent()}
            {expanded && (
              <div className="mr-4 border-r border-gray-700 pr-2">
                {subItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link to={item.href} onClick={onClose} className="block w-full">
                      <Button
                        variant={window.location.pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-2 text-right mt-1",
                          window.location.pathname === item.href
                            ? "bg-awfar-accent text-awfar-primary hover:bg-awfar-accent/90"
                            : "text-white hover:bg-awfar-primary/50 hover:text-gray-200"
                        )}
                        size="sm"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.label}</span>
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            )}
          </div>
        ) : (
          <SheetClose asChild>
            <Link to={href} onClick={onClose} className="block w-full">
              {renderContent()}
            </Link>
          </SheetClose>
        )}
      </>
    );
  }
  
  return (
    <div className="space-y-1">
      {subItems && subItems.length > 0 ? (
        <>
          <div onClick={handleToggleExpand} className="cursor-pointer">
            {renderContent()}
          </div>
          {expanded && (
            <div className="mr-4 border-r border-gray-700 pr-2">
              {subItems.map((item) => (
                <Link key={item.href} to={item.href} className="block w-full">
                  <Button
                    variant={window.location.pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 text-right mt-1",
                      window.location.pathname === item.href
                        ? "bg-awfar-accent text-awfar-primary hover:bg-awfar-accent/90"
                        : "text-white hover:bg-awfar-primary/50 hover:text-gray-200"
                    )}
                    size="sm"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link to={href}>
          {renderContent()}
        </Link>
      )}
    </div>
  );
};

export default NavItem;
