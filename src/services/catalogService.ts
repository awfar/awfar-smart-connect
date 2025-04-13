import { supabase } from "@/integrations/supabase/client";
import { LucideIcon, Package, FileDigit, BarChart2, Store } from 'lucide-react';

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

// Type-specific icon mappings using LucideIcon type
export const productTypeIconMap: Record<ProductType, LucideIcon> = {
  physical: Package,
  digital: FileDigit,
  service: BarChart2,
  subscription: Store
};

// Type-specific labels
export const productTypeLabels: Record<ProductType, string> = {
  physical: 'منتج مادي',
  digital: 'منتج رقمي',
  service: 'خدمة',
  subscription: 'اشتراك'
};

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

// Products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  
  // Transform the data to match our interface
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    type: item.type as ProductType,
    sku: item.sku,
    isActive: item.is_active,
    imageUrl: item.image_url,
    inventory: item.inventory,
    categoryId: item.category_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    type: data.type as ProductType,
    sku: data.sku,
    isActive: data.is_active,
    imageUrl: data.image_url,
    inventory: data.inventory,
    categoryId: data.category_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: product.name,
      description: product.description,
      price: product.price,
      type: product.type,
      sku: product.sku,
      is_active: product.isActive,
      image_url: product.imageUrl,
      inventory: product.inventory,
      category_id: product.categoryId
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    type: data.type as ProductType,
    sku: data.sku,
    isActive: data.is_active,
    imageUrl: data.image_url,
    inventory: data.inventory,
    categoryId: data.category_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
  const updateData: any = {};
  
  if (product.name) updateData.name = product.name;
  if (product.description) updateData.description = product.description;
  if (product.price !== undefined) updateData.price = product.price;
  if (product.type) updateData.type = product.type;
  if (product.sku) updateData.sku = product.sku;
  if (product.isActive !== undefined) updateData.is_active = product.isActive;
  if (product.imageUrl !== undefined) updateData.image_url = product.imageUrl;
  if (product.inventory !== undefined) updateData.inventory = product.inventory;
  if (product.categoryId !== undefined) updateData.category_id = product.categoryId;
  
  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    type: data.type as ProductType,
    sku: data.sku,
    isActive: data.is_active,
    imageUrl: data.image_url,
    inventory: data.inventory,
    categoryId: data.category_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    parentId: item.parent_id
  }));
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{
      name: category.name,
      description: category.description,
      parent_id: category.parentId
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    parentId: data.parent_id
  };
};

// Subscriptions
export const getSubscriptions = async (): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*');
  
  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    billingCycle: item.billing_cycle,
    features: Array.isArray(item.features) ? item.features : [],
    isActive: item.is_active
  }));
};

export const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    billingCycle: data.billing_cycle,
    features: Array.isArray(data.features) ? data.features : [],
    isActive: data.is_active
  };
};

export const createSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      billing_cycle: subscription.billingCycle,
      features: subscription.features,
      is_active: subscription.isActive
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    billingCycle: data.billing_cycle,
    features: Array.isArray(data.features) ? data.features : [],
    isActive: data.is_active
  };
};

export const updateSubscription = async (id: string, subscription: Partial<Omit<Subscription, 'id'>>): Promise<Subscription> => {
  const updateData: any = {};
  
  if (subscription.name) updateData.name = subscription.name;
  if (subscription.description) updateData.description = subscription.description;
  if (subscription.price !== undefined) updateData.price = subscription.price;
  if (subscription.billingCycle) updateData.billing_cycle = subscription.billingCycle;
  if (subscription.features) updateData.features = subscription.features;
  if (subscription.isActive !== undefined) updateData.is_active = subscription.isActive;
  
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    billingCycle: data.billing_cycle,
    features: Array.isArray(data.features) ? data.features : [],
    isActive: data.is_active
  };
};

// Packages
export const getPackages = async (): Promise<Package[]> => {
  const { data, error } = await supabase
    .from('packages')
    .select('*');
  
  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    products: Array.isArray(item.products) ? item.products : [],
    isActive: item.is_active
  }));
};

export const getPackageById = async (id: string): Promise<Package | null> => {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    products: Array.isArray(data.products) ? data.products : [],
    isActive: data.is_active
  };
};

export const createPackage = async (pkg: Omit<Package, 'id'>): Promise<Package> => {
  const { data, error } = await supabase
    .from('packages')
    .insert([{
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      products: pkg.products,
      is_active: pkg.isActive
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    products: Array.isArray(data.products) ? data.products : [],
    isActive: data.is_active
  };
};

export const updatePackage = async (id: string, pkg: Partial<Omit<Package, 'id'>>): Promise<Package> => {
  const updateData: any = {};
  
  if (pkg.name) updateData.name = pkg.name;
  if (pkg.description) updateData.description = pkg.description;
  if (pkg.price !== undefined) updateData.price = pkg.price;
  if (pkg.products) updateData.products = pkg.products;
  if (pkg.isActive !== undefined) updateData.is_active = pkg.isActive;
  
  const { data, error } = await supabase
    .from('packages')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    products: Array.isArray(data.products) ? data.products : [],
    isActive: data.is_active
  };
};

// Invoices (keeping mock data for now, can implement Supabase connection later)
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
