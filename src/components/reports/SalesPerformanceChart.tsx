
import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { SalesData } from '@/services/reportsService';

interface SalesPerformanceChartProps {
  data?: SalesData[];
  period: string;
  isLoading: boolean;
  showByIndustry?: boolean;
  showLeadsGrowth?: boolean;
}

const SalesPerformanceChart: React.FC<SalesPerformanceChartProps> = ({ 
  data, 
  period, 
  isLoading, 
  showByIndustry = false,
  showLeadsGrowth = false
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

  // Choose chart type based on props
  if (showByIndustry) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value.toLocaleString()} ريال`, 'الإيرادات']}
            labelFormatter={(label) => `القطاع: ${label}`}
          />
          <Bar dataKey="value" name="الإيرادات" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (showLeadsGrowth) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="period" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="count" 
            name="عدد العملاء المحتملين"
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorCount)" 
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="growth" 
            name="نسبة النمو ٪"
            stroke="#82ca9d" 
            fill="#82ca9d"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Default chart showing sales performance
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value.toLocaleString()} ريال`]}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="value" 
          name="المبيعات" 
          stroke="#8884d8" 
          fillOpacity={1} 
          fill="url(#colorValue)" 
        />
        <Area 
          type="monotone" 
          dataKey="target" 
          name="المستهدف" 
          stroke="#82ca9d" 
          fillOpacity={0.3} 
          fill="url(#colorTarget)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesPerformanceChart;
