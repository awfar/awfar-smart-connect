
import { supabase } from "@/integrations/supabase/client";

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  products: string[]; // Array of product IDs
  isActive: boolean;
}

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
    products: Array.isArray(item.products) ? item.products.map(p => String(p)) : [],
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
    products: Array.isArray(data.products) ? data.products.map(p => String(p)) : [],
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
    products: Array.isArray(data.products) ? data.products.map(p => String(p)) : [],
    isActive: data.is_active
  };
};

export const updatePackage = async (id: string, pkg: Partial<Omit<Package, 'id'>>): Promise<Package> => {
  const updateData: any = {};
  
  if (pkg.name !== undefined) updateData.name = pkg.name;
  if (pkg.description !== undefined) updateData.description = pkg.description;
  if (pkg.price !== undefined) updateData.price = pkg.price;
  if (pkg.products !== undefined) updateData.products = pkg.products;
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
    products: Array.isArray(data.products) ? data.products.map(p => String(p)) : [],
    isActive: data.is_active
  };
};
