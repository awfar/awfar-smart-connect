
import { supabase } from "@/integrations/supabase/client";

export interface ActivityLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  userName?: string;
  details?: string;
  createdAt: string;
}

// Log any action in the system
export const logActivity = async (
  entityType: string,
  entityId: string, 
  action: string,
  userId: string,
  details?: string
): Promise<void> => {
  try {
    await supabase
      .from('activity_logs')
      .insert([{
        entity_type: entityType,
        entity_id: entityId,
        action,
        user_id: userId,
        details,
        created_at: new Date().toISOString()
      }]);
    
    console.log(`Activity logged: ${action} on ${entityType} ${entityId}`);
  } catch (err) {
    console.error("Error logging activity:", err);
  }
};

// Get recent activities from the system
export const getRecentActivities = async (limit = 10): Promise<ActivityLog[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profiles:user_id (first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map(log => ({
      id: log.id,
      entityType: log.entity_type,
      entityId: log.entity_id,
      action: log.action,
      userId: log.user_id,
      userName: log.profiles ? `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() : undefined,
      details: log.details,
      createdAt: log.created_at
    }));
  } catch (err) {
    console.error("Error fetching recent activities:", err);
    return [];
  }
};

// Get activity analytics
export const getActivityAnalytics = async (): Promise<{
  actionCounts: { action: string; count: number }[];
  userCounts: { userId: string; userName: string; count: number }[];
  entityCounts: { entityType: string; count: number }[];
}> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profiles:user_id (first_name, last_name)
      `);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        actionCounts: [],
        userCounts: [],
        entityCounts: []
      };
    }
    
    // Count by action
    const actionMap: Record<string, number> = {};
    // Count by user
    const userMap: Record<string, { count: number; name: string }> = {};
    // Count by entity type
    const entityMap: Record<string, number> = {};
    
    data.forEach(log => {
      // Action counts
      actionMap[log.action] = (actionMap[log.action] || 0) + 1;
      
      // User counts
      if (!userMap[log.user_id]) {
        const userName = log.profiles 
          ? `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() 
          : 'مستخدم غير معروف';
          
        userMap[log.user_id] = {
          count: 1,
          name: userName
        };
      } else {
        userMap[log.user_id].count += 1;
      }
      
      // Entity counts
      entityMap[log.entity_type] = (entityMap[log.entity_type] || 0) + 1;
    });
    
    // Convert to arrays
    const actionCounts = Object.entries(actionMap).map(([action, count]) => ({ action, count }));
    const userCounts = Object.entries(userMap).map(([userId, data]) => ({ 
      userId, 
      userName: data.name,
      count: data.count 
    }));
    const entityCounts = Object.entries(entityMap).map(([entityType, count]) => ({ entityType, count }));
    
    return {
      actionCounts: actionCounts.sort((a, b) => b.count - a.count),
      userCounts: userCounts.sort((a, b) => b.count - a.count),
      entityCounts: entityCounts.sort((a, b) => b.count - a.count)
    };
  } catch (err) {
    console.error("Error getting activity analytics:", err);
    return {
      actionCounts: [],
      userCounts: [],
      entityCounts: []
    };
  }
};
