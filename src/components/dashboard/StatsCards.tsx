
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Contact, DollarSign, Users } from "lucide-react";
import { DashboardStats } from "@/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  isLoading: boolean;
  stats?: DashboardStats;
}

const StatsCards = ({ isLoading, stats }: StatsCardsProps) => {
  const items = [
    {
      title: "إجمالي المبيعات",
      icon: DollarSign,
      value: stats?.totalSales || "0",
      description: "مقارنة بالشهر السابق",
      change: stats?.salesChange || "+0%",
      trend: "up",
      color: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-900",
      iconColor: "text-blue-700 bg-blue-100"
    },
    {
      title: "العملاء المحتملين الجدد",
      icon: Users,
      value: stats?.newLeads || "0",
      description: "في هذا الشهر",
      change: stats?.leadsChange || "+0%",
      trend: "up",
      color: "bg-gradient-to-br from-green-100 to-green-50 text-green-900",
      iconColor: "text-green-700 bg-green-100"
    },
    {
      title: "معدل التحويل",
      icon: BarChart,
      value: stats?.conversionRate || "0%",
      description: "العملاء المحولين من العملاء المحتملين",
      change: stats?.conversionChange || "+0%",
      trend: "up",
      color: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-900",
      iconColor: "text-purple-700 bg-purple-100"
    },
    {
      title: "التذاكر النشطة",
      icon: Contact,
      value: stats?.activeTickets || "0",
      description: "تذاكر تحتاج إلى معالجة",
      change: stats?.ticketsChange || "+0%",
      trend: "down",
      color: "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-900",
      iconColor: "text-amber-700 bg-amber-100"
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden shadow-md">
            <CardContent className="p-0">
              <div className="p-6 flex flex-col gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card 
          key={index} 
          className={`overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ${item.color} border-0`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium opacity-80">{item.title}</p>
                <h3 className="text-2xl font-bold">{item.value}</h3>
                <div className="flex items-center text-xs">
                  <span className="opacity-70">{item.description}</span>
                  <span className={`mr-2 font-medium ${item.trend === "up" ? "text-green-700" : "text-red-700"}`}>
                    {item.change}
                  </span>
                </div>
              </div>
              <div className={`p-2 rounded-full ${item.iconColor}`}>
                <item.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
