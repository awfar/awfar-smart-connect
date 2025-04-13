
import { supabase } from "@/integrations/supabase/client";

export interface ActivityAnalytic {
  id: string;
  label: string;
  count: number;
}

// استرجاع إحصائيات النشاط حسب نوع النشاط
export const fetchActivityAnalytics = async (): Promise<{ 
  byType: ActivityAnalytic[],
  byUser: ActivityAnalytic[],
  byEntity: ActivityAnalytic[]
}> => {
  try {
    // الإحصائيات حسب نوع النشاط
    const { data: typeData, error: typeError } = await supabase
      .from('activity_logs')
      .select('action, count(*)')
      .order('count', { ascending: false })
      .limit(5);
    
    if (typeError) throw typeError;
    
    // الإحصائيات حسب المستخدم
    const { data: userData, error: userError } = await supabase
      .from('activity_logs')
      .select('user_id, count(*)')
      .order('count', { ascending: false })
      .limit(5);
    
    if (userError) throw userError;
    
    // الإحصائيات حسب الكيان
    const { data: entityData, error: entityError } = await supabase
      .from('activity_logs')
      .select('entity_type, count(*)')
      .order('count', { ascending: false })
      .limit(5);
    
    if (entityError) throw entityError;
    
    // تحويل النتائج إلى الشكل المطلوب
    const byType: ActivityAnalytic[] = typeData.map((item: any) => ({
      id: item.action,
      label: item.action,
      count: typeof item.count === 'number' ? item.count : parseInt(item.count)
    }));
    
    const byUser: ActivityAnalytic[] = userData.map((item: any) => ({
      id: item.user_id,
      label: item.user_id,
      count: typeof item.count === 'number' ? item.count : parseInt(item.count)
    }));
    
    const byEntity: ActivityAnalytic[] = entityData.map((item: any) => ({
      id: item.entity_type,
      label: item.entity_type,
      count: typeof item.count === 'number' ? item.count : parseInt(item.count)
    }));
    
    return {
      byType,
      byUser,
      byEntity
    };
  } catch (error) {
    console.error("Error fetching activity analytics:", error);
    return {
      byType: [],
      byUser: [],
      byEntity: []
    };
  }
};
