
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getLeadActivities, 
  completeLeadActivity, 
  deleteLeadActivity,
  addLeadActivity,
  LeadActivity,
  LeadActivityInput
} from '@/services/leads';
import { 
  getTasks, 
  completeTask, 
  Task 
} from '@/services/tasks/api';
import { 
  getAppointmentsByLeadId, 
  Appointment 
} from '@/services/appointments';
import { toast } from 'sonner';
import { RelatedEntity } from '@/components/leads/RelatedEntityCard';

export const useLeadTimeline = (leadId: string) => {
  const [processing, setProcessing] = useState<string | null>(null);
  
  // Fetch lead activities
  const { 
    data: activities = [], 
    isLoading: activitiesLoading,
    refetch: refetchActivities 
  } = useQuery({
    queryKey: ['leadActivities', leadId],
    queryFn: () => getLeadActivities(leadId),
    enabled: !!leadId
  });
  
  // Fetch lead tasks
  const { 
    data: tasks = [], 
    isLoading: tasksLoading,
    refetch: refetchTasks 
  } = useQuery({
    queryKey: ['leadTasks', leadId],
    queryFn: () => getTasks({ lead_id: leadId }),
    enabled: !!leadId
  });
  
  // Fetch lead appointments
  const { 
    data: appointments = [], 
    isLoading: appointmentsLoading,
    refetch: refetchAppointments 
  } = useQuery({
    queryKey: ['leadAppointments', leadId],
    queryFn: () => getAppointmentsByLeadId(leadId),
    enabled: !!leadId
  });
  
  // Handle adding a new activity
  const handleAddActivity = async (activity: LeadActivityInput): Promise<LeadActivity | null> => {
    try {
      const result = await addLeadActivity(activity);
      if (result) {
        refetchActivities();
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('حدث خطأ أثناء إضافة النشاط');
      return null;
    }
  };
  
  // Handle completing an activity
  const handleCompleteActivity = async (activityId: string): Promise<void> => {
    try {
      setProcessing(activityId);
      await completeLeadActivity(activityId);
      refetchActivities();
    } catch (error) {
      console.error('Error completing activity:', error);
      toast.error('حدث خطأ أثناء إكمال النشاط');
    } finally {
      setProcessing(null);
    }
  };
  
  // Handle completing a task
  const handleCompleteTask = async (taskId: string): Promise<void> => {
    try {
      setProcessing(taskId);
      await completeTask(taskId);
      refetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('حدث خطأ أثناء إكمال المهمة');
    } finally {
      setProcessing(null);
    }
  };
  
  // Handle deleting an activity
  const handleDeleteActivity = async (activityId: string): Promise<void> => {
    try {
      setProcessing(activityId);
      await deleteLeadActivity(activityId);
      refetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('حدث خطأ أثناء حذف النشاط');
    } finally {
      setProcessing(null);
    }
  };
  
  const isLoading = activitiesLoading || tasksLoading || appointmentsLoading;
  
  // Refresh all data
  const refreshData = () => {
    refetchActivities();
    refetchTasks();
    refetchAppointments();
  };
  
  return {
    activities,
    tasks,
    appointments,
    isLoading,
    processing,
    handleAddActivity,
    handleCompleteActivity,
    handleCompleteTask,
    handleDeleteActivity,
    refreshData
  };
};

// Hook to fetch related entities for a lead
export const useLeadRelatedEntities = (leadId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<RelatedEntity[]>([]);
  const [deals, setDeals] = useState<RelatedEntity[]>([]);
  const [invoices, setInvoices] = useState<RelatedEntity[]>([]);
  const [tickets, setTickets] = useState<RelatedEntity[]>([]);
  const [subscriptions, setSubscriptions] = useState<RelatedEntity[]>([]);
  
  // This would normally fetch from APIs but for now we'll simulate this
  useEffect(() => {
    if (leadId) {
      setIsLoading(true);
      
      // In a real implementation, you would call your APIs here
      // For now, just setting after a delay to simulate loading
      const timer = setTimeout(() => {
        // These would be API calls in a real implementation
        // fetchCompanyByLead(leadId).then(setCompanies);
        // fetchDealsByLead(leadId).then(setDeals);
        // etc...
        
        // Simulated data for now
        if (leadId) {
          setCompanies([
            {
              id: "company-1",
              name: "شركة أوفر للحلول التقنية",
              type: "company",
              status: "نشط",
            }
          ]);
        } else {
          setCompanies([]);
        }
        
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [leadId]);
  
  return {
    isLoading,
    companies,
    deals,
    invoices,
    tickets,
    subscriptions
  };
};
