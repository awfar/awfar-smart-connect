
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Calendar: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">التقويم</h1>
        <p>التقويم يظهر هنا</p>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
