
import React, { useState } from 'react';
import { 
  Calendar, Clock, MessageSquare, Phone, Mail, Plus, 
  ArrowDownUp, CheckCircle, Trash2, Loader2, Filter 
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LeadActivity, LeadActivityInput } from '@/services/leads';
import { Task } from '@/services/tasks/api';
import { Appointment } from '@/services/appointments';
import ActivityForm from './ActivityForm';

interface TimelineItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  status?: string;
  canComplete?: boolean;
  canDelete?: boolean;
  isCompleted?: boolean;
  sourceModule: 'activity' | 'task' | 'appointment';
  raw: any; // The raw data object
}

interface LeadComprehensiveTimelineProps {
  leadId: string;
  activities: LeadActivity[];
  tasks: Task[];
  appointments: Appointment[];
  isLoading: boolean;
  onAddActivity: (activity: LeadActivityInput) => Promise<void>;
  onCompleteActivity: (activityId: string) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<void>;
  onDeleteActivity: (activityId: string) => Promise<void>;
  onRefresh: () => void;
}

const LeadComprehensiveTimeline: React.FC<LeadComprehensiveTimelineProps> = ({
  leadId,
  activities,
  tasks,
  appointments,
  isLoading,
  onAddActivity,
  onCompleteActivity,
  onCompleteTask,
  onDeleteActivity,
  onRefresh
}) => {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [processing, setProcessing] = useState<string | null>(null);

  // Transform all items into a single timeline format
  const transformToTimelineItems = (): TimelineItem[] => {
    const activityItems: TimelineItem[] = activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      title: getActivityTypeTitle(activity.type),
      description: activity.description,
      timestamp: activity.created_at,
      status: activity.completed_at ? 'completed' : 'pending',
      canComplete: !activity.completed_at,
      canDelete: true,
      isCompleted: !!activity.completed_at,
      sourceModule: 'activity',
      raw: activity
    }));

    const taskItems: TimelineItem[] = tasks.map(task => ({
      id: task.id,
      type: 'task',
      title: 'مهمة',
      description: task.title,
      timestamp: task.created_at,
      status: task.status,
      canComplete: task.status !== 'completed',
      canDelete: false,
      isCompleted: task.status === 'completed',
      sourceModule: 'task',
      raw: task
    }));

    const appointmentItems: TimelineItem[] = appointments.map(appointment => ({
      id: appointment.id,
      type: 'appointment',
      title: 'موعد',
      description: appointment.title,
      timestamp: appointment.start_time,
      status: appointment.status,
      canComplete: false,
      canDelete: false,
      isCompleted: appointment.status === 'completed',
      sourceModule: 'appointment',
      raw: appointment
    }));

    return [...activityItems, ...taskItems, ...appointmentItems];
  };

  const getActivityTypeTitle = (type: string): string => {
    switch(type) {
      case 'call': return 'مكالمة';
      case 'email': return 'بريد إلكتروني';
      case 'meeting': return 'اجتماع';
      case 'note': return 'ملاحظة';
      case 'task': return 'مهمة';
      case 'whatsapp': return 'واتساب';
      default: return type;
    }
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      case 'task': return <Clock className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  };

  const handleAddActivityComplete = () => {
    setIsAddingActivity(false);
    onRefresh();
  };

  const handleCompleteItem = async (item: TimelineItem) => {
    setProcessing(item.id);
    try {
      if (item.sourceModule === 'activity') {
        await onCompleteActivity(item.id);
      } else if (item.sourceModule === 'task') {
        await onCompleteTask(item.id);
      }
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteItem = async (item: TimelineItem) => {
    setProcessing(item.id);
    try {
      if (item.sourceModule === 'activity') {
        await onDeleteActivity(item.id);
      }
    } finally {
      setProcessing(null);
    }
  };

  // Filter and sort timeline items
  const filteredAndSortedItems = () => {
    let items = transformToTimelineItems();
    
    // Apply filtering
    if (filter !== 'all') {
      items = items.filter(item => item.type === filter);
    }
    
    // Apply sorting
    items.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    return items;
  };

  const timelineItems = filteredAndSortedItems();

  // Get unique activity types for filter
  const getActivityTypes = () => {
    const types = new Set<string>();
    
    activities.forEach(activity => types.add(activity.type));
    types.add('task');
    types.add('appointment');
    
    return Array.from(types);
  };

  const activityTypes = getActivityTypes();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>جاري تحميل البيانات...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>الأنشطة والمتابعات</CardTitle>
            <CardDescription>سجل التفاعلات مع العميل المحتمل</CardDescription>
          </div>
          <Button onClick={() => setIsAddingActivity(true)}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة نشاط
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="تصنيف حسب النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنشطة</SelectItem>
                {activityTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {getActivityTypeTitle(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            <ArrowDownUp className="h-4 w-4 mr-2" />
            {sortDirection === 'asc' ? 'الأقدم أولاً' : 'الأحدث أولاً'}
          </Button>
        </div>
        
        {timelineItems.length > 0 ? (
          <div className="space-y-6 mt-6">
            {timelineItems.map(item => (
              <div key={`${item.sourceModule}-${item.id}`} className="relative pb-6 border-b last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getActivityIcon(item.type)}
                      {item.title}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.canComplete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleCompleteItem(item)}
                        disabled={processing === item.id}
                      >
                        {processing === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    
                    {item.canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteItem(item)}
                        disabled={processing === item.id}
                      >
                        {processing === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 pr-1">
                  <p className={`text-sm ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {item.sourceModule === 'task' && (
                      <Badge variant={item.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                        {item.status === 'completed' ? 'مكتملة' : 'قيد التنفيذ'}
                      </Badge>
                    )}
                    
                    {item.sourceModule === 'appointment' && (
                      <Badge variant="outline" className="text-xs">
                        {item.raw.start_time && new Date(item.raw.start_time).toLocaleDateString()} - 
                        {item.raw.end_time && new Date(item.raw.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-1 ml-auto">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">م.ن</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">مسؤول النظام</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center border rounded-lg">
            <p className="text-muted-foreground">لا توجد أنشطة مسجلة حتى الآن</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddingActivity(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة أول نشاط
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">
          إجمالي الأنشطة: {timelineItems.length}
        </span>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          تحديث
        </Button>
      </CardFooter>
      
      {isAddingActivity && (
        <ActivityForm 
          leadId={leadId}
          onSuccess={handleAddActivityComplete}
          onClose={() => setIsAddingActivity(false)}
        />
      )}
    </Card>
  );
};

export default LeadComprehensiveTimeline;
