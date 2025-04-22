
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  label: string;
  icon: any;
  isActive?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
  subItems?: {
    href: string;
    label: string;
    icon: any;
  }[];
  expanded?: boolean;
}

const NavItem = ({ 
  href, 
  label, 
  icon: Icon, 
  isActive = false,
  isMobile = false,
  onClose,
  subItems,
  expanded: defaultExpanded = false 
}: NavItemProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleClick = () => {
    if (subItems && subItems.length > 0) {
      setExpanded(!expanded);
    } else if (onClose) {
      onClose();
    }
  };

  const handleSubItemClick = () => {
    if (onClose) {
      onClose();
    }
  };

  // Style for the main nav item
  const navItemStyles = cn(
    "flex items-center py-2 px-3 rounded-md transition-colors", 
    {
      "bg-white/10 text-white": isActive,
      "hover:bg-white/5": !isActive
    }
  );

  // Style for sub items
  const subItemStyles = cn(
    "flex items-center py-2 pr-9 pl-2 rounded-md transition-colors text-sm",
    {
      "hover:bg-white/5": true
    }
  );

  return (
    <div>
      {subItems && subItems.length > 0 ? (
        // With submenu
        <>
          <button onClick={handleClick} className={navItemStyles + " w-full justify-between"}>
            <span className="flex items-center">
              <Icon className="h-4 w-4 ml-2 opacity-75" />
              {label}
            </span>
            <ChevronLeft className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
          
          {expanded && (
            <div className="pt-1 pl-2">
              {subItems.map((item) => {
                const ItemIcon = item.icon;
                const isSubItemActive = window.location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(subItemStyles, {
                      "bg-white/10 text-white": isSubItemActive
                    })}
                    onClick={handleSubItemClick}
                  >
                    <ItemIcon className="h-3.5 w-3.5 ml-2 opacity-75" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        // No submenu
        <Link to={href} onClick={handleClick} className={navItemStyles}>
          <Icon className="h-4 w-4 ml-2 opacity-75" />
          <span className="truncate">{label}</span>
        </Link>
      )}
    </div>
  );
};

export default NavItem;
