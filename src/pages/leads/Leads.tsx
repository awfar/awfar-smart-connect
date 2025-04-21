
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Leads: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">العملاء المحتملين</h1>
        <p>قائمة العملاء المحتملين تظهر هنا</p>
      </div>
    </DashboardLayout>
  );
};

export default Leads;
