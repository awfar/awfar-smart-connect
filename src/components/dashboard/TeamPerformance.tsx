
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
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-2">
        <CardTitle className="text-lg font-medium">أداء الفريق</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 5,
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
              <Bar dataKey="المبيعات" fill="#4361EE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="المستهدف" fill="#2B0A3D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;
