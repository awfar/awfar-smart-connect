
import { supabase } from "@/integrations/supabase/client";
import { calculateInvoiceAnalytics } from './utils';

// Get invoice analytics
export const getInvoiceAnalytics = async (): Promise<{
  totalCount: number;
  paidAmount: number;
  overdueAmount: number;
  monthlyRevenue: { month: string; amount: number }[];
}> => {
  try {
    // Get all invoices for analysis
    const { data, error } = await supabase
      .from('invoices')
      .select('*');
    
    if (error) throw error;
    
    if (data && Array.isArray(data)) {
      // Calculate analytics from data
      return calculateInvoiceAnalytics(data);
    }
    
    return {
      totalCount: 0,
      paidAmount: 0,
      overdueAmount: 0,
      monthlyRevenue: []
    };
  } catch (err) {
    console.error("Error getting invoice analytics:", err);
    return {
      totalCount: 0,
      paidAmount: 0,
      overdueAmount: 0,
      monthlyRevenue: []
    };
  }
};
