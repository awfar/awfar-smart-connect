
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Cell, LineChart, Line, PieChart, Pie
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductData, ProductComparisonData, ProductDistributionData } from '@/services/reportsService';

interface ProductsPerformanceChartProps {
  data?: ProductData[] | ProductComparisonData[] | ProductDistributionData[];
  isLoading: boolean;
  showDetailed?: boolean;
  showComparison?: boolean;
  showDistribution?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const ProductsPerformanceChart: React.FC<ProductsPerformanceChartProps> = ({ 
  data, 
  isLoading, 
  showDetailed = false,
  showComparison = false,
  showDistribution = false
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

  // Show detailed products performance
  if (showDetailed) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data as ProductData[]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'growth') return `${value}%`;
              return `${value.toLocaleString()} ريال`;
            }}
          />
          <Legend />
          <Bar dataKey="sales" name="المبيعات" fill="#8884d8" />
          <Bar dataKey="growth" name="النمو %" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Show product comparison
  if (showComparison) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data as ProductComparisonData[]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value.toLocaleString()} ريال`]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="current" 
            name="العام الحالي" 
            stroke="#8884d8" 
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="previous" 
            name="العام السابق" 
            stroke="#82ca9d"
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Show product distribution
  if (showDistribution) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data as ProductDistributionData[]}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {(data as ProductDistributionData[]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value.toLocaleString()} ريال`]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // Default products bar chart
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data as ProductData[]}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value.toLocaleString()} ريال`]}
        />
        <Legend />
        <Bar dataKey="sales" name="المبيعات" fill="#8884d8">
          {(data as ProductData[]).map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductsPerformanceChart;
