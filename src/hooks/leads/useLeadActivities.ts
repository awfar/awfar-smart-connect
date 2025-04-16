
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeadActivities, addLeadActivity, completeLeadActivity } from '@/services/leads/leadActivities';
import { LeadActivity } from '@/types/leads';
import { toast } from 'sonner';

export const useLeadActivities = (leadId?: string) => {
  const queryClient = useQueryClient();
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  // Query for fetching lead activities
  const { 
    data: activities = [], 
    isLoading,
    isError,
    refetch 
  } = useQuery({
    queryKey: ['leadActivities', leadId],
    queryFn: () => leadId ? getLeadActivities(leadId) : Promise.resolve([]),
    enabled: !!leadId,
  });

  // Mutation for adding a new activity
  const { mutate: addActivity, isPending: isAddingActivity } = useMutation({
    mutationFn: addLeadActivity,
    onSuccess: (newActivity) => {
      if (newActivity) {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['leadActivities', leadId] });
        toast.success('تم إضافة النشاط بنجاح');
        setIsAddActivityOpen(false);
      }
    },
    onError: (error) => {
      console.error('Error adding activity:', error);
      toast.error('فشل في إضافة النشاط');
    }
  });

  // Mutation for completing an activity
  const { mutate: completeActivity, isPending: isCompletingActivity } = useMutation({
    mutationFn: completeLeadActivity,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['leadActivities', leadId] });
      toast.success('تم إكمال النشاط بنجاح');
    },
    onError: (error) => {
      console.error('Error completing activity:', error);
      toast.error('فشل في إكمال النشاط');
    }
  });

  // Function to handle adding a new activity
  const handleAddActivity = (activityData: Partial<LeadActivity>) => {
    if (!leadId) {
      toast.error('معرف العميل المحتمل غير موجود');
      return;
    }
    
    addActivity({
      ...activityData,
      lead_id: leadId
    });
  };

  // Function to handle completing an activity
  const handleCompleteActivity = (activityId: string) => {
    completeActivity(activityId);
  };

  return {
    activities,
    isLoading,
    isError,
    isAddActivityOpen,
    setIsAddActivityOpen,
    addActivity: handleAddActivity,
    completeActivity: handleCompleteActivity,
    isAddingActivity,
    isCompletingActivity,
    refetch
  };
};
