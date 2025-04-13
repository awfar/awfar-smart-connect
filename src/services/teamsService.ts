
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
    console.log("Fetching teams...");
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        departments (name)
      `)
      .order('name');
    
    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
    
    console.log("Teams fetched:", data);
    
    // Get team managers and member counts separately
    const teamsWithDetails = await Promise.all((data || []).map(async (team) => {
      // Get manager details if there is a manager
      let managerName = null;
      if (team.manager_id) {
        const { data: managerData, error: managerError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', team.manager_id)
          .single();
        
        if (managerError) {
          console.error("Error fetching manager data:", managerError);
        }
        
        if (!managerError && managerData) {
          managerName = `${managerData.first_name || ''} ${managerData.last_name || ''}`.trim();
        }
      }
      
      // Get member count
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', team.id);
      
      if (countError) {
        console.error("Error fetching team member count:", countError);
      }
      
      return {
        ...team,
        department_name: team.departments?.name,
        manager_name: managerName,
        member_count: count || 0
      };
    }));
    
    return teamsWithDetails;
  } catch (error) {
    console.error("خطأ في جلب الفرق:", error);
    toast.error("فشل في جلب بيانات الفرق");
    return [];
  }
};

export const createTeam = async (team: { name: string; department_id?: string; manager_id?: string }): Promise<Team | null> => {
  try {
    console.log("Creating team with data:", team);
    
    // Clean undefined values
    const teamData = {
      name: team.name,
      department_id: team.department_id || null,
      manager_id: team.manager_id || null
    };
    
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating team:", error);
      throw error;
    }
    
    console.log("Team created successfully:", data);
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
    console.log("Updating team:", team);
    const { department_name, manager_name, member_count, departments, profiles, ...teamData } = team as any;
    
    // Clean data for update
    const cleanTeamData = {
      ...teamData,
      updated_at: new Date().toISOString(),
      department_id: teamData.department_id || null,
      manager_id: teamData.manager_id || null
    };
    
    const { data, error } = await supabase
      .from('teams')
      .update(cleanTeamData)
      .eq('id', team.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating team:", error);
      throw error;
    }
    
    console.log("Team updated successfully:", data);
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
    console.log("Attempting to delete team:", id);
    // التحقق من عدم وجود أعضاء في الفريق
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', id);
    
    if (countError) {
      console.error("Error checking team members:", countError);
      throw countError;
    }
    
    if (count && count > 0) {
      console.log("Cannot delete team with members:", count);
      toast.error("لا يمكن حذف الفريق لأنه يحتوي على أعضاء");
      return false;
    }
    
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting team:", error);
      throw error;
    }
    
    console.log("Team deleted successfully");
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
    console.log("Fetching team members for team:", teamId);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('team_id', teamId)
      .order('first_name');
    
    if (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }
    
    console.log("Team members fetched:", data);
    return data || [];
  } catch (error) {
    console.error("خطأ في جلب أعضاء الفريق:", error);
    toast.error("فشل في جلب أعضاء الفريق");
    return [];
  }
};
