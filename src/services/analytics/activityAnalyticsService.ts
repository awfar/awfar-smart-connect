
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
      .from('activity_logs')
      .select('action, count')
      .order('action')
      .group('action');
    
    if (typeError) throw typeError;

    // 2. Получаем аналитику по пользователям
    const { data: userActivities, error: userError } = await supabase
      .from('activity_logs')
      .select(`
        user_id,
        profiles:user_id(first_name, last_name),
        count
      `)
      .order('count', { ascending: false })
      .group('user_id, profiles.first_name, profiles.last_name')
      .limit(10);
    
    if (userError) throw userError;

    // 3. Получаем аналитику по типам сущностей (leads, deals, и т.д.)
    const { data: entityData, error: entityError } = await supabase
      .from('activity_logs')
      .select('entity_type, count')
      .order('count', { ascending: false })
      .group('entity_type');
    
    if (entityError) throw entityError;

    // Форматируем данные для графиков
    const byType: ActivityAnalytic[] = (byTypeData || []).map(item => ({
      label: item.action,
      count: parseInt(item.count)
    }));

    const byUser: ActivityAnalytic[] = (userActivities || []).map(item => {
      const name = item.profiles 
        ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() 
        : 'مستخدم غير معروف';
      return {
        label: name || item.user_id,
        count: parseInt(item.count)
      };
    });

    const byEntity: ActivityAnalytic[] = (entityData || []).map(item => ({
      label: item.entity_type,
      count: parseInt(item.count)
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
