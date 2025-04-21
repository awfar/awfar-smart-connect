
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
      color: "bg-gradient-to-br from-blue-100 via-blue-50 to-white",
      iconColor: "bg-blue-600 text-white",
      borderColor: "border-blue-200"
    },
    {
      title: "العملاء المحتملين الجدد",
      icon: Users,
      value: stats?.newLeads || "0",
      description: "في هذا الشهر",
      change: stats?.leadsChange || "+0%",
      trend: "up",
      color: "bg-gradient-to-br from-green-100 via-green-50 to-white",
      iconColor: "bg-green-600 text-white",
      borderColor: "border-green-200"
    },
    {
      title: "معدل التحويل",
      icon: BarChart,
      value: stats?.conversionRate || "0%",
      description: "العملاء المحولين من العملاء المحتملين",
      change: stats?.conversionChange || "+0%",
      trend: "up",
      color: "bg-gradient-to-br from-purple-100 via-purple-50 to-white",
      iconColor: "bg-purple-600 text-white",
      borderColor: "border-purple-200"
    },
    {
      title: "التذاكر النشطة",
      icon: Contact,
      value: stats?.activeTickets || "0",
      description: "تذاكر تحتاج إلى معالجة",
      change: stats?.ticketsChange || "+0%",
      trend: "down",
      color: "bg-gradient-to-br from-amber-100 via-amber-50 to-white",
      iconColor: "bg-amber-600 text-white",
      borderColor: "border-amber-200"
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden shadow-md border-0">
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card 
          key={index} 
          className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${item.color} border ${item.borderColor}`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">{item.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
                <div className="flex items-center text-xs">
                  <span className="opacity-70">{item.description}</span>
                  <span className={`mr-2 font-medium ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {item.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${item.iconColor} shadow-md`}>
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
