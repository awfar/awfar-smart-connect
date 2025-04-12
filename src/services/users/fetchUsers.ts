
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, SupabaseUserData, AuthUser } from "./types";

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
