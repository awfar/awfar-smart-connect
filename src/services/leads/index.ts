
// Re-export all the types and functions from other files
export * from './types';
export * from './utils';
export * from './api';

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Delete lead activity function
export const deleteLeadActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lead_activities')
      .delete()
      .eq('id', activityId);
      
    if (error) throw error;
    
    toast.success("تم حذف النشاط بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting lead activity:", error);
    toast.error("حدث خطأ في حذف النشاط");
    return false;
  }
};
