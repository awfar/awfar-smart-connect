
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadActivity, LeadActivityInput } from './types';
import { toast } from 'sonner';

export const getLead = async (id: string): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      owner: {
        name: 'مسؤول النظام',
        initials: 'م.ن'
      }
    } as Lead;
  } catch (error) {
    console.error('Error fetching lead:', error);
    toast.error('حدث خطأ أثناء تحميل بيانات العميل المحتمل');
    return null;
  }
};

export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as LeadActivity[];
  } catch (error) {
    console.error('Error fetching lead activities:', error);
    toast.error('حدث خطأ أثناء تحميل أنشطة العميل المحتمل');
    return [];
  }
};

export const addLeadActivity = async (activity: LeadActivityInput): Promise<LeadActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .insert({
        lead_id: activity.lead_id,
        type: activity.type,
        description: activity.description,
        scheduled_at: activity.scheduled_at,
        created_by: activity.created_by
      })
      .select()
      .single();

    if (error) throw error;

    toast.success('تمت إضافة النشاط بنجاح');
    return data as LeadActivity;
  } catch (error) {
    console.error('Error adding lead activity:', error);
    toast.error('حدث خطأ أثناء إضافة النشاط');
    return null;
  }
};

export const completeLeadActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lead_activities')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', activityId);

    if (error) throw error;

    toast.success('تم إكمال النشاط بنجاح');
    return true;
  } catch (error) {
    console.error('Error completing lead activity:', error);
    toast.error('حدث خطأ أثناء إكمال النشاط');
    return false;
  }
};

export const deleteLeadActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lead_activities')
      .delete()
      .eq('id', activityId);

    if (error) throw error;

    toast.success('تم حذف النشاط بنجاح');
    return true;
  } catch (error) {
    console.error('Error deleting lead activity:', error);
    toast.error('حدث خطأ أثناء حذف النشاط');
    return false;
  }
};

export const deleteLead = async (leadId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) throw error;

    toast.success('تم حذف العميل المحتمل بنجاح');
    return true;
  } catch (error) {
    console.error('Error deleting lead:', error);
    toast.error('حدث خطأ أثناء حذف العميل المحتمل');
    return false;
  }
};
