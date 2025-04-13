
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

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
