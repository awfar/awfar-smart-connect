
import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };
  
  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col rtl">
      <DashboardHeader onMenuToggle={toggleMobileNav} />
      
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        {!isMobile && <DashboardNav />}
        
        {/* Mobile sidebar */}
        {isMobile && (
          <DashboardNav 
            mobileOpen={mobileNavOpen} 
            onClose={closeMobileNav} 
          />
        )}
        
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
