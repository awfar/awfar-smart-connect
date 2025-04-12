
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import SalesChart from '@/components/dashboard/SalesChart';
import LeadsOverview from '@/components/dashboard/LeadsOverview';
import RecentActivities from '@/components/dashboard/RecentActivities';
import TeamPerformance from '@/components/dashboard/TeamPerformance';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <LeadsOverview />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivities />
          </div>
          <div>
            <TeamPerformance />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
