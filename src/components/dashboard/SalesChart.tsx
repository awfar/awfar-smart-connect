
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
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-awfar-primary/5 to-white pb-2 border-b border-gray-100">
        <CardTitle className="text-lg font-medium text-awfar-primary">أداء المبيعات</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className={`${isMobile ? 'h-[250px]' : 'h-[320px]'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="مبيعات"
                stackId="1"
                stroke="#4361EE"
                fill="#4361EE"
                fillOpacity={0.7}
              />
              <Area
                type="monotone"
                dataKey="عملاء"
                stackId="1"
                stroke="#2B0A3D"
                fill="#2B0A3D"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="استفسارات"
                stackId="1"
                stroke="#8aff00"
                fill="#8aff00"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
