
import React from 'react';
import { LeadActivity } from '@/services/leads/types';
import { Task } from '@/services/tasks/types';
import { Appointment } from '@/services/appointments/types';
import { format } from '@/utils/date';
import { Calendar, MessageSquare, FileText, Users } from '@/components/ui/icons';

type TimelineItem = {
  id: string;
  type: 'activity' | 'task' | 'appointment';
  data: LeadActivity | Task | Appointment;
  createdAt: string;
};

interface LeadTimelineProps {
  activities: LeadActivity[];
  tasks: Task[];
  appointments: Appointment[];
  isLoading?: boolean;
  onCompleteActivity?: (id: string) => void;
  onDeleteActivity?: (id: string) => void;
  onCompleteTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onDeleteAppointment?: (id: string) => void;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({
  activities,
  tasks,
  appointments,
  isLoading,
  onCompleteActivity,
  onDeleteActivity,
  onCompleteTask,
  onDeleteTask,
  onDeleteAppointment
}) => {
  // Combine and sort all timeline items
  const timelineItems: TimelineItem[] = [
    ...activities.map(activity => ({
      id: activity.id,
      type: 'activity' as const,
      data: activity,
      createdAt: activity.created_at || ''
    })),
    ...tasks.map(task => ({
      id: task.id,
      type: 'task' as const,
      data: task,
      createdAt: task.created_at
    })),
    ...appointments.map(appointment => ({
      id: appointment.id,
      type: 'appointment' as const,
      data: appointment,
      createdAt: appointment.created_at || ''
    }))
  ].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  if (timelineItems.length === 0) {
    return <div className="text-center py-8 text-gray-500">لا توجد عناصر في الجدول الزمني</div>;
  }

  return (
    <div className="space-y-4">
      {timelineItems.map(item => {
        if (item.type === 'activity') {
          const activity = item.data as LeadActivity;
          return (
            <div key={item.id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-start gap-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="h-4 w-4 text-blue-700" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">
                        {activity.type === 'note' ? 'ملاحظة' : 
                         activity.type === 'call' ? 'مكالمة' : 
                         activity.type === 'meeting' ? 'اجتماع' : 
                         activity.type === 'email' ? 'بريد إلكتروني' : 
                         activity.type === 'task' ? 'مهمة' : 'نشاط'}
                      </span>
                      <span className="text-xs text-gray-500 mr-2">
                        {activity.created_at ? format(new Date(activity.created_at), 'PPpp') : ''}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {!activity.completed_at && activity.type !== 'note' && (
                        <button 
                          className="text-sm text-blue-600"
                          onClick={() => onCompleteActivity?.(activity.id)}
                        >
                          إكمال
                        </button>
                      )}
                      <button 
                        className="text-sm text-red-600"
                        onClick={() => onDeleteActivity?.(activity.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <p className="mt-1">{activity.description}</p>
                </div>
              </div>
            </div>
          );
        }
        
        if (item.type === 'task') {
          const task = item.data as Task;
          return (
            <div key={item.id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-start gap-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <FileText className="h-4 w-4 text-green-700" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">
                        مهمة: {task.title}
                      </span>
                      <span className="text-xs text-gray-500 mr-2">
                        {task.created_at ? format(new Date(task.created_at), 'PPpp') : ''}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {task.status !== 'completed' && (
                        <button 
                          className="text-sm text-blue-600"
                          onClick={() => onCompleteTask?.(task.id)}
                        >
                          إكمال
                        </button>
                      )}
                      <button 
                        className="text-sm text-red-600"
                        onClick={() => onDeleteTask?.(task.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <p className="mt-1">{task.description || 'لا يوجد وصف'}</p>
                  {task.due_date && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">تاريخ الاستحقاق:</span> {format(new Date(task.due_date), 'PPpp')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        
        if (item.type === 'appointment') {
          const appointment = item.data as Appointment;
          return (
            <div key={item.id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-start gap-2">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-700" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">
                        موعد: {appointment.title}
                      </span>
                      <span className="text-xs text-gray-500 mr-2">
                        {appointment.created_at ? format(new Date(appointment.created_at), 'PPpp') : ''}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="text-sm text-red-600"
                        onClick={() => onDeleteAppointment?.(appointment.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <p className="mt-1">{appointment.description || 'لا يوجد وصف'}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">وقت الموعد:</span> {format(new Date(appointment.start_time), 'PPpp')}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default LeadTimeline;
