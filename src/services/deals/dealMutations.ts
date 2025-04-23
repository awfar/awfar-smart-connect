
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
      name: cleanedDeal.name,
      description: cleanedDeal.description,
      company_id: cleanedDeal.company_id,
      contact_id: cleanedDeal.contact_id,
      value: cleanedDeal.value,
      stage: cleanedDeal.stage || 'discovery',
      status: cleanedDeal.status || 'active',
      expected_close_date: cleanedDeal.expected_close_date,
      owner_id: cleanedDeal.owner_id || userData.user.id
    };

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
          details: `تم إنشاء صفقة جديدة: ${deal.name}`,
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

    const { data, error } = await supabase
      .from('deals')
      .update(cleanedDeal)
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
          details: `تم تحديث بيانات الصفقة: ${deal.name || data.name}`,
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
