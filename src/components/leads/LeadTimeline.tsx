
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Calendar, ClipboardList, Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface LeadTimelineProps {
  activities: any[];
  tasks: any[];
  appointments: any[];
  isLoading: boolean;
  onEdit: (type: string, item: any) => void;
  onDelete: (type: string, itemId: string) => void;
  onComplete: (type: string, itemId: string) => void;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({
  activities,
  tasks,
  appointments,
  isLoading,
  onEdit,
  onDelete,
  onComplete
}) => {
  // Function to format date with Arabic locale
  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP', { locale: ar });
  };

  const formatTime = (date: string) => {
    return format(new Date(date), 'p', { locale: ar });
  };

  // Combine all items and sort by date
  const allItems = [
    ...activities.map(activity => ({ ...activity, itemType: 'activity' })),
    ...tasks.map(task => ({ ...task, itemType: 'task' })),
    ...appointments.map(appointment => ({ ...appointment, itemType: 'appointment' }))
  ].sort((a, b) => {
    const dateA = a.itemType === 'task' ? a.due_date || a.created_at : 
                 a.itemType === 'appointment' ? a.start_time : a.created_at;
    const dateB = b.itemType === 'task' ? b.due_date || b.created_at : 
                 b.itemType === 'appointment' ? b.start_time : b.created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Render different item types
  const renderTimelineItem = (item: any) => {
    switch (item.itemType) {
      case 'activity':
        return renderActivityItem(item);
      case 'task':
        return renderTaskItem(item);
      case 'appointment':
        return renderAppointmentItem(item);
      default:
        return null;
    }
  };

  const renderActivityItem = (activity: any) => {
    return (
      <Card key={`activity-${activity.id}`} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{getActivityTypeLabel(activity.type)}</span>
                  <Badge variant="outline">{formatTimestamp(activity.created_at)}</Badge>
                </div>
                <p className="mt-1">{activity.description}</p>
                {activity.scheduled_at && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(activity.scheduled_at)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {!activity.completed_at && activity.type !== 'note' && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onComplete('activity', activity.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onDelete('activity', activity.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {activity.completed_at && (
            <Badge variant="outline" className="mt-2">مكتمل</Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTaskItem = (task: any) => {
    return (
      <Card key={`task-${task.id}`} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <ClipboardList className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{task.title}</span>
                  <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                </div>
                <p className="mt-1">{task.description || "لا يوجد وصف"}</p>
                {task.due_date && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(task.due_date)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {task.status !== 'completed' && (
                <>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onComplete('task', task.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onEdit('task', task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onDelete('task', task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Badge 
            variant={getStatusVariant(task.status)} 
            className="mt-2"
          >
            {getStatusLabel(task.status)}
          </Badge>
        </CardContent>
      </Card>
    );
  };

  const renderAppointmentItem = (appointment: any) => {
    return (
      <Card key={`appointment-${appointment.id}`} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Calendar className="h-4 w-4 text-purple-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{appointment.title}</span>
                  <Badge>{appointment.status || "مجدول"}</Badge>
                </div>
                <p className="mt-1">{appointment.description || "لا يوجد وصف"}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {formatDate(appointment.start_time)} {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                  </span>
                </div>
                {appointment.location && (
                  <p className="mt-1 text-sm text-gray-500">{appointment.location}</p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onEdit('appointment', appointment)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onDelete('appointment', appointment.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Helper functions
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Check className="h-4 w-4 text-blue-700" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-blue-700" />;
      case 'email':
        return <Check className="h-4 w-4 text-blue-700" />;
      case 'task':
        return <ClipboardList className="h-4 w-4 text-blue-700" />;
      default:
        return <Check className="h-4 w-4 text-blue-700" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'call':
        return 'مكالمة';
      case 'meeting':
        return 'اجتماع';
      case 'email':
        return 'بريد إلكتروني';
      case 'task':
        return 'مهمة';
      case 'note':
        return 'ملاحظة';
      case 'whatsapp':
        return 'واتساب';
      case 'update':
        return 'تحديث';
      case 'create':
        return 'إنشاء';
      case 'delete':
        return 'حذف';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    return formatDate(timestamp);
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالية';
      case 'medium':
        return 'متوسطة';
      case 'low':
        return 'منخفضة';
      default:
        return priority;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      case 'pending':
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'in_progress':
        return 'قيد التنفيذ';
      case 'cancelled':
        return 'ملغاة';
      case 'pending':
      default:
        return 'قيد الانتظار';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد أنشطة أو مهام أو مواعيد مسجلة
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {allItems.map(renderTimelineItem)}
    </div>
  );
};

export default LeadTimeline;
