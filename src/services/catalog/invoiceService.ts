
import { supabase } from "@/integrations/supabase/client";

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
      .from('invoices')
      .select('*');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        customerId: item.customer_id,
        customerName: item.customer_name,
        items: item.items || [],
        totalAmount: item.total_amount,
        status: item.status,
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
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    
    if (data) {
      return {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        items: data.items || [],
        totalAmount: data.total_amount,
        status: data.status,
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
    const { data, error } = await supabase
      .from('invoices')
      .insert([{
        customer_id: invoice.customerId,
        customer_name: invoice.customerName,
        items: invoice.items,
        total_amount: invoice.totalAmount,
        status: invoice.status,
        due_date: invoice.dueDate,
        issue_date: invoice.issueDate,
        paid_date: invoice.paidDate,
        subscription_id: invoice.subscriptionId,
        package_id: invoice.packageId,
        notes: invoice.notes
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer_name,
      items: data.items || [],
      totalAmount: data.total_amount,
      status: data.status,
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
      items: data.items || [],
      totalAmount: data.total_amount,
      status: data.status,
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
