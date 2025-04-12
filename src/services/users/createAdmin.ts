
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Update createSuperAdmin function to include the site URL
export const createSuperAdmin = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
  try {
    const siteUrl = window.location.origin; // Get the current site URL
    
    // إنشاء المستخدم في نظام المصادقة
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        },
        emailRedirectTo: `${siteUrl}/login` // Redirect to login page after email confirmation
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("فشل في إنشاء المستخدم");
    
    // تحديث دور المستخدم في جدول profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: 'super_admin',
        first_name: firstName,
        last_name: lastName,
        is_active: true
      })
      .eq('id', authData.user.id);
    
    if (profileError) throw profileError;
    
    toast.success("تم إنشاء المستخدم المسؤول بنجاح");
    return true;
  } catch (error: any) {
    console.error("خطأ في إنشاء المستخدم المسؤول:", error);
    toast.error(error.message || "فشل في إنشاء المستخدم المسؤول");
    return false;
  }
};
