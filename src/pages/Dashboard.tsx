
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import SalesChart from '@/components/dashboard/SalesChart';
import LeadsOverview from '@/components/dashboard/LeadsOverview';
import RecentActivities from '@/components/dashboard/RecentActivities';
import TeamPerformance from '@/components/dashboard/TeamPerformance';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchRecentActivities, DashboardStats } from '@/services/dashboardService';

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
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <StatsCards isLoading={statsLoading} stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <LeadsOverview />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
