
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

interface DashboardNavProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const DashboardNav = ({ mobileOpen = false, onClose }: DashboardNavProps) => {
  const isMobile = useIsMobile();

  // For desktop view
  if (!isMobile) {
    return <DesktopNav />;
  }

  // For mobile view
  return <MobileNav isOpen={mobileOpen} onClose={onClose || (() => {})} />;
};

export default DashboardNav;
