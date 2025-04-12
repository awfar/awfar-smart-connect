
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, LineChart, Line, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamData, TeamTargetsData, TeamEfficiencyData } from '@/services/reportsService';
import { CirclePercentage } from '@/components/ui/circle-percentage';

interface TeamPerformanceReportProps {
  data?: TeamData[] | TeamTargetsData[] | TeamEfficiencyData[];
  isLoading: boolean;
  showDetailed?: boolean;
  showTargets?: boolean;
  showEfficiency?: boolean;
}

const TeamPerformanceReport: React.FC<TeamPerformanceReportProps> = ({ 
  data, 
  isLoading,
  showDetailed = false, 
  showTargets = false,
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

  // Show detailed team performance
  if (showDetailed) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data as TeamData[]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip 
            formatter={(value) => [`${value.toLocaleString()} ريال`]}
          />
          <Legend />
          <Bar dataKey="sales" name="المبيعات" fill="#4361EE" />
          <Bar dataKey="target" name="المستهدف" fill="#2B0A3D" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Show team targets with achievement percentages
  if (showTargets) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(data as TeamTargetsData[]).map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center border rounded-lg p-4">
            <CirclePercentage 
              percentage={item.achievement} 
              color={item.achievement >= 100 ? "text-green-500" : "text-amber-500"} 
            />
            <div className="mt-2 text-center">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.actual.toLocaleString()} / {item.target.toLocaleString()} ريال
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show team efficiency radar chart
  if (showEfficiency) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data as TeamEfficiencyData[]}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="الكفاءة"
            dataKey="efficiency"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="المتوسط"
            dataKey="average"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.4}
          />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  // Default horizontal bar chart
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data as TeamData[]}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout="horizontal"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => {
            if (name === "conversion") return `${value}%`;
            return `${value.toLocaleString()} ريال`;
          }}
        />
        <Legend />
        <Bar dataKey="sales" name="المبيعات" fill="#4361EE" />
        <Bar dataKey="target" name="المستهدف" fill="#2B0A3D" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TeamPerformanceReport;
