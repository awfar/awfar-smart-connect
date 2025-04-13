
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from './types';
import { parseInvoiceItems } from './utils';
import { logActivity } from "../../loggingService";

// Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  // First try to get data from Supabase
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        customerId: item.customer_id,
        customerName: item.customer_name,
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
    
    // Log the activity
    await logActivity(
      'invoice',
      data.id,
      'create',
      'system',
      `تم إنشاء فاتورة جديدة للعميل ${invoice.customerName}`
    );
    
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
    
    // Log the activity
    await logActivity(
      'invoice',
      id,
      'update_status',
      'system',
      `تم تغيير حالة الفاتورة إلى ${status}`
    );
    
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
