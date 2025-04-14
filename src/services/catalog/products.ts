
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id?: string;
  sku: string;
  type: string;
  inventory?: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error('فشل في جلب المنتجات');
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    toast.error('فشل في جلب المنتج');
    return null;
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('تم إضافة المنتج بنجاح');
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    toast.error('فشل في إضافة المنتج');
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('تم تحديث المنتج بنجاح');
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error('فشل في تحديث المنتج');
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('تم حذف المنتج بنجاح');
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error('فشل في حذف المنتج');
    return false;
  }
};
