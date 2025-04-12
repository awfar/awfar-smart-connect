
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, FunnelChart, Funnel, FunnelProps, LabelList
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadSourceData, LeadFunnelData } from '@/services/reportsService';

interface LeadSourcesChartProps {
  data?: LeadSourceData[] | LeadFunnelData[];
  isLoading: boolean;
  showDetailed?: boolean;
  showFunnel?: boolean;
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

const LeadSourcesChart: React.FC<LeadSourcesChartProps> = ({ 
  data, 
  isLoading, 
  showDetailed = false,
  showFunnel = false 
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

  // Show funnel chart for lead conversion stages
  if (showFunnel) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip content={<CustomTooltip />} />
          <Funnel
            dataKey="count"
            data={data as LeadFunnelData[]}
            isAnimationActive
            nameKey="stage"
          >
            <LabelList position="right" fill="#000" stroke="none" dataKey="stage" />
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))
            }
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    );
  }

  // Show detailed bar chart
  if (showDetailed) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data as LeadSourceData[]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="value" 
            name="عدد العملاء" 
            fill="#8884d8"
          >
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))
            }  
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Default pie chart
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data as LeadSourceData[]}
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

export default LeadSourcesChart;
