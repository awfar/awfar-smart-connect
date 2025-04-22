
import { useLocation, useNavigate } from 'react-router-dom';
import { navItems } from './navItemsConfig';
import NavItem from './NavItem';

const DesktopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if a path is active, considering both exact matches and subpaths
  const isPathActive = (path: string) => {
    if (!path) return false;
    
    // Home page (dashboard) special case
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    
    // For other paths, check if the current path starts with this path
    // But only if it's not the dashboard path (to avoid matching all dashboard/* paths)
    return path !== '/dashboard' && location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="h-full w-64 border-l p-4 bg-awfar-primary text-white overflow-y-auto">
      <div className="flex justify-center mb-6 pt-2">
        <img 
          src="/lovable-uploads/2469fa9e-f2ef-495c-b429-586ab2bf0574.png" 
          alt="Awfar Logo" 
          className="h-9" 
        />
      </div>
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isPathActive(item.href)}
            subItems={item.subItems}
            expanded={item.subItems && (item.expanded || item.subItems.some(subItem => isPathActive(subItem.href)))}
          />
        ))}
      </div>
    </div>
  );
};

export default DesktopNav;
