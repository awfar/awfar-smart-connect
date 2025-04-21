
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Tasks: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">المهام</h1>
        <p>قائمة المهام تظهر هنا</p>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
