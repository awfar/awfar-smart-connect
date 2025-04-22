
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "../types/dealTypes";

// Create a new deal
export const createDeal = async (deal: Partial<Deal>): Promise<Deal | null> => {
  try {
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('deals')
      .insert({
        name: deal.name,
        description: deal.description,
        company_id: deal.company_id,
        lead_id: deal.lead_id,
        contact_id: deal.contact_id,
        value: deal.value,
        stage: deal.stage || 'discovery',
        status: deal.status || 'active',
        expected_close_date: deal.expected_close_date,
        owner_id: deal.owner_id || userData.user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating deal:", error);
      throw error;
    }

    // Log activity for this deal creation
    await supabase
      .from('activity_logs')
      .insert({
        entity_type: 'deal',
        entity_id: data.id,
        action: 'create_deal',
        details: `تم إنشاء صفقة جديدة: ${deal.name}`,
        user_id: userData.user.id
      });

    return data;
  } catch (error) {
    console.error("Error in createDeal:", error);
    throw error;
  }
};

// Update an existing deal
export const updateDeal = async (id: string, deal: Partial<Deal>): Promise<Deal | null> => {
  try {
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }

    // Extract only the updatable fields
    const updatableFields = {
      name: deal.name,
      description: deal.description,
      company_id: deal.company_id,
      lead_id: deal.lead_id,
      contact_id: deal.contact_id,
      value: deal.value,
      stage: deal.stage,
      status: deal.status,
      expected_close_date: deal.expected_close_date,
      owner_id: deal.owner_id
    };

    const { data, error } = await supabase
      .from('deals')
      .update(updatableFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating deal:", error);
      throw error;
    }

    // Log activity for this deal update
    await supabase
      .from('activity_logs')
      .insert({
        entity_type: 'deal',
        entity_id: id,
        action: 'update_deal',
        details: `تم تحديث بيانات الصفقة: ${deal.name}`,
        user_id: userData.user.id
      });

    return data;
  } catch (error) {
    console.error("Error in updateDeal:", error);
    throw error;
  }
};

// Delete a deal
export const deleteDeal = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteDeal:", error);
    throw error;
  }
};
