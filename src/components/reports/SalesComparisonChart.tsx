
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { SalesComparisonData, ConversionRateData } from '@/services/reportsService';

interface SalesComparisonChartProps {
  data?: SalesComparisonData[] | ConversionRateData[];
  isLoading: boolean;
  showConversionRate?: boolean;
}

const SalesComparisonChart: React.FC<SalesComparisonChartProps> = ({ 
  data, 
  isLoading, 
  showConversionRate = false
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
  
  // Show conversion rate chart
  if (showConversionRate) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data as ConversionRateData[]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={(value) => [`${value}%`]}
          />
          <Line 
            type="monotone" 
            dataKey="rate" 
            name="معدل التحويل" 
            stroke="#8884d8"
            strokeWidth={2} 
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Default sales comparison chart
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data as SalesComparisonData[]}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value.toLocaleString()} ريال`]}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="current" 
          name="الفترة الحالية" 
          fill="url(#colorCurrent)"
          stroke="#8884d8" 
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="previous" 
          name="الفترة السابقة" 
          fill="url(#colorPrevious)"
          stroke="#82ca9d" 
          fillOpacity={0.3}
        />
        <Bar
          dataKey="difference"
          name="الفرق"
          fill="#ff7300"
          barSize={20}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default SalesComparisonChart;
