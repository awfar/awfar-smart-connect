
import { supabase } from "@/integrations/supabase/client";

export type ProductType = 'physical' | 'digital' | 'service' | 'subscription';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ProductType;
  sku: string;
  isActive: boolean;
  imageUrl?: string;
  inventory?: number;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  features: string[];
  isActive: boolean;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  products: string[]; // Array of product IDs
  isActive: boolean;
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

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Mock data for development - Replace with actual API calls in production
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'خدمة استشارات تسويقية',
    description: 'استشارات مخصصة لتطوير استراتيجيات التسويق',
    price: 500,
    type: 'service',
    sku: 'SRV-MKT-001',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'باقة التواصل الاجتماعي الأساسية',
    description: 'إدارة منصات التواصل الاجتماعي لمدة شهر',
    price: 300,
    type: 'subscription',
    sku: 'SUB-SMM-001',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'كتاب استراتيجيات التسويق الرقمي',
    description: 'دليل شامل للتسويق الرقمي',
    price: 100,
    type: 'physical',
    sku: 'PHY-BOK-001',
    isActive: true,
    inventory: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'كورس التسويق عبر البريد الإلكتروني',
    description: 'كورس رقمي لاستراتيجيات التسويق عبر البريد الإلكتروني',
    price: 200,
    type: 'digital',
    sku: 'DIG-CRS-001',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'خدمات' },
  { id: '2', name: 'منتجات رقمية' },
  { id: '3', name: 'منتجات مادية' },
  { id: '4', name: 'اشتراكات' },
];

const mockSubscriptions: Subscription[] = [
  { 
    id: '1', 
    name: 'باقة أساسية', 
    description: 'باقة شهرية أساسية', 
    price: 99, 
    billingCycle: 'monthly',
    features: ['ميزة 1', 'ميزة 2', 'ميزة 3'],
    isActive: true 
  },
  { 
    id: '2', 
    name: 'باقة متقدمة', 
    description: 'باقة شهرية متقدمة', 
    price: 199, 
    billingCycle: 'monthly',
    features: ['كل مميزات الباقة الأساسية', 'ميزة 4', 'ميزة 5', 'ميزة 6'],
    isActive: true 
  },
];

const mockPackages: Package[] = [
  { 
    id: '1', 
    name: 'حزمة الأعمال الصغيرة', 
    description: 'حزمة مثالية للشركات الصغيرة', 
    price: 800, 
    products: ['1', '2'], 
    isActive: true 
  },
  { 
    id: '2', 
    name: 'حزمة الشركات', 
    description: 'حزمة متكاملة للشركات المتوسطة', 
    price: 1500, 
    products: ['1', '2', '3', '4'], 
    isActive: true 
  },
];

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

// Products
export const getProducts = async (): Promise<Product[]> => {
  // Placeholder for future Supabase implementation
  // const { data, error } = await supabase.from('products').select('*');
  // if (error) throw error;
  // return data;
  return mockProducts;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  // Placeholder for future Supabase implementation
  // const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  // if (error) throw error;
  // return data;
  return mockProducts.find(p => p.id === id) || null;
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  // Placeholder for future Supabase implementation
  // const { data, error } = await supabase.from('products').insert([product]).select().single();
  // if (error) throw error;
  // return data;
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProducts.push(newProduct);
  return newProduct;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  // Placeholder for future Supabase implementation
  return mockCategories;
};

// Subscriptions
export const getSubscriptions = async (): Promise<Subscription[]> => {
  // Placeholder for future Supabase implementation
  return mockSubscriptions;
};

// Packages
export const getPackages = async (): Promise<Package[]> => {
  // Placeholder for future Supabase implementation
  return mockPackages;
};

// Invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  // Placeholder for future Supabase implementation
  return mockInvoices;
};

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  // Placeholder for future Supabase implementation
  return mockInvoices.find(i => i.id === id) || null;
};
