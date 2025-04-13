
import { supabase } from "@/integrations/supabase/client";
import { ProductType } from "./utils";

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
  
  if (product.name !== undefined) updateData.name = product.name;
  if (product.description !== undefined) updateData.description = product.description;
  if (product.price !== undefined) updateData.price = product.price;
  if (product.type !== undefined) updateData.type = product.type;
  if (product.sku !== undefined) updateData.sku = product.sku;
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
