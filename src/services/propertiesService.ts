
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

// Type for JSON data from database
type Json = string | number | boolean | { [key: string]: Json } | Json[];

// Fetch properties by type
export const fetchPropertiesByType = async (type: PropertyType): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('type', type)
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    // Map database column names to our TypeScript interface properties
    return data.map(item => ({
      id: item.id,
      name: item.name,
      label: item.label,
      type: item.type as PropertyType,
      fieldType: item.fieldtype as FieldType,
      description: item.description,
      isRequired: item.isrequired,
      isDefault: item.isdefault,
      isSystem: item.issystem,
      options: item.options ? (item.options as unknown as PropertyOption[]) : undefined,
      placeholder: item.placeholder,
      defaultValue: item.defaultvalue,
      created_at: item.created_at,
      updated_at: item.updated_at,
      order: item.order,
      group: item.group
    }));
  } catch (error) {
    console.error('Error in fetchPropertiesByType:', error);
    return [];
  }
};

// Create a new property
export const createProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Convert our TypeScript interface properties to database column names
    const dbProperty = {
      name: property.name,
      label: property.label,
      type: property.type,
      fieldtype: property.fieldType,
      description: property.description,
      isrequired: property.isRequired,
      isdefault: property.isDefault,
      issystem: property.isSystem,
      options: property.options as unknown as Json,
      placeholder: property.placeholder,
      defaultvalue: property.defaultValue,
      group: property.group,
      order: property.order
    };
    
    const { data, error } = await supabase
      .from('properties')
      .insert([dbProperty])
      .select();
    
    if (error) {
      console.error('Error creating property:', error);
      throw error;
    }
    
    // Map database response back to our TypeScript interface
    if (!data || data.length === 0) return null;
    
    return {
      id: data[0].id,
      name: data[0].name,
      label: data[0].label,
      type: data[0].type as PropertyType,
      fieldType: data[0].fieldtype as FieldType,
      description: data[0].description,
      isRequired: data[0].isrequired,
      isDefault: data[0].isdefault,
      isSystem: data[0].issystem,
      options: data[0].options ? (data[0].options as unknown as PropertyOption[]) : undefined,
      placeholder: data[0].placeholder,
      defaultValue: data[0].defaultvalue,
      created_at: data[0].created_at,
      updated_at: data[0].updated_at,
      order: data[0].order,
      group: data[0].group
    } as Property;
  } catch (error) {
    console.error('Error in createProperty:', error);
    throw error;
  }
};

// Update an existing property
export const updateProperty = async (id: string, property: Partial<Property>) => {
  try {
    // Convert our TypeScript interface properties to database column names
    const dbProperty: any = {};
    
    if (property.name !== undefined) dbProperty.name = property.name;
    if (property.label !== undefined) dbProperty.label = property.label;
    if (property.type !== undefined) dbProperty.type = property.type;
    if (property.fieldType !== undefined) dbProperty.fieldtype = property.fieldType;
    if (property.description !== undefined) dbProperty.description = property.description;
    if (property.isRequired !== undefined) dbProperty.isrequired = property.isRequired;
    if (property.isDefault !== undefined) dbProperty.isdefault = property.isDefault;
    if (property.isSystem !== undefined) dbProperty.issystem = property.isSystem;
    if (property.options !== undefined) dbProperty.options = property.options as unknown as Json;
    if (property.placeholder !== undefined) dbProperty.placeholder = property.placeholder;
    if (property.defaultValue !== undefined) dbProperty.defaultvalue = property.defaultValue;
    if (property.group !== undefined) dbProperty.group = property.group;
    if (property.order !== undefined) dbProperty.order = property.order;

    const { data, error } = await supabase
      .from('properties')
      .update(dbProperty)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating property:', error);
      throw error;
    }
    
    // Map database response back to our TypeScript interface
    if (!data || data.length === 0) return null;
    
    return {
      id: data[0].id,
      name: data[0].name,
      label: data[0].label,
      type: data[0].type as PropertyType,
      fieldType: data[0].fieldtype as FieldType,
      description: data[0].description,
      isRequired: data[0].isrequired,
      isDefault: data[0].isdefault,
      isSystem: data[0].issystem,
      options: data[0].options ? (data[0].options as unknown as PropertyOption[]) : undefined,
      placeholder: data[0].placeholder,
      defaultValue: data[0].defaultvalue,
      created_at: data[0].created_at,
      updated_at: data[0].updated_at,
      order: data[0].order,
      group: data[0].group
    } as Property;
  } catch (error) {
    console.error('Error in updateProperty:', error);
    throw error;
  }
};

// Delete a property
export const deleteProperty = async (id: string) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProperty:', error);
    throw error;
  }
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
