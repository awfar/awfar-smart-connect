
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface SalesChartProps {
  showDetailed?: boolean;
}

const SalesChart = ({ showDetailed = false }: SalesChartProps) => {
  const [timeRange, setTimeRange] = useState("month");
  
  const monthlyData = [
    { name: "يناير", مبيعات: 65000, فرص: 85000 },
    { name: "فبراير", مبيعات: 59000, فرص: 73000 },
    { name: "مارس", مبيعات: 80000, فرص: 110000 },
    { name: "أبريل", مبيعات: 81000, فرص: 129000 },
    { name: "مايو", مبيعات: 76000, فرص: 110000 },
    { name: "يونيو", مبيعات: 105000, فرص: 142000 },
    { name: "يوليو", مبيعات: 120000, فرص: 155000 },
    { name: "أغسطس", مبيعات: 98000, فرص: 130000 },
    { name: "سبتمبر", مبيعات: 127000, فرص: 160000 },
    { name: "أكتوبر", مبيعات: 135000, فرص: 175000 },
    { name: "نوفمبر", مبيعات: 162000, فرص: 200000 },
    { name: "ديسمبر", مبيعات: 170000, فرص: 220000 },
  ];
  
  const quarterlyData = [
    { name: "الربع الأول", مبيعات: 204000, فرص: 268000 },
    { name: "الربع الثاني", مبيعات: 262000, فرص: 381000 },
    { name: "الربع الثالث", مبيعات: 345000, فرص: 445000 },
    { name: "الربع الرابع", مبيعات: 467000, فرص: 595000 },
  ];
  
  const weeklyData = [
    { name: "الأسبوع 1", مبيعات: 18000, فرص: 24000 },
    { name: "الأسبوع 2", مبيعات: 22000, فرص: 28000 },
    { name: "الأسبوع 3", مبيعات: 17000, فرص: 23000 },
    { name: "الأسبوع 4", مبيعات: 24000, فرص: 30000 },
  ];
  
  const getData = () => {
    switch (timeRange) {
      case "week":
        return weeklyData;
      case "quarter":
        return quarterlyData;
      default:
        return monthlyData;
    }
  };
  
  return (
    <>
      {showDetailed && (
        <div className="flex justify-between mb-4">
          <div className="space-x-2 rtl:space-x-reverse">
            <select 
              className="px-3 py-2 border rounded-md text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">أسبوعي</option>
              <option value="month">شهري</option>
              <option value="quarter">ربع سنوي</option>
            </select>
          </div>
        </div>
      )}
      
      <div className={showDetailed ? "h-full" : "h-[300px]"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={getData()}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="مبيعات" 
              stackId="1"
              stroke="#4361EE" 
              fill="#4361EE" 
              fillOpacity={0.6} 
            />
            <Area 
              type="monotone" 
              dataKey="فرص" 
              stackId="2"
              stroke="#2B0A3D" 
              fill="#2B0A3D" 
              fillOpacity={0.3} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default SalesChart;
