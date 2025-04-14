
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SystemTestRunner from '@/components/tests/SystemTestRunner';

const SystemTests: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">اختبار النظام الشامل</h1>
        <SystemTestRunner />
      </div>
    </DashboardLayout>
  );
};

export default SystemTests;
