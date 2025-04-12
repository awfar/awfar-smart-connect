
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, SupabaseUserData } from "./types";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    // Fetch profiles directly without relying on auth admin API
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        *,
        departments (name),
        teams (name)
      `)
      .order('created_at', { ascending: false });
    
    if (profilesError) {
      throw profilesError;
    }
    
    if (!profilesData || profilesData.length === 0) {
      console.log("لا توجد ملفات شخصية تم العثور عليها");
      return [];
    }
    
    // Log the profiles data for debugging
    console.log("بيانات الملفات الشخصية:", profilesData);
    
    // Transform the data - we'll use the email from the profiles table if it exists
    const usersWithProcessedData = (profilesData || []).map((profile: SupabaseUserData) => {
      return {
        ...profile,
        // Use email from profile data or generate a placeholder
        email: profile.email || `user-${profile.id}@example.com`,
        department_name: profile.departments?.name,
        team_name: profile.teams?.name
      } as User;
    });
    
    // Log the transformed users data
    console.log("بيانات المستخدمين بعد المعالجة:", usersWithProcessedData);
    
    return usersWithProcessedData;
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
      ...data as SupabaseUserData,
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
