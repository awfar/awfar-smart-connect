
import { supabase } from "@/integrations/supabase/client";
import { LucideIcon, Package, FileDigit, BarChart2, Store } from 'lucide-react';

export type ProductType = 'physical' | 'digital' | 'service' | 'subscription';

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

export type BillingCycle = 'monthly' | 'quarterly' | 'annually';
