
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { SheetClose } from '@/components/ui/sheet';

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

const NavItem = ({ href, label, icon: Icon, isActive, isMobile, onClose }: NavItemProps) => {
  if (isMobile) {
    return (
      <SheetClose asChild>
        <Link to={href} onClick={onClose}>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 text-right",
              isActive
                ? "bg-awfar-accent text-awfar-primary hover:bg-awfar-accent/90"
                : "text-white hover:bg-awfar-primary/50 hover:text-gray-200"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        </Link>
      </SheetClose>
    );
  }
  
  return (
    <Link to={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 text-right",
          isActive
            ? "bg-awfar-accent text-awfar-primary hover:bg-awfar-accent/90"
            : "text-white hover:bg-awfar-primary/50 hover:text-gray-200"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
};

export default NavItem;
