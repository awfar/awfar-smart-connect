
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Deal } from "../types/dealTypes";
import { transformDealFromSupabase } from "./utils";

export const createDeal = async (dealData: Partial<Deal>): Promise<Deal | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("يجب تسجيل الدخول لإنشاء صفقة");
      return null;
    }

    // Prepare data for insertion
    const dealToInsert = {
      name: dealData.name,
      description: dealData.description,
      value: dealData.value,
      stage: dealData.stage,
      status: dealData.status || 'active',
      expected_close_date: dealData.expected_close_date,
      owner_id: dealData.owner_id || userData.user.id,
      company_id: dealData.company_id,
      contact_id: dealData.contact_id,
      lead_id: dealData.lead_id
    };

    const { data, error } = await supabase
      .from('deals')
      .insert([dealToInsert])
      .select(`
        *,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name)
      `)
      .single();

    if (error) {
      console.error("Error creating deal:", error);
      throw error;
    }

    toast.success("تم إنشاء الصفقة بنجاح");
    
    // Handle potentially missing profile data
    if (data) {
      const dealWithDefaults = {
        ...data,
        profiles: data.profiles || { first_name: '', last_name: '' }
      };
      return transformDealFromSupabase(dealWithDefaults);
    }
    return null;
  } catch (error) {
    console.error("Error in createDeal:", error);
    toast.error("فشل في إنشاء الصفقة");
    return null;
  }
};

export const updateDeal = async (id: string, dealData: Partial<Deal>): Promise<Deal | null> => {
  try {
    // Remove non-database fields from dealData
    const { owner, activities, company_name, contact_name, ...dealToUpdate } = dealData;

    const { data, error } = await supabase
      .from('deals')
      .update(dealToUpdate)
      .eq('id', id)
      .select(`
        *,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name)
      `)
      .single();

    if (error) {
      console.error("Error updating deal:", error);
      throw error;
    }

    toast.success("تم تحديث الصفقة بنجاح");
    
    // Handle potentially missing profile data
    if (data) {
      const dealWithDefaults = {
        ...data,
        profiles: data.profiles || { first_name: '', last_name: '' }
      };
      return transformDealFromSupabase(dealWithDefaults);
    }
    return null;
  } catch (error) {
    console.error("Error in updateDeal:", error);
    toast.error("فشل في تحديث الصفقة");
    return null;
  }
};

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

    toast.success("تم حذف الصفقة بنجاح");
    return true;
  } catch (error) {
    console.error("Error in deleteDeal:", error);
    toast.error("فشل في حذف الصفقة");
    return false;
  }
};
