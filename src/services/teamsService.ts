
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Team {
  id: string;
  name: string;
  department_id: string | null;
  manager_id: string | null;
  created_at: string;
  updated_at: string;
  department_name?: string;
  manager_name?: string;
  member_count?: number;
}

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        departments (name),
        profiles!teams_manager_id_fkey (first_name, last_name)
      `)
      .order('name');
    
    if (error) throw error;
    
    // احصل على عدد الأعضاء في كل فريق
    const teamsWithCount = await Promise.all((data || []).map(async (team) => {
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', team.id);
      
      return {
        ...team,
        department_name: team.departments?.name,
        manager_name: team.profiles ? `${team.profiles.first_name || ''} ${team.profiles.last_name || ''}`.trim() : null,
        member_count: count || 0
      };
    }));
    
    return teamsWithCount;
  } catch (error) {
    console.error("خطأ في جلب الفرق:", error);
    toast.error("فشل في جلب بيانات الفرق");
    return [];
  }
};

export const createTeam = async (team: { name: string; department_id: string; manager_id?: string }): Promise<Team | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([{
        name: team.name,
        department_id: team.department_id,
        manager_id: team.manager_id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إنشاء الفريق بنجاح");
    return data;
  } catch (error) {
    console.error("خطأ في إنشاء الفريق:", error);
    toast.error("فشل في إنشاء الفريق");
    return null;
  }
};

export const updateTeam = async (team: Partial<Team> & { id: string }): Promise<Team | null> => {
  try {
    const { department_name, manager_name, member_count, departments, profiles, ...teamData } = team as any;
    
    const { data, error } = await supabase
      .from('teams')
      .update({
        ...teamData,
        updated_at: new Date().toISOString()
      })
      .eq('id', team.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث الفريق بنجاح");
    return data;
  } catch (error) {
    console.error("خطأ في تحديث الفريق:", error);
    toast.error("فشل في تحديث الفريق");
    return null;
  }
};

export const deleteTeam = async (id: string): Promise<boolean> => {
  try {
    // التحقق من عدم وجود أعضاء في الفريق
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', id);
    
    if (countError) throw countError;
    
    if (count && count > 0) {
      toast.error("لا يمكن حذف الفريق لأنه يحتوي على أعضاء");
      return false;
    }
    
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("تم حذف الفريق بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في حذف الفريق:", error);
    toast.error("فشل في حذف الفريق");
    return false;
  }
};

export const getTeamMembers = async (teamId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('team_id', teamId)
      .order('first_name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("خطأ في جلب أعضاء الفريق:", error);
    toast.error("فشل في جلب أعضاء الفريق");
    return [];
  }
};
