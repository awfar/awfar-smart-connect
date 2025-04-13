
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  conversionRate: string;
  totalRevenue: number;
  // Add the missing properties
  totalSales: string;
  salesChange: string;
  newLeads: string;
  leadsChange: string;
  conversionChange: string;
  activeTickets: string;
  ticketsChange: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string | null;
    initials: string;
  };
  entity?: {
    type: string;
    name: string;
    id: string;
  };
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total leads count
    const { count: totalLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    if (leadsError) throw leadsError;

    // Get new leads created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: newLeadsToday, error: todayLeadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    
    if (todayLeadsError) throw todayLeadsError;

    // For demo purposes, we'll calculate simulated values
    const conversionRate = totalLeads > 0 ? Math.round((Math.random() * 30) + 10) + '%' : '0%';
    const totalRevenue = totalLeads * Math.round((Math.random() * 1000) + 500);
    
    // Generate mock data for the additional stats fields
    const totalSales = Math.round(totalRevenue).toLocaleString() + ' SAR';
    const salesChange = '+' + Math.round(Math.random() * 15) + '%';
    const newLeads = (newLeadsToday || Math.round(Math.random() * 20) + 5).toString();
    const leadsChange = '+' + Math.round(Math.random() * 20) + '%';
    const conversionChange = '+' + Math.round(Math.random() * 10) + '%';
    const activeTickets = Math.round(Math.random() * 15 + 3).toString();
    const ticketsChange = Math.random() > 0.5 ? '+' : '-' + Math.round(Math.random() * 15) + '%';

    return {
      totalLeads: totalLeads || 0,
      newLeadsToday: newLeadsToday || 0,
      conversionRate,
      totalRevenue,
      // Add the additional fields
      totalSales,
      salesChange,
      newLeads,
      leadsChange,
      conversionChange,
      activeTickets,
      ticketsChange
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalLeads: 0,
      newLeadsToday: 0,
      conversionRate: '0%',
      totalRevenue: 0,
      // Default values for the additional fields
      totalSales: '0 SAR',
      salesChange: '+0%',
      newLeads: '0',
      leadsChange: '+0%',
      conversionChange: '+0%',
      activeTickets: '0',
      ticketsChange: '+0%'
    };
  }
};

export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const { data: leadActivities, error: activitiesError } = await supabase
      .from('lead_activities')
      .select(`
        id,
        type,
        description,
        created_at,
        lead_id,
        created_by,
        leads!inner(first_name, last_name),
        profiles!inner(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (activitiesError) throw activitiesError;

    return (leadActivities || []).map(activity => {
      const profileName = `${activity.profiles?.first_name || ''} ${activity.profiles?.last_name || ''}`.trim();
      const leadName = `${activity.leads?.first_name || ''} ${activity.leads?.last_name || ''}`.trim();
      
      const initials = (activity.profiles?.first_name?.[0] || '') + (activity.profiles?.last_name?.[0] || '');
      
      return {
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: activity.created_at,
        user: {
          name: profileName,
          avatar: null,
          initials: initials || 'مس' // Default initials in Arabic
        },
        entity: {
          type: 'lead',
          name: leadName || 'عميل محتمل', // Default in Arabic
          id: activity.lead_id
        }
      };
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    
    // Return mock data in case of error
    return [
      {
        id: "act-001",
        type: "اتصال",
        description: "تم إجراء مكالمة مع العميل بخصوص العرض الجديد",
        timestamp: new Date().toISOString(),
        user: {
          name: "أحمد محمد",
          avatar: "/placeholder.svg",
          initials: "أم"
        },
        entity: {
          type: "lead",
          name: "محمد سعيد",
          id: "lead-001"
        }
      },
      {
        id: "act-002",
        type: "ملاحظة",
        description: "تم إضافة ملاحظة بخصوص طلب العميل",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: {
          name: "سارة أحمد",
          avatar: "/placeholder.svg",
          initials: "سأ"
        },
        entity: {
          type: "lead",
          name: "ليلى حسن",
          id: "lead-002"
        }
      }
    ];
  }
};
