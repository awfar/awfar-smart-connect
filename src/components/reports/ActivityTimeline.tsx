
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ActivityData, ActivityTypeData, ActivityEfficiencyData 
} from '@/services/reportsService';

interface ActivityTimelineProps {
  data?: ActivityData[] | ActivityTypeData[] | ActivityEfficiencyData[];
  isLoading: boolean;
  showByType?: boolean;
  showEfficiency?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  data, 
  isLoading, 
  showByType = false,
  showEfficiency = false
}) => {
  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        لا توجد بيانات متاحة
      </div>
    );
  }

  // Show activity types distribution
  if (showByType) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data as ActivityTypeData[]}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {(data as ActivityTypeData[]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // Show activity efficiency
  if (showEfficiency) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data as ActivityEfficiencyData[]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="efficiency" name="الكفاءة %" fill="#8884d8" />
          <Bar dataKey="impact" name="التأثير %" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Default activity timeline
  return (
    <div className="space-y-4">
      {(data as ActivityData[]).map((activity) => (
        <div key={activity.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs`}>
              {activity.user.initials}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="mx-1 text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{activity.type}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleDateString('ar-SA', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <p className="mt-1 text-sm">{activity.description}</p>
              {activity.entity && (
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">العميل: </span>
                  <span className="font-medium">{activity.entity.name}</span>
                </div>
              )}
              {activity.result && (
                <div className="mt-1 text-xs">
                  <span className="text-muted-foreground">النتيجة: </span>
                  <span className="font-medium">{activity.result}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
