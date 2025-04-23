
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Edit, Trash2, CheckCircle, Info } from 'lucide-react';
import { Task } from '@/services/tasks/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from "@/integrations/supabase/client";
import { getTasks, completeTask } from '@/services/tasks/api';
import { toast } from "sonner";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface TasksListProps {
  view?: 'myTasks' | 'all' | 'team';
  filterStatus?: string;
  filterPriority?: string;
  filterType?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onShowDetails?: (task: Task) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  view = 'all',
  filterStatus = 'all',
  filterPriority = 'all',
  onEdit,
  onDelete,
  onShowDetails,
  leadId,
  limit,
}) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasksData = async () => {
      setIsLoading(true);
      try {
        const filters: Record<string, any> = {};
        
        if (filterStatus !== 'all') {
          filters.status = filterStatus;
        }
        
        if (filterPriority !== 'all') {
          filters.priority = filterPriority;
        }
        
        if (leadId) {
          filters.lead_id = leadId;
        }
        
        if (view === 'myTasks') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            filters.assigned_to = user.id;
          }
        }
        
        const fetchedTasks = await getTasks(filters);
        
        const limitedTasks = limit ? fetchedTasks.slice(0, limit) : fetchedTasks;
        setTasks(limitedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('فشل في تحميل المهام');
        toast.error('فشل في تحميل المهام');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasksData();
  }, [view, filterStatus, filterPriority, leadId, limit]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: 'completed' } : task
        )
      );
      
      toast.success('تم إكمال المهمة بنجاح');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('فشل في إكمال المهمة');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير محدد';
    try {
      return format(new Date(dateString), 'PPp', { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">عالية</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">متوسطة</Badge>;
      case 'low':
        return <Badge className="bg-green-500">منخفضة</Badge>;
      default:
        return <Badge>غير محدد</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
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
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">لا توجد مهام</p>
        <p className="text-muted-foreground">لم يتم العثور على أي مهام تطابق المعايير المحددة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <h3 
                  className="font-medium text-lg cursor-pointer hover:text-primary"
                  onClick={() => onShowDetails && onShowDetails(task)}
                >
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                </div>
              </div>
              
              {task.description && (
                <p className="text-muted-foreground">{task.description}</p>
              )}
              
              <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 ml-1" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
                
                {task.leads && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 ml-1" />
                    <span>
                      {`${task.leads.first_name || ''} ${task.leads.last_name || ''}`.trim() || 'لا يوجد عميل'}
                    </span>
                  </div>
                )}
                
                {task.profiles && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 ml-1" />
                    <span>
                      {`${task.profiles.first_name || ''} ${task.profiles.last_name || ''}`.trim() || 'غير مع��ن'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2 space-x-reverse">
              {task.status !== 'completed' && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-green-600"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              
              {onEdit && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TasksList;
