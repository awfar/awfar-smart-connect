
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error('فشل في جلب التصنيفات');
    return [];
  }
};

export const fetchCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    toast.error('فشل في جلب التصنيف');
    return null;
  }
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('تم إضافة التصنيف بنجاح');
    return data;
  } catch (error) {
    console.error("Error creating category:", error);
    toast.error('فشل في إضافة التصنيف');
    return null;
  }
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('تم تحديث التصنيف بنجاح');
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    toast.error('فشل في تحديث التصنيف');
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('تم حذف التصنيف بنجاح');
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error('فشل في حذف التصنيف');
    return false;
  }
};
