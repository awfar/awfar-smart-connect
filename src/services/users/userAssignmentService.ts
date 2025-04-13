
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// تعيين دور للمستخدم
export const assignRoleToUser = async (userId: string, roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: roleId })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("تم تعيين الدور للمستخدم بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في تعيين الدور للمستخدم:", error);
    toast.error("فشل في تعيين الدور للمستخدم");
    return false;
  }
};

// تعيين مستخدم لفريق
export const assignUserToTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ team_id: teamId })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("تم تعيين المستخدم للفريق بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في تعيين المستخدم للفريق:", error);
    toast.error("فشل في تعيين المستخدم للفريق");
    return false;
  }
};

// تغيير حالة المستخدم (نشط/معلق)
export const changeUserStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);
    
    if (error) throw error;
    
    const statusText = isActive ? 'تنشيط' : 'تعليق';
    toast.success(`تم ${statusText} المستخدم بنجاح`);
    return true;
  } catch (error) {
    console.error("خطأ في تغيير حالة المستخدم:", error);
    toast.error("فشل في تغيير حالة المستخدم");
    return false;
  }
};
