
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "../types/leadTypes";
import { mockLeads } from "./mockData";
import { toast } from "sonner";
import { addLeadActivity } from "./leadActivities";
import { transformLeadFromSupabase } from "./utils";
import { v4 as uuidv4 } from 'uuid';

// Update lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  try {
    console.log("Updating lead:", lead);
    
    // IMPORTANT: Always update in Supabase first, not just mock data
    // Try updating the lead in Supabase regardless of lead ID format
    const { owner, ...leadToUpdate } = lead;
    
    // Remove any null or empty string values for UUID fields to prevent errors
    if (!leadToUpdate.assigned_to || leadToUpdate.assigned_to === '' || leadToUpdate.assigned_to === 'unassigned') {
      leadToUpdate.assigned_to = null;
    }
    
    console.log("Sending update to Supabase with data:", leadToUpdate);
    
    // Try updating the lead in Supabase
    const { data, error } = await supabase
      .from('leads')
      .update({
        ...leadToUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('id', lead.id)
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .single();
    
    if (error) {
      console.error("Error updating lead in Supabase:", error);
      toast.error(`خطأ في تحديث البيانات: ${error.message}`);
      throw error;
    }
    
    // If operation was successful, return the updated lead
    if (data) {
      // Log the activity
      try {
        const { data: userData } = await supabase.auth.getUser();
        await addLeadActivity({
          lead_id: lead.id,
          type: "update",
          description: "تم تحديث بيانات العميل المحتمل",
          created_by: userData.user?.id
        });
      } catch (activityError) {
        console.error("Error logging lead update activity:", activityError);
      }
      
      console.log("Lead successfully updated in Supabase:", data);
      toast.success("تم تحديث العميل المحتمل بنجاح");
      return transformLeadFromSupabase(data);
    }
    
    throw new Error("Failed to update lead");
  } catch (error) {
    console.error("Error updating lead:", error);
    toast.error("فشل في تحديث العميل المحتمل");
    throw error;
  }
};

// Create new lead - improved to ensure database persistence
export const createLead = async (lead: Omit<Lead, "id">): Promise<Lead> => {
  try {
    console.log("Creating new lead:", lead);
    
    // Remove owner property as it's not part of the DB schema
    const { owner, ...leadToCreate } = lead as any;
    
    // Ensure assigned_to is properly handled as UUID or null
    if (!leadToCreate.assigned_to || 
        leadToCreate.assigned_to === '' || 
        leadToCreate.assigned_to === 'unassigned' ||
        leadToCreate.assigned_to === 'not-assigned') {
      leadToCreate.assigned_to = null;
    }
    
    // Ensure dates are set
    if (!leadToCreate.created_at) {
      leadToCreate.created_at = new Date().toISOString();
    }
    
    if (!leadToCreate.updated_at) {
      leadToCreate.updated_at = new Date().toISOString();
    }
    
    // Set default status if not provided
    if (!leadToCreate.status) {
      leadToCreate.status = 'جديد';
    }
    
    console.log("Prepared lead data for creation:", leadToCreate);

    // Create in Supabase with better error details
    const { data, error } = await supabase
      .from('leads')
      .insert(leadToCreate)
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .single();
    
    // Handle Supabase errors
    if (error) {
      console.error("Error creating lead in Supabase:", error);
      toast.error(`فشل في حفظ البيانات: ${error.message}`);
      throw error;
    }
    
    // If operation was successful, return the new lead
    if (data) {
      const transformedLead = transformLeadFromSupabase(data);
      console.log("Lead successfully created in Supabase:", transformedLead);
      toast.success("تم إنشاء العميل المحتمل بنجاح");
      
      // Create automatic follow-up activity
      try {
        const followupDate = new Date();
        followupDate.setDate(followupDate.getDate() + 3);
        
        // Log the creation activity
        const { data: userData } = await supabase.auth.getUser();
        
        await addLeadActivity({
          lead_id: transformedLead.id,
          type: "create",
          description: "تم إنشاء العميل المحتمل",
          created_by: userData.user?.id
        });
        
        await addLeadActivity({
          lead_id: transformedLead.id,
          type: "call",
          description: "متابعة هاتفية للعميل المحتمل الجديد",
          scheduled_at: followupDate.toISOString(),
          created_by: userData.user?.id
        });
      } catch (activityError) {
        console.error("Error creating activity:", activityError);
      }
      
      return transformedLead;
    }
    
    throw new Error("Failed to create lead - no data returned from database");
  } catch (error) {
    console.error("Error creating lead:", error);
    toast.error(`فشل في إنشاء العميل المحتمل: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    throw error;
  }
};

// Delete lead
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting lead with ID:", id);
    
    // Try deleting the lead from Supabase
    try {
      // Log the deletion activity before deleting the lead
      const { data: userData } = await supabase.auth.getUser();
      await addLeadActivity({
        lead_id: id,
        type: "delete",
        description: "تم حذف العميل المحتمل",
        created_by: userData.user?.id
      });
    } catch (activityError) {
      console.error("Error logging lead deletion activity:", activityError);
    }
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting lead from Supabase:", error);
      toast.error(`فشل في حذف العميل: ${error.message}`);
      throw error;
    }
    
    console.log("Lead successfully deleted from Supabase");
    toast.success("تم حذف العميل المحتمل بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    toast.error("فشل في حذف العميل المحتمل");
    throw error;
  }
};
