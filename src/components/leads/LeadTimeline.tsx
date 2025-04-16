
import React from 'react';
import { LeadActivity } from '@/types/leads';
import { Task } from '@/services/tasks/types';
import { Appointment } from '@/services/appointments/types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  Calendar, Clock, Edit, Trash, Check, MoreVertical,
  MessageSquare, Phone, Mail, FileText, User, RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Create type definitions for each item type to handle discriminated unions properly
type ActivityItem = {
  id: string;
  type: 'activity';
  activityType: "note" | "call" | "meeting" | "email" | "task" | "whatsapp" | "update" | "create" | "delete";
  title: string;
  description: string;
  timestamp: string;
  createdBy: string;
  scheduled: string | null | undefined;
  completed: string | null | undefined;
  item: LeadActivity;
};

type TaskItem = {
  id: string;
  type: 'task';
  activityType: "task";
  title: string;
  description: string | undefined;
  timestamp: string;
  scheduled: string | null | undefined;
  createdBy: string;
  priority: "low" | "medium" | "high";
  status: string;
  item: Task;
};

type AppointmentItem = {
  id: string;
  type: 'appointment';
  activityType: "meeting";
  title: string;
  description: string | undefined;
  timestamp: string;
  scheduled: string;
  createdBy: string;
  status: string;
  location: string | undefined;
  item: Appointment;
};

// Combined timeline item type
type TimelineItem = ActivityItem | TaskItem | AppointmentItem;

interface LeadTimelineProps {
  activities: LeadActivity[];
  tasks: Task[];
  appointments: Appointment[];
  isLoading: boolean;
  onEdit?: (type: string, item: any) => void;
  onDelete?: (type: string, id: string) => void;
  onComplete?: (type: string, id: string) => void;
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
  // Helper function to get creator name
  const getCreatorName = (activity: LeadActivity) => {
    if (typeof activity.created_by === 'string') {
      return activity.profiles?.first_name 
        ? `${activity.profiles.first_name} ${activity.profiles.last_name || ''}`
        : 'مستخدم';
    }
    return activity.created_by 
      ? `${activity.created_by.first_name || ''} ${activity.created_by.last_name || ''}`
      : 'مستخدم';
  };
  
  // Helper function for formatting dates
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm', { locale: ar });
    } catch (e) {
      return 'تاريخ غير صالح';
    }
  };
  
  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'call':
        return <Phone className="h-5 w-5 text-green-500" />;
      case 'email':
        return <Mail className="h-5 w-5 text-purple-500" />;
      case 'meeting':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'task':
        return <Check className="h-5 w-5 text-red-500" />;
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'update':
        return <RefreshCcw className="h-5 w-5 text-yellow-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Combine all items into a single timeline
  const timelineItems: TimelineItem[] = [
    ...activities.map(activity => ({
      id: activity.id,
      type: 'activity' as const,
      activityType: activity.type,
      title: `${activity.type === 'note' ? 'ملاحظة جديدة' : activity.type === 'call' ? 'مكالمة' : 
              activity.type === 'email' ? 'بريد إلكتروني' : activity.type === 'meeting' ? 'اجتماع' :
              activity.type === 'task' ? 'مهمة' : activity.type === 'whatsapp' ? 'واتساب' : 'نشاط'}`,
      description: activity.description,
      timestamp: activity.created_at,
      createdBy: getCreatorName(activity),
      scheduled: activity.scheduled_at,
      completed: activity.completed_at,
      item: activity,
    })),
    ...tasks.map(task => ({
      id: task.id as string,
      type: 'task' as const,
      activityType: 'task' as const,
      title: `مهمة: ${task.title}`,
      description: task.description,
      timestamp: task.created_at || '',
      scheduled: task.due_date,
      createdBy: task.assigned_to_name || 'مستخدم',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      item: task,
    })),
    ...appointments.map(appointment => ({
      id: appointment.id,
      type: 'appointment' as const,
      activityType: 'meeting' as const,
      title: `موعد: ${appointment.title}`,
      description: appointment.description,
      timestamp: appointment.created_at || '',
      scheduled: appointment.start_time,
      createdBy: '',
      status: appointment.status || 'scheduled',
      location: appointment.location,
      item: appointment,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="mr-2">جاري تحميل الخط الزمني...</span>
      </div>
    );
  }
  
  if (timelineItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">لا توجد أنشطة بعد</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {timelineItems.map((item) => (
        <div 
          key={`${item.type}-${item.id}`}
          className="bg-muted/50 p-4 rounded-md relative"
        >
          <div className="flex gap-3">
            {/* Activity Icon */}
            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
              {getActivityIcon(item.activityType)}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-medium">{item.title}</h4>
                  {/* Status badges */}
                  {item.type !== 'activity' && item.status === 'completed' && <Badge variant="outline">مكتمل</Badge>}
                  {/* Priority badges - only for tasks */}
                  {item.type === 'task' && item.priority === 'high' && <Badge variant="destructive">عالية</Badge>}
                  {item.type === 'task' && item.priority === 'medium' && <Badge variant="secondary">متوسطة</Badge>}
                  {item.type === 'task' && item.priority === 'low' && <Badge variant="outline">منخفضة</Badge>}
                </div>
                
                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && item.type !== 'activity' && (
                      <DropdownMenuItem onClick={() => onEdit(item.type, item.item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        تعديل
                      </DropdownMenuItem>
                    )}
                    {onComplete && item.type !== 'activity' && item.status !== 'completed' && (
                      <DropdownMenuItem onClick={() => onComplete(item.type, item.id)}>
                        <Check className="h-4 w-4 mr-2" />
                        إكمال
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => onDelete(item.type, item.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        حذف
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Description */}
              {item.description && (
                <p className="text-sm mt-2 whitespace-pre-wrap">{item.description}</p>
              )}
              
              {/* Footer */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
                {/* Creator */}
                {item.createdBy && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{item.createdBy}</span>
                  </div>
                )}
                
                {/* Created Time */}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(item.timestamp)}</span>
                </div>
                
                {/* Scheduled Time */}
                {item.scheduled && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(item.scheduled)}</span>
                  </div>
                )}
                
                {/* Location - only for appointments */}
                {item.type === 'appointment' && item.location && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadTimeline;
