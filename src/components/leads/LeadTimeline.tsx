
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { LeadActivity } from '@/types/leads';
import { Task } from '@/services/tasks/types';
import { Appointment } from '@/services/appointments/types';
import {
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  MoreHorizontal,
  Edit,
  Trash,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Define a unified timeline item type that can represent any activity
interface TimelineItem {
  id: string;
  type: 'activity' | 'task' | 'appointment' | 'note';
  subtype?: string;
  title?: string;
  description?: string;
  date: string;
  dueDate?: string;
  status?: string;
  priority?: string;
  completed?: boolean;
  createdBy?: {
    id?: string;
    name?: string;
    avatar?: string;
    initials?: string;
  };
  location?: string;
  originalData: any; // Reference to the original data item
}

interface LeadTimelineProps {
  activities: LeadActivity[];
  tasks: Task[];
  appointments: Appointment[];
  isLoading: boolean;
  onEdit?: (type: string, item: any) => void;
  onDelete?: (type: string, itemId: string) => void;
  onComplete?: (type: string, itemId: string) => void;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({
  activities,
  tasks,
  appointments,
  isLoading,
  onEdit,
  onDelete,
  onComplete,
}) => {
  // Convert all different items into a unified timeline format
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // Process activities
    activities.forEach(activity => {
      let createdBy;
      if (activity.created_by) {
        if (typeof activity.created_by === 'string') {
          createdBy = {
            id: activity.created_by,
            initials: '??',
          };
        } else if (activity.profiles) {
          // Fix for the type conversion error - converting profiles object to user name
          const profiles = activity.profiles as { first_name?: string; last_name?: string };
          createdBy = {
            id: typeof activity.created_by === 'string' ? activity.created_by : 'unknown',
            name: `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim(),
            initials: profiles.first_name?.[0] || '?',
          };
        } else if (typeof activity.created_by === 'object') {
          const createdByObj = activity.created_by as any;
          createdBy = {
            id: 'unknown',
            name: `${createdByObj.first_name || ''} ${createdByObj.last_name || ''}`.trim(),
            initials: createdByObj.first_name?.[0] || '?',
          };
        }
      }

      const isNote = activity.type === 'note';
      
      items.push({
        id: activity.id,
        type: isNote ? 'note' : 'activity',
        subtype: activity.type,
        description: activity.description,
        date: activity.created_at,
        dueDate: activity.scheduled_at,
        completed: !!activity.completed_at,
        createdBy,
        originalData: activity,
      });
    });

    // Process tasks
    tasks.forEach(task => {
      items.push({
        id: task.id || '',
        type: 'task',
        title: task.title,
        description: task.description,
        date: task.created_at || '',
        dueDate: task.due_date,
        status: task.status,
        priority: task.priority,
        completed: task.status === 'completed',
        createdBy: task.assigned_to_name ? {
          id: task.assigned_to,
          name: task.assigned_to_name,
          initials: task.assigned_to_name[0] || '?',
        } : undefined,
        originalData: task,
      });
    });

    // Process appointments
    appointments.forEach(appointment => {
      items.push({
        id: appointment.id,
        type: 'appointment',
        title: appointment.title,
        description: appointment.description,
        date: appointment.created_at || '',
        dueDate: appointment.start_time,
        status: appointment.status,
        completed: appointment.status === 'completed',
        location: appointment.location,
        originalData: appointment,
      });
    });

    // Sort all items by date, newest first
    return items.sort((a, b) => {
      // Sort by scheduled/due date if available, otherwise by created date
      const dateA = a.dueDate || a.date;
      const dateB = b.dueDate || b.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [activities, tasks, appointments]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-16 w-full mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (timelineItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <h3 className="text-lg font-medium">لا توجد أنشطة</h3>
        <p>لم يتم تسجيل أي أنشطة أو مهام لهذا العميل بعد</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm', { locale: ar });
    } catch (e) {
      return 'تاريخ غير صالح';
    }
  };

  const getTypeIcon = (item: TimelineItem) => {
    if (item.type === 'task') return <CheckCircle className="h-5 w-5 text-blue-500" />;
    if (item.type === 'appointment') return <Calendar className="h-5 w-5 text-green-500" />;
    if (item.type === 'note') return <MessageSquare className="h-5 w-5 text-amber-500" />;
    
    // Activity subtypes
    switch (item.subtype) {
      case 'call': return <Phone className="h-5 w-5 text-indigo-500" />;
      case 'email': return <Mail className="h-5 w-5 text-purple-500" />;
      case 'meeting': return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'whatsapp': return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'note': return <MessageSquare className="h-5 w-5 text-amber-500" />;
      case 'update': return <Edit className="h-5 w-5 text-blue-500" />;
      case 'create': return <FileText className="h-5 w-5 text-green-500" />;
      case 'delete': return <Trash className="h-5 w-5 text-red-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (item: TimelineItem) => {
    if (item.type === 'task') {
      return (
        <Badge variant={item.completed ? 'outline' : 'secondary'} className={item.completed ? 'bg-green-50 text-green-700' : ''}>
          {item.completed ? 'مكتملة' : 'مهمة'}
        </Badge>
      );
    }

    if (item.type === 'appointment') {
      let badgeClass = '';
      let text = 'موعد';
      
      if (item.status === 'completed') {
        badgeClass = 'bg-green-50 text-green-700';
        text = 'تم الموعد';
      } else if (item.status === 'cancelled') {
        badgeClass = 'bg-red-50 text-red-700';
        text = 'ملغي';
      } else if (new Date(item.dueDate || '') < new Date()) {
        badgeClass = 'bg-amber-50 text-amber-700';
        text = 'فات الموعد';
      }
      
      return <Badge variant="outline" className={badgeClass}>{text}</Badge>;
    }

    if (item.type === 'note') {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700">ملاحظة</Badge>;
    }

    // Regular activities
    switch (item.subtype) {
      case 'call': return <Badge variant="outline" className="bg-indigo-50 text-indigo-700">مكالمة</Badge>;
      case 'email': return <Badge variant="outline" className="bg-purple-50 text-purple-700">بريد</Badge>;
      case 'meeting': return <Badge variant="outline" className="bg-orange-50 text-orange-700">اجتماع</Badge>;
      case 'whatsapp': return <Badge variant="outline" className="bg-green-50 text-green-700">واتساب</Badge>;
      case 'update': return <Badge variant="outline" className="bg-blue-50 text-blue-700">تحديث</Badge>;
      case 'create': return <Badge variant="outline" className="bg-green-50 text-green-700">إنشاء</Badge>;
      case 'delete': return <Badge variant="outline" className="bg-red-50 text-red-700">حذف</Badge>;
      default: return <Badge variant="outline">نشاط</Badge>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    let badgeClass = '';
    let text = '';
    
    switch (priority) {
      case 'high':
        badgeClass = 'bg-red-50 text-red-700';
        text = 'عالية';
        break;
      case 'medium':
        badgeClass = 'bg-amber-50 text-amber-700';
        text = 'متوسطة';
        break;
      case 'low':
        badgeClass = 'bg-green-50 text-green-700';
        text = 'منخفضة';
        break;
      default:
        return null;
    }
    
    return <Badge variant="outline" className={badgeClass}>{text}</Badge>;
  };

  const handleEdit = (item: TimelineItem) => {
    if (onEdit) onEdit(item.type, item.originalData);
  };

  const handleDelete = (item: TimelineItem) => {
    if (onDelete) onDelete(item.type, item.id);
  };

  const handleComplete = (item: TimelineItem) => {
    if (onComplete) onComplete(item.type, item.id);
  };

  return (
    <div className="space-y-6">
      {timelineItems.map((item) => (
        <div 
          key={`${item.type}-${item.id}`} 
          className={`bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm ${
            item.completed ? 'bg-gray-50 dark:bg-gray-900/70 border-gray-200' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-primary-50 dark:bg-primary-900/20 p-2 rounded-full">
                {getTypeIcon(item)}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {getTypeBadge(item)}
                  {item.priority && getPriorityBadge(item.priority)}
                  
                  {/* Show createdBy info if available */}
                  {item.createdBy && (
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={item.createdBy.avatar} />
                        <AvatarFallback className="text-xs">{item.createdBy.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {item.createdBy.name || 'مستخدم'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Title and description */}
                {item.title && <h4 className="font-medium mb-1">{item.title}</h4>}
                <p className={`${item.completed ? 'text-muted-foreground' : ''} whitespace-pre-wrap`}>
                  {item.description}
                </p>
                
                {/* Date and location info */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  
                  {item.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className={item.completed ? 'line-through' : ''}>
                        {formatDate(item.dueDate)}
                      </span>
                    </div>
                  )}
                  
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions menu */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!item.completed && item.type !== 'note' && (
                    <DropdownMenuItem onClick={() => handleComplete(item)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      إكمال
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                    <Edit className="mr-2 h-4 w-4" />
                    تعديل
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDelete(item)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadTimeline;

