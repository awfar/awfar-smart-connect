
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department_id: string | null;
  team_id: string | null;
  is_active: boolean;
  created_at: string;
  department_name?: string;
  team_name?: string;
}

// Define an interface for the raw data returned from Supabase
interface SupabaseUserData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department_id: string | null;
  team_id: string | null;
  is_active: boolean;
  created_at: string;
  company?: string;
  position?: string;
  email?: string; // Make email optional since it might not exist in the raw data
  departments?: { name: string } | null;
  teams?: { name: string } | null;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        departments (name),
        teams (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Transform the data to include email and other properties
    const usersWithEmails = (data || []).map((user: SupabaseUserData) => {
      return {
        ...user,
        email: user.email || `user-${user.id}@example.com`, // Fallback email
        department_name: user.departments?.name,
        team_name: user.teams?.name
      } as User;
    });
    
    return usersWithEmails;
  } catch (error) {
    console.error("خطأ في جلب المستخدمين:", error);
    toast.error("فشل في جلب بيانات المستخدمين");
    return [];
  }
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        departments (name),
        teams (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Add email and other properties
    const userData: User = {
      ...data as SupabaseUserData, // Cast to our interface
      email: (data as SupabaseUserData).email || `user-${data.id}@example.com`, // Fallback email
      department_name: (data as SupabaseUserData).departments?.name,
      team_name: (data as SupabaseUserData).teams?.name
    };
    
    return userData;
  } catch (error) {
    console.error("خطأ في جلب تفاصيل المستخدم:", error);
    toast.error("فشل في جلب تفاصيل المستخدم");
    return null;
  }
};

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

export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    // أولاً، نحصل على دور المستخدم
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // ثم نحصل على الصلاحيات المرتبطة بهذا الدور
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('role_permissions')
      .select(`
        permissions (name)
      `)
      .eq('role', userData.role);
    
    if (permissionsError) throw permissionsError;
    
    return permissionsData.map(p => p.permissions.name);
  } catch (error) {
    console.error("خطأ في جلب صلاحيات المستخدم:", error);
    toast.error("فشل في جلب صلاحيات المستخدم");
    return [];
  }
};
