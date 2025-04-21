
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Companies: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">الشركات</h1>
        <p>قائمة الشركات تظهر هنا</p>
      </div>
    </DashboardLayout>
  );
};

export default Companies;
