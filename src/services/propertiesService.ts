
import { supabase } from "@/integrations/supabase/client";

export type PropertyType = 
  | 'lead'
  | 'company'
  | 'contact'
  | 'deal'
  | 'user'
  | 'product'
  | 'invoice';

export type FieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'url';

export interface PropertyOption {
  label: string;
  value: string;
}

export interface Property {
  id: string;
  name: string;
  label: string;
  type: PropertyType;
  fieldType: FieldType;
  description?: string;
  isRequired: boolean;
  isDefault: boolean;
  isSystem: boolean;
  options?: PropertyOption[];
  placeholder?: string;
  defaultValue?: any;
  created_at?: string;
  updated_at?: string;
  order?: number;
  group?: string;
}

export interface PropertyGroup {
  name: string;
  label: string;
  type: PropertyType;
  properties: Property[];
}

// Fetch properties by type
export const fetchPropertiesByType = async (type: PropertyType): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('type', type)
    .order('order', { ascending: true });
  
  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return data as Property[];
};

// Create a new property
export const createProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select();
  
  if (error) {
    console.error('Error creating property:', error);
    throw error;
  }
  
  return data?.[0] as Property;
};

// Update an existing property
export const updateProperty = async (id: string, property: Partial<Property>) => {
  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating property:', error);
    throw error;
  }
  
  return data?.[0] as Property;
};

// Delete a property
export const deleteProperty = async (id: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
  
  return true;
};

// Group properties by their groups
export const groupProperties = (properties: Property[]): PropertyGroup[] => {
  const groups: Record<string, PropertyGroup> = {};
  
  properties.forEach(property => {
    const groupName = property.group || 'default';
    
    if (!groups[groupName]) {
      groups[groupName] = {
        name: groupName,
        label: groupName === 'default' ? 'عام' : groupName,
        type: property.type,
        properties: []
      };
    }
    
    groups[groupName].properties.push(property);
  });
  
  return Object.values(groups);
};
