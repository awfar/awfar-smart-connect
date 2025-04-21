
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Plus, Loader2, Check } from 'lucide-react';
import LeadTimelineItem, { TimelineItemType } from './LeadTimelineItem';
import { LeadActivity } from '@/services/leads/types';
import { Task } from '@/services/tasks/types';
import { Appointment } from '@/services/appointments/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import ActivityForm from './ActivityForm';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  description: string;
  created_at: string;
  created_by?: any;
  scheduled_at?: string;
  completed_at?: string;
  related_entity?: {
    type: string;
    id: string;
    name: string;
    status?: string;
  };
  module?: string;  // Helps identify the source module
  original?: any;   // The original object for reference
}

interface LeadComprehensiveTimelineProps {
  leadId: string;
  activities: LeadActivity[];
  tasks: Task[];
  appointments: Appointment[];
  isLoading: boolean;
  onAddActivity: (activity: LeadActivity) => Promise<void>;
  onCompleteActivity?: (id: string) => Promise<void>;
  onCompleteTask?: (id: string) => Promise<void>;
  onDeleteActivity?: (id: string) => Promise<void>;
  onEditTask?: (task: Task) => void;
  onEditAppointment?: (appointment: Appointment) => void;
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
  onEditTask,
  onEditAppointment,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showActivityDialog, setShowActivityDialog] = useState<boolean>(false);
  const [processingItem, setProcessingItem] = useState<string | null>(null);
  
  // Convert all items to a common format for the timeline
  const mapActivitiesToTimelineItems = (): TimelineItem[] => {
    return activities.map(activity => ({
      id: activity.id,
      type: activity.type as TimelineItemType,
      description: activity.description,
      created_at: activity.created_at,
      created_by: activity.created_by,
      scheduled_at: activity.scheduled_at || undefined,
      completed_at: activity.completed_at || undefined,
      module: 'activity',
      original: activity
    }));
  };
  
  const mapTasksToTimelineItems = (): TimelineItem[] => {
    return tasks.map(task => ({
      id: task.id,
      type: 'task',
      description: task.title + (task.description ? `: ${task.description}` : ''),
      created_at: task.created_at,
      created_by: {
        name: task.assigned_to_name || 'غير معين',
        id: task.assigned_to
      },
      scheduled_at: task.due_date || undefined,
      completed_at: task.status === 'completed' ? task.updated_at : undefined,
      related_entity: task.related_to,
      module: 'task',
      original: task
    }));
  };
  
  const mapAppointmentsToTimelineItems = (): TimelineItem[] => {
    return appointments.map(appointment => ({
      id: appointment.id,
      type: 'appointment',
      description: appointment.title + (appointment.description ? `: ${appointment.description}` : ''),
      created_at: appointment.created_at,
      created_by: {
        id: appointment.created_by
      },
      scheduled_at: appointment.start_time,
      completed_at: appointment.status === 'completed' ? appointment.updated_at : undefined,
      related_entity: {
        type: 'appointment',
        id: appointment.id,
        name: appointment.title,
        status: appointment.status
      },
      module: 'appointment',
      original: appointment
    }));
  };
  
  // Combine and sort all timeline items
  const getAllTimelineItems = (): TimelineItem[] => {
    const allItems = [
      ...mapActivitiesToTimelineItems(),
      ...mapTasksToTimelineItems(),
      ...mapAppointmentsToTimelineItems()
    ];
    
    return allItems.sort((a, b) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return bDate - aDate; // Sort descending (newest first)
    });
  };
  
  const getFilteredTimelineItems = (): TimelineItem[] => {
    const allItems = getAllTimelineItems();
    
    // Filter by tab
    let filteredItems = allItems;
    if (activeTab === "activities") {
      filteredItems = allItems.filter(item => 
        item.module === 'activity' && item.type !== 'task' && item.type !== 'note'
      );
    } else if (activeTab === "tasks") {
      filteredItems = allItems.filter(item => 
        item.module === 'task' || (item.module === 'activity' && item.type === 'task')
      );
    } else if (activeTab === "appointments") {
      filteredItems = allItems.filter(item => 
        item.module === 'appointment' || (item.module === 'activity' && item.type === 'meeting')
      );
    } else if (activeTab === "notes") {
      filteredItems = allItems.filter(item => 
        (item.module === 'activity' && item.type === 'note')
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.description.toLowerCase().includes(term) || 
        (item.created_by?.name && item.created_by.name.toLowerCase().includes(term))
      );
    }
    
    return filteredItems;
  };
  
  const handleItemComplete = async (id: string, itemType: string) => {
    setProcessingItem(id);
    try {
      if (itemType === 'activity' && onCompleteActivity) {
        await onCompleteActivity(id);
      } else if (itemType === 'task' && onCompleteTask) {
        await onCompleteTask(id);
      }
    } finally {
      setProcessingItem(null);
    }
  };
  
  const handleItemDelete = async (id: string, itemType: string) => {
    setProcessingItem(id);
    try {
      if (itemType === 'activity' && onDeleteActivity) {
        await onDeleteActivity(id);
      }
      // Implement delete for other item types
    } finally {
      setProcessingItem(null);
    }
  };
  
  const handleItemEdit = (id: string, itemType: string) => {
    if (itemType === 'task' && onEditTask) {
      const task = tasks.find(t => t.id === id);
      if (task) onEditTask(task);
    } else if (itemType === 'appointment' && onEditAppointment) {
      const appointment = appointments.find(a => a.id === id);
      if (appointment) onEditAppointment(appointment);
    }
  };
  
  const handleAddActivity = async (activity?: LeadActivity) => {
    setShowActivityDialog(false);
    if (activity && onAddActivity) {
      await onAddActivity(activity);
      onRefresh();
    }
  };
  
  const timelineItems = getFilteredTimelineItems();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="activities">الأنشطة</TabsTrigger>
            <TabsTrigger value="tasks">المهام</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="notes">الملاحظات</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <Input
            placeholder="بحث في الأنشطة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowActivityDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة نشاط
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>جاري تحميل البيانات...</span>
          </div>
        ) : timelineItems.length > 0 ? (
          timelineItems.map((item) => (
            <LeadTimelineItem
              key={`${item.module}-${item.id}`}
              id={item.id}
              type={item.type}
              description={item.description}
              created_at={item.created_at}
              created_by={item.created_by}
              scheduled_at={item.scheduled_at}
              completed_at={item.completed_at}
              related_entity={item.related_entity}
              onComplete={
                ((item.type === 'task' && !item.completed_at) || 
                (item.module === 'activity' && item.scheduled_at && !item.completed_at)) ?
                (id) => handleItemComplete(id, item.module || '') : 
                undefined
              }
              onDelete={
                item.module === 'activity' ? 
                (id) => handleItemDelete(id, item.module || '') : 
                undefined
              }
              onEdit={
                (item.module === 'task' || item.module === 'appointment') ?
                (id) => handleItemEdit(id, item.module || '') :
                undefined
              }
              isProcessing={processingItem === item.id}
            />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            لا توجد أنشطة لعرضها
          </div>
        )}
      </div>
      
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة نشاط جديد</DialogTitle>
          </DialogHeader>
          <ActivityForm 
            leadId={leadId}
            onSuccess={handleAddActivity}
            onClose={() => setShowActivityDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadComprehensiveTimeline;
