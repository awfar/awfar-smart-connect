
import { useState, useCallback } from 'react';
import { Lead, LeadActivity } from '@/types/leads';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useLeadProfile(leadId?: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lead data
  const fetchLead = useCallback(async () => {
    if (!leadId) return;
    
    setIsLoading(true);
    try {
      // For this prototype, we're simulating API calls with mock data
      // In production, this would fetch from Supabase
      const mockLeads = (await import('@/services/leads/mockData')).mockLeads;
      const foundLead = mockLeads.find(l => l.id === leadId) || null;
      
      if (!foundLead) {
        setError('العميل المحتمل غير موجود');
        setLead(null);
      } else {
        setLead(foundLead as Lead);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching lead:', err);
      setError('حدث خطأ أثناء تحميل بيانات العميل المحتمل');
      setLead(null);
    } finally {
      setIsLoading(false);
    }
  }, [leadId]);

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    if (!leadId) return;
    
    setIsActivitiesLoading(true);
    try {
      // Mock activities data - in production this would be from Supabase
      const mockActivities: LeadActivity[] = [
        {
          id: '1',
          lead_id: leadId,
          type: 'note',
          description: 'تم الاتصال بالعميل وإبداء اهتمام بالخدمات',
          created_at: new Date().toISOString(),
          created_by: {
            first_name: 'محمد',
            last_name: 'أحمد'
          },
        },
        {
          id: '2',
          lead_id: leadId,
          type: 'call',
          description: 'مكالمة متابعة بخصوص العرض المقدم',
          created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          created_by: {
            first_name: 'سارة',
            last_name: 'خالد'
          },
        }
      ];
      
      setActivities(mockActivities);
    } catch (err) {
      console.error('Error fetching activities:', err);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الأنشطة",
        variant: "destructive",
      });
      setActivities([]);
    } finally {
      setIsActivitiesLoading(false);
    }
  }, [leadId]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!leadId) return;
    
    try {
      // Mock tasks data
      const mockTasks = [
        {
          id: '1',
          lead_id: leadId,
          title: 'متابعة العرض المقدم',
          description: 'التواصل مع العميل لمتابعة العرض المقدم',
          status: 'pending',
          due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        },
        {
          id: '2',
          lead_id: leadId,
          title: 'إرسال كتالوج المنتجات',
          description: 'إرسال كتالوج المنتجات الكامل بالبريد الإلكتروني',
          status: 'completed',
          due_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        }
      ];
      
      setTasks(mockTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks([]);
    }
  }, [leadId]);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!leadId) return;
    
    try {
      // Mock appointments data
      const mockAppointments = [
        {
          id: '1',
          lead_id: leadId,
          title: 'اجتماع تقديمي',
          description: 'عرض تقديمي للخدمات والمنتجات',
          start_time: new Date(Date.now() + 259200000).toISOString(), // 3 days later
          end_time: new Date(Date.now() + 262800000).toISOString(), // 3 days + 1 hour
          location: 'مكتب الشركة - الرياض',
        }
      ];
      
      setAppointments(mockAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
    }
  }, [leadId]);

  // Delete lead
  const deleteLead = useCallback(async (id: string) => {
    try {
      // In production, this would delete from Supabase
      // await supabase.from('leads').delete().eq('id', id);
      console.log('Deleting lead:', id);
      return true;
    } catch (err) {
      console.error('Error deleting lead:', err);
      throw err;
    }
  }, []);

  // Update lead
  const updateLead = useCallback((updatedLead: Lead) => {
    try {
      // In production, this would update in Supabase
      // await supabase.from('leads').update(updatedLead).eq('id', updatedLead.id);
      console.log('Updating lead:', updatedLead);
      setLead(updatedLead);
    } catch (err) {
      console.error('Error updating lead:', err);
      throw err;
    }
  }, []);

  return {
    lead,
    isLoading,
    error,
    activities,
    tasks,
    appointments,
    deals,
    isActivitiesLoading,
    fetchLead,
    fetchActivities,
    fetchTasks,
    fetchAppointments,
    deleteLead,
    updateLead,
  };
}
