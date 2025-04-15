
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
      // Fall back to mock data only if it's a mock lead or a development environment
      if (lead.id.startsWith('lead-') || process.env.NODE_ENV === 'development') {
        console.log("Falling back to mock data for development (update lead)");
        const index = mockLeads.findIndex((l) => l.id === lead.id);
        if (index >= 0) {
          mockLeads[index] = lead;
          toast.success("تم تحديث العميل المحتمل بنجاح");
          return lead;
        }
        throw new Error("Lead not found in mock data");
      }
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
      
      console.log("Lead successfully updated in Supabase:", data);
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
    
    // Remove owner property as it's not part of the DB schema
    const { owner, ...leadToCreate } = lead as any;
    
    // Ensure assigned_to is properly handled
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
    
    // DEBUG: Log authentication status
    const { data: authData } = await supabase.auth.getSession();
    console.log("Auth status before insert:", authData);

    // Check if we need to use anonymous insert for development
    const isAuthenticated = authData.session?.user?.id;
    console.log("Is authenticated:", isAuthenticated ? "Yes" : "No");
    
    // Create in Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert(leadToCreate)
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .single();
    
    // Handle creation response
    if (error) {
      console.error("Error creating lead in Supabase:", error);
      console.error("Error details:", error.details, error.hint, error.message);
      
      // Check for RLS error
      if (error.message?.includes('violates row-level security policy')) {
        console.warn("⚠️ RLS POLICY ERROR: Your RLS policies might be blocking inserts");
        toast.error("خطأ في سياسة أمان الصفوف - تعذر الإضافة");
      }
      
      // Fall back to mock data in development mode
      if (process.env.NODE_ENV === 'development') {
        const newId = `lead-${Date.now()}`;
        const createdAt = new Date().toISOString();
        const newLead = {
          ...leadToCreate,
          id: newId,
          created_at: createdAt,
          updated_at: createdAt,
          owner: {
            name: leadToCreate.assigned_to ? "أحمد محمد" : "غير مخصص",
            avatar: "",
            initials: "أم"
          }
        } as Lead;
        
        // Add to the BEGINNING of mock data so it shows at the top of the list
        mockLeads.unshift(newLead);
        
        console.log("Created mock lead (local only):", newLead);
        toast.warning("تم إنشاء العميل المحتمل في الذاكرة المؤقتة فقط (وضع المحاكاة)");
        return newLead;
      }
      
      throw error;
    }
    
    // If operation was successful, return the new lead
    if (data) {
      const transformedLead = transformLeadFromSupabase(data);
      console.log("Lead successfully created in Supabase:", transformedLead);
      
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
    
    // IMPORTANT: Always delete from Supabase first, regardless of ID format
    // Try deleting the lead from Supabase (even if it might be a mock ID)
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
      // Continue with deletion even if activity logging fails
    }
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting lead from Supabase:", error);
      
      // Only fall back to mock deletion if it's a mock ID or in development
      if (id.startsWith('lead-') || process.env.NODE_ENV === 'development') {
        console.log("Using mock data for demo mode (delete lead)");
        // Remove from mock data for development
        const index = mockLeads.findIndex((l) => l.id === id);
        if (index >= 0) {
          mockLeads.splice(index, 1);
          toast.success("تم حذف العميل المحتمل بنجاح");
          return true;
        }
        throw new Error("Lead not found in mock data");
      }
      
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
