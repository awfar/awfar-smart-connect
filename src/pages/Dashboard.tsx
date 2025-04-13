
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import SalesChart from '@/components/dashboard/SalesChart';
import LeadsOverview from '@/components/dashboard/LeadsOverview';
import RecentActivities from '@/components/dashboard/RecentActivities';
import TeamPerformance from '@/components/dashboard/TeamPerformance';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchRecentActivities } from '@/services/dashboardService';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: fetchRecentActivities,
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 px-2 py-4 md:px-4 md:py-6">
        <div className="flex flex-col gap-3 bg-gradient-to-r from-awfar-primary/5 to-transparent p-4 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-awfar-primary">لوحة التحكم</h1>
          <p className="text-muted-foreground text-sm md:text-base">مرحبًا بك في لوحة التحكم، إليك نظرة عامة على أداء الأعمال</p>
        </div>
        
        <StatsCards isLoading={statsLoading} stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesChart />
          <LeadsOverview />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentActivities isLoading={activitiesLoading} activities={activities} />
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
