
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const TeamPerformance = () => {
  const isMobile = useIsMobile();

  const salesData = [
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

  const supportData = [
    {
      name: "محمد",
      التذاكر: 120,
      المستهدف: 100,
    },
    {
      name: "فاطمة",
      التذاكر: 85,
      المستهدف: 90,
    },
    {
      name: "خالد",
      التذاكر: 65,
      المستهدف: 70,
    },
    {
      name: "نورا",
      التذاكر: 110,
      المستهدف: 100,
    },
  ];

  const renderSalesChart = () => (
    <div className={`${isMobile ? 'h-[250px]' : 'h-[320px]'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={salesData}
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
          <Legend />
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
  );

  const renderSupportChart = () => (
    <div className={`${isMobile ? 'h-[250px]' : 'h-[320px]'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={supportData}
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
          <Legend />
          <Bar 
            dataKey="التذاكر" 
            fill="#8aff00" 
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
  );

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-awfar-primary/5 to-white pb-2 border-b border-gray-100">
        <CardTitle className="text-lg font-medium text-awfar-primary">أداء الفريق</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Tabs defaultValue="sales">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="sales">فريق المبيعات</TabsTrigger>
            <TabsTrigger value="support">فريق الدعم</TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            {renderSalesChart()}
          </TabsContent>
          <TabsContent value="support">
            {renderSupportChart()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;
