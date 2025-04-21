// src/services/dashboardService.ts
import { supabase } from "@/integrations/supabase/client";

// Helper function to safely access first_name and last_name
const safeGetName = (obj: any, defaultValue: string = ''): string => {
  if (!obj) return defaultValue;
  
  // Handle array case by taking the first item
  if (Array.isArray(obj)) {
    const firstItem = obj[0];
    if (!firstItem) return defaultValue;
    return `${firstItem.first_name || ''} ${firstItem.last_name || ''}`.trim() || defaultValue;
  }
  
  // Handle object case
  return `${obj.first_name || ''} ${obj.last_name || ''}`.trim() || defaultValue;
};

export const fetchDashboardData = async () => {
  try {
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, first_name, last_name, company, created_at, status, owner:assigned_to(first_name, last_name)');

    if (leadsError) {
      console.error("Error fetching leads:", leadsError);
      throw leadsError;
    }

    const { data: salesPeople, error: salesPeopleError } = await supabase
      .from('sales_people')
      .select('id, first_name, last_name, deals, value, conversion');

    if (salesPeopleError) {
      console.error("Error fetching sales people:", salesPeopleError);
      throw salesPeopleError;
    }

    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('id, type, description, due_date, completed');

    if (activitiesError) {
      console.error("Error fetching activities:", activitiesError);
      throw activitiesError;
    }

    return {
      leads,
      salesPeople,
      activities,
    };
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    throw new Error(error.message || "Failed to fetch dashboard data");
  }
};

// Fix the problematic parts in the code
export const transformDashboardData = (rawData: any) => {
  const totalLeads = rawData.leads?.length || 0;
  const recentActivities = rawData.activities?.slice(0, 5).map((activity: any) => ({
    id: activity.id,
    type: activity.type || 'Unknown',
    description: activity.description || 'N/A',
    dueDate: activity.due_date ? new Date(activity.due_date).toLocaleDateString() : 'N/A',
    completed: activity.completed || false,
  })) || [];
  
  // Replace problematic lines with safe access using the helper
  const recentLeads = rawData.leads?.map((lead: any) => ({
    id: lead.id,
    name: lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 'No Name',
    company: lead.company || 'N/A',
    date: lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'Unknown',
    status: lead.status || 'new',
    owner: safeGetName(lead.owner, 'Unassigned')
  })) || [];
  
  const topSalesPeople = rawData.salesPeople?.map((person: any) => ({
    id: person.id,
    name: safeGetName(person, `User ${person.id}`),
    deals: person.deals || 0,
    value: person.value || 0,
    conversion: person.conversion || 0
  })) || [];

  return {
    totalLeads,
    recentActivities,
    recentLeads,
    topSalesPeople
  };
};
