
import { logActivity } from "../../loggingService";
import { Invoice, InvoiceItem } from './types';
import { createInvoice } from './crud';

// Generate an invoice for a subscription
export const generateInvoiceForSubscription = async (
  subscriptionId: string, 
  customerId: string, 
  customerName: string, 
  items: InvoiceItem[], 
  dueDate: string
): Promise<Invoice> => {
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
export const logInvoiceAction = async (
  invoiceId: string, 
  action: string, 
  userId: string, 
  details?: string
): Promise<void> => {
  try {
    await logActivity('invoice', invoiceId, action, userId, details);
    console.log(`Logged action: ${action} on invoice ${invoiceId}`);
  } catch (err) {
    console.error("Error logging invoice action:", err);
  }
};
