import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from '@/services/dashboardService';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users, Target, CreditCard, CheckCircle, Clock, Calendar, MessageSquare, TrendingUp
} from 'lucide-react';

interface StatsCardsProps {
  data: DashboardStats | null;
  isLoading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ data, isLoading }) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ar-SA');
  };

  const formatCurrency = (num: number): string => {
    return `${formatNumber(num)} ريال`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // If loading, show skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // If data is null, show empty state
  if (!data) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">فشل في تحميل بيانات الإحصائيات</p>
      </Card>
    );
  }

  // Calculate derived stats
  const leadConversionRate = data.totalLeads > 0 ? (data.qualifiedLeads / data.totalLeads) * 100 : 0;
  const taskCompletionRate = data.totalTasks > 0 ? (data.completedTasks / data.totalTasks) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Lead Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            العملاء المحتملين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatNumber(data.totalLeads)}</p>
          <p className="text-sm text-muted-foreground">
            {data.newLeadsThisMonth} جديد هذا الشهر
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            نسبة التحويل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatPercentage(leadConversionRate)}</p>
          <p className="text-sm text-muted-foreground">
            {formatNumber(data.qualifiedLeads)} عميل مؤهل
          </p>
        </CardContent>
      </Card>
      
      {/* Deal Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            الصفقات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatNumber(data.totalDeals)}</p>
          <p className="text-sm text-muted-foreground">
            متوسط القيمة: {formatCurrency(data.avgDealValue)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            معدل الإغلاق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">27%</p>
          <p className="text-sm text-muted-foreground">
            ارتفاع 5% عن الشهر السابق
          </p>
        </CardContent>
      </Card>
      
      {/* Task Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            المهام المكتملة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatNumber(data.completedTasks)}</p>
          <p className="text-sm text-muted-foreground">
            من أصل {formatNumber(data.totalTasks)} مهمة
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            معدل إنجاز المهام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatPercentage(taskCompletionRate)}</p>
          <p className="text-sm text-muted-foreground">
            {formatNumber(data.pendingTasks)} مهمة قيد التنفيذ
          </p>
        </CardContent>
      </Card>
      
      {/* Other Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            المواعيد القادمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatNumber(data.upcomingAppointments)}</p>
          <p className="text-sm text-muted-foreground">
            في الأسبوع القادم
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            التذاكر المفتوحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatNumber(data.openTickets)}</p>
          <p className="text-sm text-muted-foreground">
            تحتاج إلى معالجة
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
