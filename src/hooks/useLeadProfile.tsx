
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getLead, updateLead, deleteLeadActivity } from '@/services/leads';
import { 
  getLeadActivities, 
  addLeadActivity, 
  completeLeadActivity 
} from '@/services/leads/leadActivities';
import { getAppointmentsByLeadId } from '@/services/appointments';
import { getTasks } from '@/services/tasks';
import { Lead, LeadActivity } from '@/types/leads';

export const useLeadProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [activityType, setActivityType] = useState<'note' | 'call' | 'meeting' | 'email' | 'task' | 'whatsapp'>('note');
  
  // Fetch lead details
  const { 
    data: lead, 
    isLoading: isLoadingLead, 
    error: leadError,
    refetch: refetchLead
  } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch lead activities
  const {
    data: activities = [],
    isLoading: isLoadingActivities,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['leadActivities', id],
    queryFn: () => getLeadActivities(id!),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute - we want this to update more frequently
  });

  // Fetch appointments related to this lead
  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ['leadAppointments', id],
    queryFn: () => getAppointmentsByLeadId(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch tasks related to this lead
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['leadTasks', id],
    queryFn: () => getTasks({ lead_id: id }),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Refetch all data
  const refetchAllData = async () => {
    await Promise.all([
      refetchLead(),
      refetchActivities(),
      refetchAppointments(),
      refetchTasks()
    ]);
  };

  // Handle edit lead
  const handleEditLead = async (updatedLead: Lead) => {
    try {
      await updateLead(updatedLead);
      await refetchLead();
      setIsEditDialogOpen(false);
      toast.success('تم تحديث بيانات العميل بنجاح');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('فشل في تحديث بيانات العميل');
    }
  };

  // Handle add activity
  const handleAddActivity = async (activity: Partial<LeadActivity>) => {
    try {
      if (!id) return;
      
      const newActivity = {
        ...activity,
        lead_id: id,
        type: activityType
      };
      
      await addLeadActivity(newActivity);
      await refetchActivities();
      setIsActivityDialogOpen(false);
      toast.success('تم إضافة النشاط بنجاح');
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('فشل في إضافة النشاط');
    }
  };

  // Handle complete activity
  const handleCompleteActivity = async (activityId: string) => {
    try {
      await completeLeadActivity(activityId);
      await refetchActivities();
      toast.success('تم إكمال النشاط بنجاح');
    } catch (error) {
      console.error('Error completing activity:', error);
      toast.error('فشل في إكمال النشاط');
    }
  };

  // Handle delete activity
  const handleDeleteActivity = async (activityId: string) => {
    try {
      const confirmed = window.confirm('هل أنت متأكد من حذف هذا النشاط؟');
      if (!confirmed) return;
      
      await deleteLeadActivity(activityId);
      await refetchActivities();
      toast.success('تم حذف النشاط بنجاح');
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('فشل في حذف النشاط');
    }
  };

  // Navigate back to leads list
  const handleBackToLeads = () => {
    navigate('/dashboard/leads');
  };

  return {
    id,
    lead,
    activities,
    appointments,
    tasks,
    isLoadingLead,
    isLoadingActivities,
    isLoadingAppointments,
    isLoadingTasks,
    leadError,
    isEditDialogOpen,
    isActivityDialogOpen,
    isTaskDialogOpen,
    isAppointmentDialogOpen,
    activityType,
    setIsEditDialogOpen,
    setIsActivityDialogOpen,
    setIsTaskDialogOpen,
    setIsAppointmentDialogOpen,
    setActivityType,
    handleEditLead,
    handleAddActivity,
    handleCompleteActivity,
    handleDeleteActivity,
    handleBackToLeads,
    refetchAllData
  };
};

export default useLeadProfile;
