import React from 'react';
import AuthButton from './AuthButton';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 rtl">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">لوحة التحكم</h1>
          <div className="flex items-center gap-2">
            <AuthButton />
          </div>
        </div>
      </div>
      <div className="flex-1 container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
