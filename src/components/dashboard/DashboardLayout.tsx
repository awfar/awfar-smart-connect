
import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardNav from './DashboardNav';
import { useBreakpoints } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// NOTE: This component is no longer in use as we've migrated to DashboardLayoutWrapper
// This is kept for reference but should be deprecated in favor of DashboardLayoutWrapper
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // This logs a deprecation warning to help us track down any remaining usages
  console.warn("DashboardLayout is deprecated. Please use DashboardLayoutWrapper instead.");
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
