
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, SupabaseUserData } from "./types";

export const updateUser = async (user: Partial<User> & { id: string }): Promise<User | null> => {
  try {
    // إزالة الحقول الغير مطلوبة قبل الإرسال
    const { department_name, team_name, departments, teams, email, ...userData } = user as any;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...userData
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث المستخدم بنجاح");
    
    // Add back the email to the returned data
    const updatedUser: User = {
      ...(data as SupabaseUserData),
      email: email || `user-${data.id}@example.com` // Use the provided email or a fallback
    };
    
    return updatedUser;
  } catch (error) {
    console.error("خطأ في تحديث المستخدم:", error);
    toast.error("فشل في تحديث المستخدم");
    return null;
  }
};

export const deactivateUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("تم تعطيل المستخدم بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في تعطيل المستخدم:", error);
    toast.error("فشل في تعطيل المستخدم");
    return false;
  }
};

export const activateUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("تم تفعيل المستخدم بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في تفعيل المستخدم:", error);
    toast.error("فشل في تفعيل المستخدم");
    return false;
  }
};
