
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/services/leads/types';

// Types
export interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  qualifiedLeads: number;
  newLeadsThisMonth: number;
  totalDeals: number;
  avgDealValue: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  upcomingAppointments: number;
  openTickets: number;
}

export interface RecentActivity {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  user_id: string;
  user_name: string;
  details?: string;
  created_at: string;
}

// Dashboard data fetching functions
export const fetchDashboardData = async (): Promise<DashboardStats> => {
  try {
    // In a real implementation, we would make API calls to fetch this data from Supabase
    // For now, we'll return mock data
    return {
      totalLeads: 124,
      activeLeads: 78,
      qualifiedLeads: 32,
      newLeadsThisMonth: 18,
      totalDeals: 45,
      avgDealValue: 15000,
      totalTasks: 87,
      completedTasks: 52,
      pendingTasks: 35,
      upcomingAppointments: 12,
      openTickets: 8
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const { data, error } = await supabase.rpc('get_recent_activities', { p_limit: 20 });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

// Stats calculations
export const calculateLeadConversionRate = (stats: DashboardStats): number => {
  if (stats.totalLeads === 0) return 0;
  return (stats.qualifiedLeads / stats.totalLeads) * 100;
};

export const calculateTaskCompletionRate = (stats: DashboardStats): number => {
  if (stats.totalTasks === 0) return 0;
  return (stats.completedTasks / stats.totalTasks) * 100;
};

// Additional functions as needed
export const getTopPerformers = async () => {
  try {
    // This would be a call to a DB function like:
    // const { data, error } = await supabase.rpc('get_top_performers');
    // For now, we'll return mock data
    return [
      { id: '1', name: 'محمد علي', deals_closed: 12, value: 120000 },
      { id: '2', name: 'أحمد خالد', deals_closed: 10, value: 95000 },
      { id: '3', name: 'ليلى عبدالله', deals_closed: 8, value: 82000 },
    ];
  } catch (error) {
    console.error('Error fetching top performers:', error);
    return [];
  }
};

// Fix array access in these functions
export const getLeadSourceDistribution = async () => {
  // Mock data for lead source distribution
  return [
    { name: 'الموقع الإلكتروني', value: 45 },
    { name: 'وسائل التواصل الاجتماعي', value: 30 },
    { name: 'الإحالات', value: 15 },
    { name: 'معارض تجارية', value: 5 },
    { name: 'أخرى', value: 5 },
  ];
};

export const getLeadsByStatus = async () => {
  // Mock data for leads by status
  return [
    { name: 'جديد', value: 45 },
    { name: 'تم التواصل', value: 25 },
    { name: 'مؤهل', value: 15 },
    { name: 'مفاوضات', value: 10 },
    { name: 'مغلق/مربح', value: 8 },
    { name: 'مغلق/خاسر', value: 7 },
  ];
};

export const getDealsByStage = async () => {
  // Mock data for deals by stage
  return [
    { name: 'اكتشاف', value: 35 },
    { name: 'تأهيل', value: 25 },
    { name: 'اقتراح', value: 20 },
    { name: 'مفاوضات', value: 15 },
    { name: 'مغلق مربح', value: 12 },
    { name: 'مغلق خاسر', value: 8 },
  ];
};

// Fix for issue with first_name and last_name access
export const getTeamPerformanceStats = () => {
  // This is mock data, but in a real implementation would come from Supabase
  return {
    teamMembers: [
      { id: '1', first_name: 'محمد', last_name: 'علي', leads: 23, deals: 8, revenue: 80000 },
      { id: '2', first_name: 'أحمد', last_name: 'خالد', leads: 18, deals: 6, revenue: 62000 },
      { id: '3', first_name: 'ليلى', last_name: 'عبدالله', leads: 22, deals: 7, revenue: 72000 },
      { id: '4', first_name: 'فاطمة', last_name: 'محمد', leads: 15, deals: 4, revenue: 45000 },
    ]
  };
};

// Fix for the array access issues in the dashboard service
export const formatTeamMemberName = (member: any) => {
  return member && member.first_name && member.last_name ? `${member.first_name} ${member.last_name}` : 'غير معروف';
};
