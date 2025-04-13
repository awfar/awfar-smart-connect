
import { InvoiceItem } from './types';

// Helper function to parse invoice items
export function parseInvoiceItems(items: any): InvoiceItem[] {
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
export function calculateInvoiceAnalytics(invoices: any[]): {
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
