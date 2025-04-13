
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ActivityAnalytic {
  name: string;
  count: number;
}

// استدعاء دالة قاعدة البيانات لجلب تحليلات النشاط
export const fetchActivityAnalytics = async (type: 'action' | 'user' | 'entity'): Promise<ActivityAnalytic[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    switch (type) {
      case 'action': {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('action, count')
          .order('count', { ascending: false });
        
        if (error) throw error;
        
        return data.map(item => ({
          name: item.action || 'غير معروف',
          count: typeof item.count === 'string' 
            ? parseInt(item.count, 10) 
            : Number(item.count)
        }));
      }
      
      case 'user': {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('user_id, count')
          .order('count', { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => ({
          name: item.user_id || 'غير معروف',
          count: typeof item.count === 'string' 
            ? parseInt(item.count, 10) 
            : Number(item.count)
        }));
      }
        
      case 'entity': {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('entity_type, count')
          .order('count', { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => ({
          name: item.entity_type || 'غير معروف',
          count: typeof item.count === 'string' 
            ? parseInt(item.count, 10) 
            : Number(item.count)
        }));
      }
        
      default:
        return [];
    }
  } catch (error) {
    console.error(`خطأ في جلب تحليلات النشاط (${type}):`, error);
    toast.error("فشل في جلب تحليلات النشاط");
    return [];
  }
};
