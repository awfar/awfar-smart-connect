
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Menu, Search } from 'lucide-react';
import SystemStatus from '@/components/dashboard/SystemStatus';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="h-16 md:h-20 border-b flex items-center fixed top-0 w-full z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:static">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="mr-4 flex items-center">
            <img 
              src="/lovable-uploads/c404f91d-42bc-4601-8675-47a02888d011.png" 
              alt="Awfar Logo" 
              className="h-9" 
            />
          </div>
          
          <div className="relative hidden md:flex items-center">
            <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث..."
              className="h-10 w-64 rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* System Status */}
          <SystemStatus />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="صورة المستخدم" />
                  <AvatarFallback>مس</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rtl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">محمد سعيد</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    mohamed@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem>
                الإعدادات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
