
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
}

// Mock data for invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  // Mock data for development
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

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  // Using mock data for now
  return (await getInvoices()).find(i => i.id === id) || null;
};
