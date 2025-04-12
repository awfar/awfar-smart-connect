
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const createSuperAdmin = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'super_admin'
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error("فشل في إنشاء المستخدم");

    // Update profile with the role and other data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        role: 'super_admin',
        is_active: true,
        email: email // Make sure to store email in the profiles table
      })
      .eq('id', data.user.id);

    if (profileError) throw profileError;

    // Return success
    toast.success("تم إنشاء المستخدم بصلاحيات مدير النظام بنجاح");
    return true;
  } catch (error: any) {
    console.error("خطأ في إنشاء مستخدم Super Admin:", error);
    toast.error(error.message || "حدث خطأ أثناء إنشاء المستخدم");
    return false;
  }
};
