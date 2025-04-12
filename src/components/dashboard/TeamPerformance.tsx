
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="المبيعات" fill="#4361EE" />
          <Bar dataKey="المستهدف" fill="#2B0A3D" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamPerformance;
