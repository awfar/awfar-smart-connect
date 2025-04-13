
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TeamPerformance = () => {
  const data = [
    {
      name: "أحمد",
      المبيعات: 45000,
      المستهدف: 40000,
    },
    {
      name: "ياسمين",
      المبيعات: 32000,
      المستهدف: 30000,
    },
    {
      name: "عمر",
      المبيعات: 38000,
      المستهدف: 45000,
    },
    {
      name: "سارة",
      المبيعات: 52000,
      المستهدف: 50000,
    },
    {
      name: "محمود",
      المبيعات: 28000,
      المستهدف: 35000,
    },
  ];

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-awfar-primary/5 to-white pb-2 border-b border-gray-100">
        <CardTitle className="text-lg font-medium text-awfar-primary">أداء الفريق</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
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
              <Bar 
                dataKey="المبيعات" 
                fill="#4361EE" 
                radius={[6, 6, 0, 0]} 
                barSize={30}
              />
              <Bar 
                dataKey="المستهدف" 
                fill="#2B0A3D" 
                radius={[6, 6, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;
