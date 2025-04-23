
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * @deprecated This component is completely deprecated. Use DashboardLayoutWrapper instead.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  console.warn("DashboardLayout is deprecated. Please use DashboardLayoutWrapper instead.");
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
