
// Functions for modifying lead data
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "../types/leadTypes";
import { mockLeads } from "./mockData";
import { toast } from "sonner";
import { addLeadActivity } from "./leadActivities";

// Update lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  try {
    console.log("Updating lead:", lead);
    
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
      .select()
      .single();
    
    if (error) {
      console.error("Error updating lead in Supabase:", error);
      throw error;
    }
    
    // If operation was successful, return the updated lead
    if (data) {
      toast.success("تم تحديث العميل المحتمل بنجاح");
      return {
        ...data,
        owner // Keep the owner information from the provided data
      };
    }
    
    // Fallback to mock data
    const index = mockLeads.findIndex((l) => l.id === lead.id);
    if (index >= 0) {
      mockLeads[index] = lead;
    }
    toast.success("تم تحديث العميل المحتمل بنجاح");
    return lead;
  } catch (error) {
    console.error("Error updating lead:", error);
    toast.error("فشل في تحديث العميل المحتمل");
    
    // Fallback to mock data
    const index = mockLeads.findIndex((l) => l.id === lead.id);
    if (index >= 0) {
      mockLeads[index] = lead;
    }
    return lead;
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
    
    // Set default stage if not provided
    if (!leadToCreate.stage) {
      leadToCreate.stage = 'جديد';
    }
    
    // Try creating the lead in Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert(leadToCreate)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating lead in Supabase:", error);
      throw error;
    }
    
    // If operation was successful, return the new lead
    if (data) {
      // Create automatic follow-up activity after 3 days
      const followupDate = new Date();
      followupDate.setDate(followupDate.getDate() + 3);
      
      try {
        await addLeadActivity({
          lead_id: data.id,
          type: "call",
          description: "متابعة هاتفية للعميل المحتمل الجديد",
          scheduled_at: followupDate.toISOString()
        });
      } catch (activityError) {
        console.error("Error creating follow-up activity:", activityError);
        // Don't block lead creation if activity creation fails
      }
      
      toast.success("تم إنشاء العميل المحتمل بنجاح");
      return {
        ...data,
        owner // Keep owner information if provided
      };
    }
    
    // Fallback to mock data
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...lead,
    };
    mockLeads.push(newLead);
    
    // Create follow-up activity
    const followupDate = new Date();
    followupDate.setDate(followupDate.getDate() + 3);
    
    try {
      await addLeadActivity({
        lead_id: newLead.id,
        type: "call",
        description: "متابعة هاتفية للعميل المحتمل الجديد",
        scheduled_at: followupDate.toISOString()
      });
    } catch (activityError) {
      console.error("Error creating follow-up activity:", activityError);
    }
    
    toast.success("تم إنشاء العميل المحتمل بنجاح");
    return newLead;
  } catch (error) {
    console.error("Error creating lead:", error);
    toast.error("فشل في إنشاء العميل المحتمل");
    
    // Fallback to mock data in case of error
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...lead,
    };
    mockLeads.push(newLead);
    
    return newLead;
  }
};

// Delete lead
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting lead with ID:", id);
    
    // Try deleting the lead from Supabase
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting lead from Supabase:", error);
      throw error;
    }
    
    // Also remove from mock data
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index >= 0) {
      mockLeads.splice(index, 1);
    }
    
    toast.success("تم حذف العميل المحتمل بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    toast.error("فشل في حذف العميل المحتمل");
    
    // Fallback to mock data in case of error
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index >= 0) {
      mockLeads.splice(index, 1);
      return true;
    }
    return false;
  }
};
