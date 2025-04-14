
import { useLocation } from 'react-router-dom';
import { navItems } from './navItemsConfig';
import NavItem from './NavItem';

const DesktopNav = () => {
  const location = useLocation();
  
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
            isActive={location.pathname === item.href}
            subItems={item.subItems}
            expanded={item.expanded || location.pathname.startsWith(item.href)}
          />
        ))}
      </div>
    </div>
  );
};

export default DesktopNav;
