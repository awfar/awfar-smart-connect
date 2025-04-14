
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "../types/leadTypes";
import { mockLeads } from "./mockData";
import { toast } from "sonner";
import { addLeadActivity } from "./leadActivities";
import { transformLeadFromSupabase } from "./utils";

// Update lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  try {
    console.log("Updating lead:", lead);
    
    // Check if it's a mock lead (shouldn't normally happen in production)
    if (lead.id.startsWith('lead-')) {
      console.warn("Attempted to update a mock lead in production mode");
      // Update mock lead for development
      const index = mockLeads.findIndex((l) => l.id === lead.id);
      if (index >= 0) {
        mockLeads[index] = lead;
        toast.success("تم تحديث العميل المحتمل بنجاح");
        return lead;
      }
      throw new Error("Lead not found");
    }
    
    // Prepare lead data for Supabase (remove owner property)
    const { owner, ...leadToUpdate } = lead;
    
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
      throw error;
    }
    
    // If operation was successful, return the updated lead
    if (data) {
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

// Create new lead
export const createLead = async (lead: Omit<Lead, "id">): Promise<Lead> => {
  try {
    console.log("Creating new lead:", lead);
    
    // Prepare lead data for Supabase
    const { owner, ...leadToCreate } = lead as any;
    
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
    
    // Try creating the lead in Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert(leadToCreate)
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .single();
    
    if (error) {
      console.error("Error creating lead in Supabase:", error);
      throw error;
    }
    
    // If operation was successful, return the new lead
    if (data) {
      const transformedLead = transformLeadFromSupabase(data);
      
      // Create automatic follow-up activity after 3 days
      const followupDate = new Date();
      followupDate.setDate(followupDate.getDate() + 3);
      
      try {
        await addLeadActivity({
          lead_id: transformedLead.id,
          type: "call",
          description: "متابعة هاتفية للعميل المحتمل الجديد",
          scheduled_at: followupDate.toISOString()
        });
      } catch (activityError) {
        console.error("Error creating follow-up activity:", activityError);
        // Don't block lead creation if activity creation fails
      }
      
      toast.success("تم إنشاء العميل المحتمل بنجاح");
      return transformedLead;
    }
    
    throw new Error("Failed to create lead");
  } catch (error) {
    console.error("Error creating lead:", error);
    toast.error("فشل في إنشاء العميل المحتمل");
    throw error;
  }
};

// Delete lead
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting lead with ID:", id);
    
    // Check if it's a mock lead
    if (id.startsWith('lead-')) {
      console.warn("Attempted to delete a mock lead in production mode");
      // Remove from mock data for development
      const index = mockLeads.findIndex((l) => l.id === id);
      if (index >= 0) {
        mockLeads.splice(index, 1);
        toast.success("تم حذف العميل المحتمل بنجاح");
        return true;
      }
      throw new Error("Lead not found");
    }
    
    // Try deleting the lead from Supabase
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting lead from Supabase:", error);
      throw error;
    }
    
    toast.success("تم حذف العميل المحتمل بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    toast.error("فشل في حذف العميل المحتمل");
    throw error;
  }
};
