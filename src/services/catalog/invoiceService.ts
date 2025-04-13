
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  subscriptionId?: string;
  packageId?: string;
  notes?: string;
}

// Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  // First try to get data from Supabase
  try {
    const { data, error } = await supabase
      .rpc('get_all_invoices')
      .catch(() => {
        return supabase
          .from('invoices')
          .select('*');
      });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        customerId: item.customer_id,
        customerName: item.customer_name,
        // Parse items from JSON if needed
        items: parseInvoiceItems(item.items),
        totalAmount: item.total_amount,
        status: item.status as Invoice['status'],
        dueDate: item.due_date,
        issueDate: item.issue_date,
        paidDate: item.paid_date,
        subscriptionId: item.subscription_id,
        packageId: item.package_id,
        notes: item.notes
      }));
    }
  } catch (err) {
    console.error("Error fetching invoices from database:", err);
  }
  
  // Fall back to mock data if database fetch fails or returns no results
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      customerId: '101',
      customerName: 'شركة الأفق',
      items: [
        { productId: '1', productName: 'خدمة استشارات تسويقية', quantity: 1, unitPrice: 500, totalPrice: 500 }
      ],
      totalAmount: 500,
      status: 'paid',
      dueDate: '2025-04-30',
      issueDate: '2025-04-01',
      paidDate: '2025-04-10'
    },
    {
      id: '2',
      customerId: '102',
      customerName: 'مؤسسة المستقبل',
      items: [
        { productId: '2', productName: 'باقة التواصل الاجتماعي الأساسية', quantity: 1, unitPrice: 300, totalPrice: 300 },
        { productId: '3', productName: 'كتاب استراتيجيات التسويق الرقمي', quantity: 2, unitPrice: 100, totalPrice: 200 }
      ],
      totalAmount: 500,
      status: 'sent',
      dueDate: '2025-05-15',
      issueDate: '2025-04-15'
    },
  ];
  return mockInvoices;
};

// Get invoice by ID
export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  try {
    // First try to get from Supabase
    const { data, error } = await supabase
      .rpc('get_invoice_by_id', { p_invoice_id: id })
      .catch(() => {
        return supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .single();
      });
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    
    if (data) {
      return {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        // Parse items from JSON if needed
        items: parseInvoiceItems(data.items),
        totalAmount: data.total_amount,
        status: data.status as Invoice['status'],
        dueDate: data.due_date,
        issueDate: data.issue_date,
        paidDate: data.paid_date,
        subscriptionId: data.subscription_id,
        packageId: data.package_id,
        notes: data.notes
      };
    }
  } catch (err) {
    console.error("Error fetching invoice from database:", err);
  }
  
  // Fall back to mock data
  return (await getInvoices()).find(i => i.id === id) || null;
};

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
  try {
    // Convert InvoiceItems to JSON compatible format
    const jsonItems = JSON.stringify(invoice.items);
    
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        customer_id: invoice.customerId,
        customer_name: invoice.customerName,
        items: jsonItems,
        total_amount: invoice.totalAmount,
        status: invoice.status,
        due_date: invoice.dueDate,
        issue_date: invoice.issueDate,
        paid_date: invoice.paidDate,
        subscription_id: invoice.subscriptionId,
        package_id: invoice.packageId,
        notes: invoice.notes
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer_name,
      items: parseInvoiceItems(data.items),
      totalAmount: data.total_amount,
      status: data.status as Invoice['status'],
      dueDate: data.due_date,
      issueDate: data.issue_date,
      paidDate: data.paid_date,
      subscriptionId: data.subscription_id,
      packageId: data.package_id,
      notes: data.notes
    };
  } catch (err) {
    console.error("Error creating invoice:", err);
    throw new Error("Failed to create invoice");
  }
};

// Update invoice status
export const updateInvoiceStatus = async (id: string, status: Invoice['status'], paidDate?: string): Promise<Invoice> => {
  try {
    const updateData: any = { status };
    if (status === 'paid' && paidDate) {
      updateData.paid_date = paidDate;
    }
    
    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer_name,
      items: parseInvoiceItems(data.items),
      totalAmount: data.total_amount,
      status: data.status as Invoice['status'],
      dueDate: data.due_date,
      issueDate: data.issue_date,
      paidDate: data.paid_date,
      subscriptionId: data.subscription_id,
      packageId: data.package_id,
      notes: data.notes
    };
  } catch (err) {
    console.error("Error updating invoice status:", err);
    throw new Error("Failed to update invoice status");
  }
};

// Generate an invoice for a subscription
export const generateInvoiceForSubscription = async (subscriptionId: string, customerId: string, customerName: string, items: InvoiceItem[], dueDate: string): Promise<Invoice> => {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const today = new Date().toISOString().split('T')[0];
  
  return createInvoice({
    customerId,
    customerName,
    items,
    totalAmount,
    status: 'draft',
    dueDate,
    issueDate: today,
    subscriptionId
  });
};

// Log action performed on invoice
export const logInvoiceAction = async (invoiceId: string, action: string, userId: string, details?: string): Promise<void> => {
  try {
    await supabase.rpc('log_invoice_action', {
      p_invoice_id: invoiceId,
      p_action: action,
      p_user_id: userId,
      p_details: details
    }).catch(async () => {
      // Fallback to direct logging if RPC is not available
      await logActivity('invoice', invoiceId, action, userId, details);
    });
    
    console.log(`Logged action: ${action} on invoice ${invoiceId}`);
  } catch (err) {
    console.error("Error logging invoice action:", err);
  }
};

// Get invoice analytics
export const getInvoiceAnalytics = async (): Promise<{
  totalCount: number;
  paidAmount: number;
  overdueAmount: number;
  monthlyRevenue: { month: string; amount: number }[];
}> => {
  try {
    const { data, error } = await supabase.rpc('get_invoice_analytics')
      .catch(() => {
        // If RPC fails, try to get data directly
        return supabase.from('invoices').select('*');
      });
    
    if (error) throw error;
    
    if (data) {
      if ('totalCount' in data) {
        // RPC returned formatted data
        return data as any;
      } else if (Array.isArray(data)) {
        // Calculate analytics from raw data
        return calculateInvoiceAnalytics(data);
      }
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

// Helper function to parse invoice items
function parseInvoiceItems(items: any): InvoiceItem[] {
  if (!items) return [];
  
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch (e) {
      console.error("Failed to parse invoice items:", e);
      return [];
    }
  }
  
  if (!Array.isArray(items)) {
    return [];
  }
  
  return items.map(item => ({
    productId: item.productId || '',
    productName: item.productName || '',
    quantity: Number(item.quantity) || 0,
    unitPrice: Number(item.unitPrice) || 0,
    totalPrice: Number(item.totalPrice) || 0
  }));
}

// Helper function to calculate invoice analytics
function calculateInvoiceAnalytics(invoices: any[]): {
  totalCount: number;
  paidAmount: number;
  overdueAmount: number;
  monthlyRevenue: { month: string; amount: number }[];
} {
  const totalCount = invoices.length;
  
  // Calculate paid amount
  const paidAmount = invoices
    .filter((inv: any) => inv.status === 'paid')
    .reduce((sum: number, inv: any) => sum + (Number(inv.total_amount) || 0), 0);
  
  // Calculate overdue amount
  const overdueAmount = invoices
    .filter((inv: any) => inv.status === 'overdue')
    .reduce((sum: number, inv: any) => sum + (Number(inv.total_amount) || 0), 0);
  
  // Calculate monthly revenue
  const monthlyData: Record<string, number> = {};
  
  invoices.forEach((inv: any) => {
    if (inv.status === 'paid' && inv.paid_date) {
      const month = inv.paid_date.substring(0, 7); // Format: YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + (Number(inv.total_amount) || 0);
    }
  });
  
  const monthlyRevenue = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount
  })).sort((a, b) => a.month.localeCompare(b.month));
  
  return {
    totalCount,
    paidAmount,
    overdueAmount,
    monthlyRevenue
  };
}
