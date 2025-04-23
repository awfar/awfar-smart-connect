
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, MessageSquare, Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface LeadTimelineProps {
  activities: any[];
  tasks: any[];
  appointments: any[];
  isLoading: boolean;
  onEdit?: (type: string, item: any) => void;
  onDelete?: (type: string, itemId: string) => void;
  onComplete?: (type: string, itemId: string) => void;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({
  activities = [],
  tasks = [],
  appointments = [],
  isLoading,
  onEdit,
  onDelete,
  onComplete
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), 'PPpp', { locale: ar });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString;
    }
  };

  const renderActivities = () => {
    const safeActivities = Array.isArray(activities) ? activities : [];
    
    if (safeActivities.length === 0) {
      return <p className="text-center text-muted-foreground py-4">لا توجد أنشطة بعد</p>;
    }

    return safeActivities.map((activity, index) => (
      <div key={activity?.id || `activity-${index}`} className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <p className="font-medium">{activity?.type === 'note' ? 'ملاحظة' : activity?.type || 'نشاط'}</p>
              <p className="text-sm text-muted-foreground">{activity?.description || ''}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity?.created_at ? formatDate(activity.created_at) : ''}</p>
            </div>
          </div>
          {onDelete && activity?.id && (
            <Button variant="ghost" size="sm" onClick={() => onDelete('activity', activity.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    ));
  };

  const renderTasks = () => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    
    if (safeTasks.length === 0) {
      return <p className="text-center text-muted-foreground py-4">لا توجد مهام بعد</p>;
    }

    return safeTasks.map((task, index) => (
      <div key={task?.id || `task-${index}`} className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <Clock className={`h-5 w-5 ${task?.status === 'completed' ? 'text-green-500' : 'text-amber-500'} mt-1`} />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{task?.title || 'مهمة'}</p>
                <Badge variant={task?.status === 'completed' ? 'outline' : 'default'} className="ml-2">
                  {task?.status === 'pending' ? 'قيد الانتظار' : 
                   task?.status === 'in_progress' ? 'قيد التنفيذ' : 
                   task?.status === 'completed' ? 'مكتمل' : 'ملغي'}
                </Badge>
              </div>
              {task?.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                تاريخ الاستحقاق: {task?.due_date ? formatDate(task.due_date) : 'غير محدد'}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {task?.status !== 'completed' && onComplete && task?.id && (
              <Button variant="ghost" size="sm" onClick={() => onComplete('task', task.id)}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            )}
            {onEdit && task?.id && (
              <Button variant="ghost" size="sm" onClick={() => onEdit('task', task)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && task?.id && (
              <Button variant="ghost" size="sm" onClick={() => onDelete('task', task.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  const renderAppointments = () => {
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    
    if (safeAppointments.length === 0) {
      return <p className="text-center text-muted-foreground py-4">لا توجد مواعيد بعد</p>;
    }

    return safeAppointments.map((appointment, index) => (
      <div key={appointment?.id || `appointment-${index}`} className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-indigo-500 mt-1" />
            <div>
              <p className="font-medium">{appointment?.title || 'موعد'}</p>
              {appointment?.description && <p className="text-sm text-muted-foreground">{appointment.description}</p>}
              <div className="text-xs text-muted-foreground mt-1">
                {appointment?.start_time && <p>من: {formatDate(appointment.start_time)}</p>}
                {appointment?.end_time && <p>إلى: {formatDate(appointment.end_time)}</p>}
                {appointment?.location && <p>المكان: {appointment.location}</p>}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {onEdit && appointment?.id && (
              <Button variant="ghost" size="sm" onClick={() => onEdit('appointment', appointment)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && appointment?.id && (
              <Button variant="ghost" size="sm" onClick={() => onDelete('appointment', appointment.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  const renderLoadingState = () => (
    <div className="py-8 text-center">
      <div className="flex justify-center mb-2">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      </div>
      <p>جاري التحميل...</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>الأنشطة والمهام</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderLoadingState()
        ) : (
          <Tabs defaultValue="activities">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="activities">الأنشطة</TabsTrigger>
              <TabsTrigger value="tasks">المهام</TabsTrigger>
              <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            </TabsList>
            <TabsContent value="activities">{renderActivities()}</TabsContent>
            <TabsContent value="tasks">{renderTasks()}</TabsContent>
            <TabsContent value="appointments">{renderAppointments()}</TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadTimeline;
