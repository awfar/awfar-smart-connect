
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Menu, Search } from 'lucide-react';
import SystemStatus from '@/components/dashboard/SystemStatus';
import { useBreakpoints } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

// Extended user type to match what we're using in the component
interface ExtendedUser {
  id?: string;
  email?: string;
  avatar_url?: string | null;
  first_name?: string;
  last_name?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle }) => {
  const { isMobile } = useBreakpoints();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Cast the user to our extended type
  const extendedUser = user as unknown as ExtendedUser;
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const userInitials = extendedUser?.email ? 
    extendedUser.email.substring(0, 2).toUpperCase() : 
    'مس';

  return (
    <header className="h-16 md:h-20 border-b flex items-center fixed top-0 w-full z-50 bg-awfar-primary backdrop-blur supports-[backdrop-filter]:bg-awfar-primary/90">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-awfar-primary/80" 
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">القائمة الرئيسية</span>
          </Button>
          
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/2469fa9e-f2ef-495c-b429-586ab2bf0574.png" 
              alt="Awfar Logo" 
              className="h-9" 
            />
          </div>
          
          {!isMobile && (
            <div className="relative hidden md:flex items-center">
              <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث..."
                className="h-10 w-64 rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* System Status - now visible on both mobile and desktop */}
          <SystemStatus />
          
          {/* Notification Bell - now visible on both mobile and desktop */}
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-awfar-primary/80">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
            <span className="sr-only">الإشعارات</span>
          </Button>
          
          {/* User Profile Dropdown - now visible on both mobile and desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-white/30">
                  <AvatarImage src={extendedUser?.avatar_url || "/placeholder.svg"} alt="صورة المستخدم" />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rtl mt-1" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{extendedUser?.first_name || ''} {extendedUser?.last_name || ''}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {extendedUser?.email || 'مستخدم غير معروف'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                الإعدادات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
