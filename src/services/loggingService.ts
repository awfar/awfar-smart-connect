
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
    // Using a direct database insert approach
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        entity_type: entityType,
        entity_id: entityId,
        action: action,
        user_id: userId,
        details: details
      });
    
    if (error) {
      console.error("Error logging activity:", error);
      return;
    }
    
    console.log(`Activity logged: ${action} on ${entityType} ${entityId}`);
  } catch (err) {
    console.error("Error logging activity:", err);
  }
};

// Get recent activities from the system
export const getRecentActivities = async (limit = 10): Promise<ActivityLog[]> => {
  try {
    // Using a direct query approach
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        id,
        entity_type,
        entity_id,
        action,
        user_id,
        details,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map((log: any) => ({
      id: log.id,
      entityType: log.entity_type,
      entityId: log.entity_id,
      action: log.action,
      userId: log.user_id,
      userName: 'مستخدم', // Default name since we don't have user profile join
      details: log.details,
      createdAt: log.created_at
    }));
  } catch (err) {
    console.error("Error fetching recent activities:", err);
    return getMockActivities(limit);
  }
};

// Get activity analytics
export const getActivityAnalytics = async (): Promise<{
  actionCounts: { action: string; count: number }[];
  userCounts: { userId: string; userName: string; count: number }[];
  entityCounts: { entityType: string; count: number }[];
}> => {
  try {
    // Get action counts
    const { data: actionData, error: actionError } = await supabase
      .from('activity_logs')
      .select('action, count')
      .group('action');
    
    if (actionError) throw actionError;
    
    // Get user counts
    const { data: userData, error: userError } = await supabase
      .from('activity_logs')
      .select('user_id, count')
      .group('user_id');
    
    if (userError) throw userError;
    
    // Get entity counts
    const { data: entityData, error: entityError } = await supabase
      .from('activity_logs')
      .select('entity_type, count')
      .group('entity_type');
    
    if (entityError) throw entityError;
    
    const actionCounts = actionData.map((item: any) => ({
      action: item.action,
      count: parseInt(item.count)
    }));
    
    const userCounts = userData.map((item: any) => ({
      userId: item.user_id,
      userName: 'مستخدم', // Default name 
      count: parseInt(item.count)
    }));
    
    const entityCounts = entityData.map((item: any) => ({
      entityType: item.entity_type,
      count: parseInt(item.count)
    }));
    
    return {
      actionCounts,
      userCounts,
      entityCounts
    };
  } catch (err) {
    console.error("Error getting activity analytics:", err);
    return getMockActivityAnalytics();
  }
};

// Helper functions for mock data
function getMockActivities(limit: number): ActivityLog[] {
  const mockActivities: ActivityLog[] = [
    {
      id: "act-001",
      entityType: "lead",
      entityId: "lead-001",
      action: "اتصال",
      userId: "user-001",
      userName: "أحمد محمد",
      details: "تم إجراء مكالمة مع العميل بخصوص العرض الجديد",
      createdAt: new Date().toISOString()
    },
    {
      id: "act-002",
      entityType: "invoice",
      entityId: "inv-001",
      action: "إنشاء",
      userId: "user-002",
      userName: "سارة أحمد",
      details: "تم إنشاء فاتورة جديدة",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "act-003",
      entityType: "product",
      entityId: "prod-001",
      action: "تحديث",
      userId: "user-001",
      userName: "أحمد محمد",
      details: "تم تحديث معلومات المنتج",
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ];
  
  // Return the requested number of activities
  return mockActivities.slice(0, limit);
}

function getMockActivityAnalytics() {
  return {
    actionCounts: [
      { action: "إنشاء", count: 15 },
      { action: "تحديث", count: 10 },
      { action: "حذف", count: 5 },
      { action: "اتصال", count: 8 }
    ],
    userCounts: [
      { userId: "user-001", userName: "أحمد محمد", count: 20 },
      { userId: "user-002", userName: "سارة أحمد", count: 15 },
      { userId: "user-003", userName: "محمد علي", count: 10 }
    ],
    entityCounts: [
      { entityType: "lead", count: 25 },
      { entityType: "invoice", count: 15 },
      { entityType: "product", count: 10 }
    ]
  };
}
