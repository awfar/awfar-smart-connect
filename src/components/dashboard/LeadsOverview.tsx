
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const LeadsOverview = () => {
  const data = [
    { name: "المبيعات المباشرة", value: 35 },
    { name: "مواقع التواصل", value: 25 },
    { name: "الموقع الإلكتروني", value: 20 },
    { name: "الإحالات", value: 15 },
    { name: "أخرى", value: 5 },
  ];
  
  const COLORS = ["#4361EE", "#2B0A3D", "#8aff00", "#FF6B6B", "#FFBB28"];
  
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-awfar-primary/5 to-white pb-2 border-b border-gray-100">
        <CardTitle className="text-lg font-medium text-awfar-primary">نظرة عامة على العملاء المحتملين</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="h-[320px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
                wrapperStyle={{
                  paddingTop: "20px"
                }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, "النسبة"]}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsOverview;
