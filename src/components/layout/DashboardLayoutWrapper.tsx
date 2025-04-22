
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { useBreakpoints } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const DashboardLayoutWrapper: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isMobile } = useBreakpoints();
  const navigate = useNavigate();
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onMenuToggle={toggleMobileSidebar} />
      
      <div className="flex flex-1 pt-16 md:pt-20">
        {/* For desktop, sidebar is always visible */}
        {!isMobile && <DashboardNav />}
        
        {/* For mobile, sidebar is shown conditionally */}
        {isMobile && <DashboardNav mobileOpen={mobileSidebarOpen} onClose={closeMobileSidebar} />}
        
        <main className="flex-1 overflow-auto px-4 py-6 md:px-6">
          <div className="container mx-auto max-w-7xl">
            {/* Quick Access Dashboard Button */}
            <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 py-2 flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 hover:bg-awfar-primary hover:text-white border-awfar-primary/30"
                onClick={goToDashboard}
              >
                <Home className="h-4 w-4" />
                <span>لوحة التحكم</span>
              </Button>
              <div className="text-sm text-muted-foreground">
                نظام عوفر - الإدارة المتكاملة
              </div>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayoutWrapper;
