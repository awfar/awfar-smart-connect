
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

// Define an interface for the auth user data structure
interface AuthUser {
  id: string;
  email?: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    // First, fetch all auth users to get their emails
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("خطأ في جلب بيانات المستخدمين من نظام المصادقة:", authError);
      // Try to continue with just profiles data
    }
    
    // Then fetch all profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        *,
        departments (name),
        teams (name)
      `)
      .order('created_at', { ascending: false });
    
    if (profilesError) throw profilesError;
    
    if (!profilesData || profilesData.length === 0) {
      // Log that no profiles were found
      console.log("لا توجد ملفات شخصية تم العثور عليها");
      return [];
    }
    
    // Log the profiles data for debugging
    console.log("بيانات الملفات الشخصية:", profilesData);
    
    // Create an email map from auth users
    const emailMap = new Map<string, string>();
    if (authUsers?.users) {
      authUsers.users.forEach((user: AuthUser) => {
        if (user.id && user.email) {
          emailMap.set(user.id, user.email);
        }
      });
    }

    // Transform the data to include email and other properties
    const usersWithEmails = (profilesData || []).map((profile: SupabaseUserData) => {
      // Get email from auth users if available, otherwise use fallback
      const email = emailMap.get(profile.id) || profile.email || `user-${profile.id}@example.com`;
      
      return {
        ...profile,
        email,
        department_name: profile.departments?.name,
        team_name: profile.teams?.name
      } as User;
    });
    
    // Log the transformed users data
    console.log("بيانات المستخدمين بعد المعالجة:", usersWithEmails);
    
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
