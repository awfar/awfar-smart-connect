
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "../types/dealTypes";
import { toast } from "sonner";

// Create a new deal
export const createDeal = async (deal: Partial<Deal>): Promise<Deal | null> => {
  try {
    console.log("Creating deal with data:", deal);
    
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      console.log("User not authenticated");
      toast.error("يجب تسجيل الدخول لإنشاء صفقة");
      throw new Error("User not authenticated");
    }

    // Filter out null and 'none' values to avoid DB errors
    const cleanedDeal = Object.fromEntries(
      Object.entries(deal).filter(([_, v]) => v !== null && v !== 'none' && v !== undefined)
    );

    // Insert the deal with proper type handling for required fields
    const dealToInsert = {
      name: String(cleanedDeal.name || ''),
      description: cleanedDeal.description ? String(cleanedDeal.description) : undefined,
      company_id: cleanedDeal.company_id ? String(cleanedDeal.company_id) : undefined,
      contact_id: cleanedDeal.contact_id ? String(cleanedDeal.contact_id) : undefined,
      lead_id: cleanedDeal.lead_id ? String(cleanedDeal.lead_id) : undefined, // Added lead_id handling
      value: typeof cleanedDeal.value === 'number' ? cleanedDeal.value : undefined,
      stage: String(cleanedDeal.stage || 'discovery'),
      status: String(cleanedDeal.status || 'active'),
      expected_close_date: cleanedDeal.expected_close_date ? String(cleanedDeal.expected_close_date) : undefined,
      owner_id: cleanedDeal.owner_id ? String(cleanedDeal.owner_id) : userData.user.id
    };

    console.log("Inserting deal with processed data:", dealToInsert);

    const { data, error } = await supabase
      .from('deals')
      .insert(dealToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating deal:", error);
      toast.error("حدث خطأ أثناء إنشاء الصفقة");
      throw error;
    }

    console.log("Deal created successfully:", data);

    // Log activity for this deal creation
    try {
      await supabase
        .from('activity_logs')
        .insert({
          entity_type: 'deal',
          entity_id: data.id,
          action: 'create_deal',
          details: `تم إنشاء صفقة جديدة: ${dealToInsert.name}`,
          user_id: userData.user.id
        });
    } catch (activityError) {
      console.error("Error logging activity:", activityError);
      // Non-blocking error, don't throw
    }

    toast.success("تم إنشاء الصفقة بنجاح");
    return data;
  } catch (error) {
    console.error("Error in createDeal:", error);
    toast.error("فشل في إنشاء الصفقة");
    return null;
  }
};

// Update an existing deal
export const updateDeal = async (id: string, deal: Partial<Deal>): Promise<Deal | null> => {
  try {
    console.log("Updating deal with ID:", id, "Data:", deal);
    
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("يجب تسجيل الدخول لتحديث الصفقة");
      throw new Error("User not authenticated");
    }

    // Filter out null and 'none' values to avoid DB errors
    const cleanedDeal = Object.fromEntries(
      Object.entries(deal).filter(([_, v]) => v !== null && v !== 'none' && v !== undefined)
    );

    // Ensure all fields are of the correct type for the database
    const dealToUpdate: Record<string, any> = {};
    
    if ('name' in cleanedDeal) dealToUpdate.name = String(cleanedDeal.name);
    if ('description' in cleanedDeal) dealToUpdate.description = cleanedDeal.description ? String(cleanedDeal.description) : null;
    if ('company_id' in cleanedDeal) dealToUpdate.company_id = cleanedDeal.company_id ? String(cleanedDeal.company_id) : null;
    if ('contact_id' in cleanedDeal) dealToUpdate.contact_id = cleanedDeal.contact_id ? String(cleanedDeal.contact_id) : null;
    if ('lead_id' in cleanedDeal) dealToUpdate.lead_id = cleanedDeal.lead_id ? String(cleanedDeal.lead_id) : null; // Added lead_id handling
    if ('value' in cleanedDeal && cleanedDeal.value !== undefined) dealToUpdate.value = Number(cleanedDeal.value);
    if ('stage' in cleanedDeal) dealToUpdate.stage = String(cleanedDeal.stage);
    if ('status' in cleanedDeal) dealToUpdate.status = String(cleanedDeal.status);
    if ('expected_close_date' in cleanedDeal) dealToUpdate.expected_close_date = cleanedDeal.expected_close_date ? String(cleanedDeal.expected_close_date) : null;
    if ('owner_id' in cleanedDeal) dealToUpdate.owner_id = cleanedDeal.owner_id ? String(cleanedDeal.owner_id) : null;

    console.log("Updating deal with processed data:", dealToUpdate);
    
    const { data, error } = await supabase
      .from('deals')
      .update(dealToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating deal:", error);
      toast.error("حدث خطأ أثناء تحديث الصفقة");
      throw error;
    }

    console.log("Deal updated successfully:", data);

    // Log activity for this deal update
    try {
      await supabase
        .from('activity_logs')
        .insert({
          entity_type: 'deal',
          entity_id: id,
          action: 'update_deal',
          details: `تم تحديث بيانات الصفقة: ${dealToUpdate.name || data.name}`,
          user_id: userData.user.id
        });
    } catch (activityError) {
      console.error("Error logging activity:", activityError);
      // Non-blocking error, don't throw
    }

    toast.success("تم تحديث الصفقة بنجاح");
    return data;
  } catch (error) {
    console.error("Error in updateDeal:", error);
    toast.error("فشل في تحديث الصفقة");
    return null;
  }
};

// Delete a deal
export const deleteDeal = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting deal with ID:", id);

    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting deal:", error);
      toast.error("حدث خطأ أثناء حذف الصفقة");
      throw error;
    }

    toast.success("تم حذف الصفقة بنجاح");
    return true;
  } catch (error) {
    console.error("Error in deleteDeal:", error);
    toast.error("فشل في حذف الصفقة");
    return false;
  }
};
