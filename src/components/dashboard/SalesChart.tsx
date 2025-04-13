
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SalesChart = () => {
  const isMobile = useIsMobile();
  
  const data = [
    {
      name: "يناير",
      مبيعات: 4000,
      عملاء: 2400,
      استفسارات: 2400,
    },
    {
      name: "فبراير",
      مبيعات: 3000,
      عملاء: 1398,
      استفسارات: 2210,
    },
    {
      name: "مارس",
      مبيعات: 2000,
      عملاء: 9800,
      استفسارات: 2290,
    },
    {
      name: "أبريل",
      مبيعات: 2780,
      عملاء: 3908,
      استفسارات: 2000,
    },
    {
      name: "مايو",
      مبيعات: 1890,
      عملاء: 4800,
      استفسارات: 2181,
    },
    {
      name: "يونيو",
      مبيعات: 2390,
      عملاء: 3800,
      استفسارات: 2500,
    },
    {
      name: "يوليو",
      مبيعات: 3490,
      عملاء: 4300,
      استفسارات: 2100,
    },
  ];
  
  return (
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-2">
        <CardTitle className="text-lg font-medium">أداء المبيعات</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className={`${isMobile ? 'h-[250px]' : 'h-[300px]'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
              />
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
                dataKey="عملاء"
                stackId="1"
                stroke="#2B0A3D"
                fill="#2B0A3D"
                fillOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="استفسارات"
                stackId="1"
                stroke="#8aff00"
                fill="#8aff00"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
