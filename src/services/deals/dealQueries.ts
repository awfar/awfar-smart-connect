
import { supabase } from "@/integrations/supabase/client";
import { Deal, DealDBRow } from "../types/dealTypes";

// Format date strings to proper format
const formatDealDate = (date: string | null) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

// Map DB row to Deal object with necessary transformations
const mapDealFromDB = (deal: DealDBRow): Deal => {
  // Handle owner data
  const owner = deal.profiles ? {
    id: deal.owner_id || '',
    name: [
      deal.profiles.first_name,
      deal.profiles.last_name
    ].filter(Boolean).join(' ') || deal.owner_id || '',
    initials: deal.profiles.first_name?.[0] || deal.profiles.last_name?.[0] || 'U',
    avatar: deal.profiles.avatar_url
  } : undefined;

  return {
    id: deal.id,
    name: deal.name,
    description: deal.description || undefined,
    value: deal.value || undefined,
    stage: deal.stage,
    status: deal.status,
    expected_close_date: deal.expected_close_date ? formatDealDate(deal.expected_close_date) : undefined,
    owner_id: deal.owner_id || undefined,
    owner: owner,
    company_id: deal.company_id || undefined,
    company_name: deal.companies?.name || undefined,
    lead_id: deal.lead_id || undefined,
    lead: deal.leads ? {
      id: deal.lead_id || '',
      first_name: deal.leads.first_name || '',
      last_name: deal.leads.last_name || '',
      email: deal.leads.email || '',
    } : undefined,
    contact_id: deal.contact_id || undefined,
    contact_name: deal.company_contacts?.name || undefined,
    created_at: formatDealDate(deal.created_at || ''),
    updated_at: formatDealDate(deal.updated_at || ''),
  };
};

// Get all deals with optional filters
export const getDeals = async (filters: Record<string, any> = {}): Promise<Deal[]> => {
  try {
    let query = supabase
      .from('deals')
      .select(`
        *,
        profiles:owner_id(*),
        companies:company_id(name),
        company_contacts:contact_id(name),
        leads:lead_id(first_name, last_name, email)
      `);

    // Apply filters
    if (filters.stage && filters.stage !== 'all') {
      query = query.eq('stage', filters.stage);
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.owner_id && filters.owner_id !== 'all') {
      query = query.eq('owner_id', filters.owner_id);
    }

    if (filters.minValue) {
      query = query.gte('value', filters.minValue);
    }

    if (filters.maxValue) {
      query = query.lte('value', filters.maxValue);
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.closeDate) {
      const { fromDate, toDate } = filters.closeDate;
      if (fromDate) {
        query = query.gte('expected_close_date', fromDate);
      }
      if (toDate) {
        query = query.lte('expected_close_date', toDate);
      }
    }

    if (filters.sortBy) {
      const { column, direction } = filters.sortBy;
      query = query.order(column, { ascending: direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching deals:", error);
      throw error;
    }

    return data.map(mapDealFromDB);
  } catch (error) {
    console.error("Error in getDeals:", error);
    throw error;
  }
};

// Get a single deal by ID
export const getDealById = async (id: string): Promise<Deal | null> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        profiles:owner_id(*),
        companies:company_id(name),
        company_contacts:contact_id(name),
        leads:lead_id(first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching deal:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return mapDealFromDB(data);
  } catch (error) {
    console.error("Error in getDealById:", error);
    throw error;
  }
};

// Get available deal stages (for filters, dropdowns, etc.)
export const getDealStages = async (): Promise<string[]> => {
  return ["discovery", "proposal", "negotiation", "closed_won", "closed_lost"];
};

// Get available deal statuses (for filters, dropdowns, etc.)
export const getDealStatuses = async (): Promise<string[]> => {
  return ["active", "won", "lost"];
};

// Get sales team members
export const getSalesTeamMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('is_active', true);
      
    if (error) {
      console.error("Error fetching sales team:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getSalesTeamMembers:", error);
    // Return fallback data for development
    return [
      { id: "user-1", first_name: "أحمد", last_name: "محمد", email: "ahmed@example.com" },
      { id: "user-2", first_name: "سارة", last_name: "خالد", email: "sara@example.com" },
      { id: "user-3", first_name: "محمد", last_name: "علي", email: "mohammed@example.com" },
    ];
  }
};
