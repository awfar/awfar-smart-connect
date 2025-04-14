
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
    
    // Check if it's a mock lead or we're in demo mode
    if (lead.id.startsWith('lead-') || !supabase.auth.getUser) {
      console.log("Using mock data for demo mode (update lead)");
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
    
    // Remove any null or empty string values for UUID fields to prevent errors
    if (!leadToUpdate.assigned_to || leadToUpdate.assigned_to === '') {
      leadToUpdate.assigned_to = null;
    }
    
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
        // Don't block the update if activity logging fails
      }
      
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
    
    // Check if we should use mock data (if not authenticated or in development mode)
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const useMockData = !userData || !userData.user;
    
    if (useMockData) {
      console.log("Using mock data for demo mode (create lead)");
      // Create a new mock lead with a generated ID
      const newId = `lead-${mockLeads.length + 1}`;
      const createdAt = new Date().toISOString();
      const newLead = {
        ...lead,
        id: newId,
        created_at: createdAt,
        updated_at: createdAt,
        // Add owner information for display
        owner: {
          name: "أنت",
          avatar: "",
          initials: "أنت"
        }
      } as Lead;
      
      // Add to mock data
      mockLeads.unshift(newLead);
      
      toast.success("تم إضافة العميل المحتمل بنجاح");
      console.log("Created mock lead:", newLead);
      return newLead;
    }
    
    // Regular flow for authenticated users
    // Prepare lead data for Supabase
    const { owner, ...leadToCreate } = lead as any;
    
    // Sanitize input - ensure UUID fields are either valid UUIDs or null
    if (!leadToCreate.assigned_to || leadToCreate.assigned_to === '' || leadToCreate.assigned_to === 'unassigned') {
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
    
    // Check if it's a mock lead or we're in demo mode
    if (id.startsWith('lead-') || !supabase.auth.getUser) {
      console.log("Using mock data for demo mode (delete lead)");
      // Remove from mock data for development
      const index = mockLeads.findIndex((l) => l.id === id);
      if (index >= 0) {
        mockLeads.splice(index, 1);
        toast.success("تم حذف العميل المحتمل بنجاح");
        return true;
      }
      throw new Error("Lead not found");
    }
    
    // Log the deletion activity before deleting the lead
    try {
      const { data: userData } = await supabase.auth.getUser();
      await addLeadActivity({
        lead_id: id,
        type: "delete",
        description: "تم حذف العميل المحتمل",
        created_by: userData.user?.id
      });
    } catch (activityError) {
      console.error("Error logging lead deletion activity:", activityError);
      // Continue with deletion even if activity logging fails
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
