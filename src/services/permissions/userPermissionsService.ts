
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// جلب صلاحيات المستخدم الحالي
export const fetchUserPermissions = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Usamos una consulta directa en lugar de una función RPC que no está tipada
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        permissions (name)
      `)
      .eq('role', await getUserRole(user.id));
    
    if (error) throw error;
    
    // Verificamos si data es un array antes de usar map
    return Array.isArray(data) 
      ? data.map(item => item.permissions?.name).filter(Boolean)
      : [];
  } catch (error) {
    console.error("خطأ في جلب صلاحيات المستخدم:", error);
    toast.error("فشل في جلب صلاحيات المستخدم");
    return [];
  }
};

// Función auxiliar para obtener el rol del usuario
export const getUserRole = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data?.role || '';
  } catch (error) {
    console.error("Error getting user role:", error);
    return '';
  }
};
