
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { useBreakpoints } from '@/hooks/use-mobile';

const DashboardLayoutWrapper: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const { isMobile } = useBreakpoints();
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayoutWrapper;
