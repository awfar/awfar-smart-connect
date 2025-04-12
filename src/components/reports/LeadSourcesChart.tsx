
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadSourceData } from '@/services/reportsService';

interface LeadSourcesChartProps {
  data?: LeadSourceData[];
  isLoading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#3498DB', '#E74C3C'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow rounded border">
        <p className="font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
        {payload[0].payload.percentage && (
          <p>{`النسبة: ${payload[0].payload.percentage}%`}</p>
        )}
      </div>
    );
  }
  return null;
};

const LeadSourcesChart: React.FC<LeadSourcesChartProps> = ({ data, isLoading }) => {
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

  // Default pie chart
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))
          }
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export { LeadSourcesChart };
