
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  due_date: string;
}

interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
}

interface Deal {
  id: string;
  title: string;
  amount: number;
  stage: string;
  close_date: string;
}

interface LeadRelatedRecordsProps {
  leadId: string;
  tasks: Task[];
  appointments: Appointment[];
  deals: Deal[];
}

const LeadRelatedRecords: React.FC<LeadRelatedRecordsProps> = ({
  leadId,
  tasks,
  appointments,
  deals,
}) => {
  // Format date with Arabic locale
  const formatDate = (dateString?: string) => {
    if (!dateString) return "غير محدد";
    try {
      return format(new Date(dateString), 'PPP', { locale: ar });
    } catch (e) {
      return dateString;
    }
  };

  // Format time with Arabic locale
  const formatTime = (dateString?: string) => {
    if (!dateString) return "غير محدد";
    try {
      return format(new Date(dateString), 'hh:mm a', { locale: ar });
    } catch (e) {
      return dateString;
    }
  };

  // Get task status badge
  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">قيد الانتظار</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">قيد التنفيذ</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500">مكتمل</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-500 border-gray-500">ملغي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get deal stage badge
  const getDealStageBadge = (stage: string) => {
    switch (stage) {
      case 'discovery':
        return <Badge className="bg-blue-500">استكشاف</Badge>;
      case 'offer':
        return <Badge className="bg-indigo-500">عرض</Badge>;
      case 'negotiation':
        return <Badge className="bg-amber-500">تفاوض</Badge>;
      case 'won':
        return <Badge className="bg-green-500">مربوح</Badge>;
      case 'lost':
        return <Badge className="bg-red-500">خاسر</Badge>;
      default:
        return <Badge>{stage}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">السجلات المرتبطة</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tasks">المهام</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="deals">الفرص</TabsTrigger>
          </TabsList>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium">لا توجد مهام مرتبطة</p>
                <p className="text-sm text-muted-foreground mt-1">
                  لم يتم إنشاء مهام لهذا العميل المحتمل بعد
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                        <p className="text-sm mt-2">
                          <span className="text-muted-foreground">تاريخ الاستحقاق:</span>{' '}
                          <span className="font-medium">{formatDate(task.due_date)}</span>
                        </p>
                      </div>
                      <div>
                        {getTaskStatusBadge(task.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Appointments Tab */}
          <TabsContent value="appointments">
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium">لا توجد مواعيد مرتبطة</p>
                <p className="text-sm text-muted-foreground mt-1">
                  لم يتم جدولة مواعيد لهذا العميل المحتمل بعد
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-md p-4">
                    <h4 className="font-medium">{appointment.title}</h4>
                    {appointment.description && (
                      <p className="text-sm text-muted-foreground mt-1">{appointment.description}</p>
                    )}
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">التاريخ:</span>{' '}
                        <span className="font-medium">{formatDate(appointment.start_time)}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">الوقت:</span>{' '}
                        <span className="font-medium">
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </span>
                      </p>
                      {appointment.location && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">المكان:</span>{' '}
                          <span className="font-medium">{appointment.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Deals Tab */}
          <TabsContent value="deals">
            {deals && deals.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium">لا توجد فرص مرتبطة</p>
                <p className="text-sm text-muted-foreground mt-1">
                  لم يتم إنشاء فرص لهذا العميل المحتمل بعد
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {deals && deals.map((deal) => (
                  <div key={deal.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{deal.title}</h4>
                        <p className="text-sm mt-2">
                          <span className="text-muted-foreground">القيمة:</span>{' '}
                          <span className="font-medium">{deal.amount.toLocaleString('ar-SA')} ريال</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">تاريخ الإغلاق المتوقع:</span>{' '}
                          <span className="font-medium">{formatDate(deal.close_date)}</span>
                        </p>
                      </div>
                      <div>
                        {getDealStageBadge(deal.stage)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeadRelatedRecords;
