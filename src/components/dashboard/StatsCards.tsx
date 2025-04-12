
import { ArrowDown, ArrowUp, Users, Building, TicketCheck, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatsCards = () => {
  const stats = [
    {
      title: "إجمالي العملاء المحتملين",
      value: "324",
      change: "+12.4%",
      isIncrease: true,
      icon: Users,
    },
    {
      title: "العملاء النشطين",
      value: "45",
      change: "+5.2%",
      isIncrease: true,
      icon: Building,
    },
    {
      title: "التذاكر المفتوحة",
      value: "18",
      change: "-3.1%",
      isIncrease: false,
      icon: TicketCheck,
    },
    {
      title: "المبيعات (هذا الشهر)",
      value: "٢٤٥,٠٠٠ ر.س",
      change: "+18.7%",
      isIncrease: true,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {stat.isIncrease ? (
                <ArrowUp className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span className={stat.isIncrease ? "text-green-500" : "text-red-500"}>
                {stat.change}
              </span>{" "}
              منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
