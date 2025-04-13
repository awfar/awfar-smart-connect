
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchActivityAnalytics, ActivityAnalytic } from '@/services/analytics/activityAnalyticsService';

type AnalyticsType = 'action' | 'user' | 'entity';

const UserActivityAnalytics: React.FC = () => {
  const [analyticsType, setAnalyticsType] = useState<AnalyticsType>('action');

  const { data, isLoading } = useQuery({
    queryKey: ['activityAnalytics'],
    queryFn: fetchActivityAnalytics,
  });

  const colors = ['#4361EE', '#3A0CA3', '#7209B7', '#F72585', '#4CC9F0'];

  const renderChart = () => {
    if (isLoading) {
      return <Skeleton className="h-[320px] w-full" />;
    }

    // Early return if no data
    if (!data) {
      return (
        <div className="flex items-center justify-center h-[320px] text-muted-foreground">
          لا توجد بيانات متاحة
        </div>
      );
    }

    // Select the appropriate data array based on analyticsType
    const chartData = analyticsType === 'action' ? data.byType : 
                      analyticsType === 'user' ? data.byUser : data.byEntity;

    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[320px] text-muted-foreground">
          لا توجد بيانات متاحة
        </div>
      );
    }

    return (
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
                border: "1px solid #f0f0f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#4361EE" 
              radius={[6, 6, 0, 0]} 
              barSize={30}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-awfar-primary/5 to-white pb-2 border-b border-gray-100 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-awfar-primary">تحليلات نشاط المستخدمين</CardTitle>
        <div className="w-48">
          <Select value={analyticsType} onValueChange={(value) => setAnalyticsType(value as AnalyticsType)}>
            <SelectTrigger className="bg-white border-gray-200">
              <SelectValue placeholder="نوع التحليل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="action">حسب الإجراء</SelectItem>
              <SelectItem value="user">حسب المستخدم</SelectItem>
              <SelectItem value="entity">حسب نوع الكيان</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default UserActivityAnalytics;
