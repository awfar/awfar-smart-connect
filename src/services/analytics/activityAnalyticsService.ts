
import { supabase } from "@/integrations/supabase/client";

export interface ActivityAnalytic {
  label: string;
  count: number;
}

export interface ActivityAnalyticsData {
  byType: ActivityAnalytic[];
  byUser: ActivityAnalytic[];
  byEntity: ActivityAnalytic[];
}

export const fetchActivityAnalytics = async (): Promise<ActivityAnalyticsData> => {
  try {
    // 1. Получаем аналитику по типам действий (create, update, delete, и т.д.)
    const { data: byTypeData, error: typeError } = await supabase
      .rpc('count_activities_by_action') as { data: { action: string, count: string }[], error: any };
    
    if (typeError) throw typeError;

    // 2. Получаем аналитику по пользователям
    const { data: userActivities, error: userError } = await supabase
      .rpc('count_activities_by_user') as { data: { user_id: string, first_name: string, last_name: string, count: string }[], error: any };
    
    if (userError) throw userError;

    // 3. Получаем аналитику по типам сущностей (leads, deals, и т.д.)
    const { data: entityData, error: entityError } = await supabase
      .rpc('count_activities_by_entity_type') as { data: { entity_type: string, count: string }[], error: any };
    
    if (entityError) throw entityError;

    // Форматируем данные для графиков
    const byType: ActivityAnalytic[] = (byTypeData || []).map(item => ({
      label: item.action,
      count: parseInt(item.count.toString())
    }));

    const byUser: ActivityAnalytic[] = (userActivities || []).map(item => {
      const name = item.first_name || item.last_name 
        ? `${item.first_name || ''} ${item.last_name || ''}`.trim() 
        : 'مستخدم غير معروف';
      return {
        label: name || item.user_id,
        count: parseInt(item.count.toString())
      };
    });

    const byEntity: ActivityAnalytic[] = (entityData || []).map(item => ({
      label: item.entity_type,
      count: parseInt(item.count.toString())
    }));

    return {
      byType,
      byUser,
      byEntity
    };
  } catch (error) {
    console.error("خطأ في جلب بيانات تحليل النشاط:", error);
    return {
      byType: [],
      byUser: [],
      byEntity: []
    };
  }
};
