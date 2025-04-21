
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadActivity, LeadActivityInput } from './types';
import { transformLeadFromSupabase } from './utils';

// Get all leads
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, profiles:assigned_to(first_name, last_name, avatar_url)');
    
    if (error) throw error;
    
    return data.map(transformLeadFromSupabase) || [];
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

// Get a single lead by ID
export const getLead = async (id: string): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, profiles:assigned_to(first_name, last_name, avatar_url)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return transformLeadFromSupabase(data);
  } catch (error) {
    console.error(`Error fetching lead ${id}:`, error);
    return null;
  }
};

// Create a new lead
export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();
    
    if (error) throw error;
    
    return transformLeadFromSupabase(data);
  } catch (error) {
    console.error('Error creating lead:', error);
    return null;
  }
};

// Update an existing lead
export const updateLead = async (lead: Partial<Lead> & { id: string }): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', lead.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return transformLeadFromSupabase(data);
  } catch (error) {
    console.error(`Error updating lead ${lead.id}:`, error);
    return null;
  }
};

// Delete a lead
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting lead ${id}:`, error);
    return false;
  }
};

// Get lead activities
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*, profiles:created_by(first_name, last_name)')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching activities for lead ${leadId}:`, error);
    return [];
  }
};

// Add a new activity to a lead
export const addLeadActivity = async (activity: LeadActivityInput): Promise<LeadActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .insert([activity])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error adding lead activity:', error);
    return null;
  }
};

// Mark an activity as completed
export const completeLeadActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lead_activities')
      .update({ 
        completed_at: new Date().toISOString() 
      })
      .eq('id', activityId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error completing activity ${activityId}:`, error);
    return false;
  }
};

// Delete an activity
export const deleteLeadActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lead_activities')
      .delete()
      .eq('id', activityId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting activity ${activityId}:`, error);
    return false;
  }
};
