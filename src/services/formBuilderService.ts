
import { supabase } from "@/integrations/supabase/client";
import { PropertyType } from "./propertiesService";

export interface FormField {
  id: string;
  propertyId: string;
  formId: string;
  order: number;
  isRequired: boolean;
  isVisible: boolean;
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  type: PropertyType;
  isActive: boolean;
  submitButtonText?: string;
  successMessage?: string;
  redirectUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FormWithFields extends Form {
  fields: FormField[];
}

// Fetch all forms
export const fetchForms = async (): Promise<Form[]> => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching forms:', error);
    return [];
  }

  return data;
};

// Fetch a single form with its fields
export const fetchFormWithFields = async (formId: string): Promise<FormWithFields | null> => {
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single();
  
  if (formError) {
    console.error('Error fetching form:', formError);
    return null;
  }

  const { data: fields, error: fieldsError } = await supabase
    .from('form_fields')
    .select('*')
    .eq('formId', formId)
    .order('order', { ascending: true });
  
  if (fieldsError) {
    console.error('Error fetching form fields:', fieldsError);
    return {
      ...form,
      fields: []
    };
  }

  return {
    ...form,
    fields: fields
  };
};

// Create a new form
export const createForm = async (form: Omit<Form, 'id' | 'created_at' | 'updated_at'>, fields?: Omit<FormField, 'id' | 'formId'>[]) => {
  const { data: formData, error: formError } = await supabase
    .from('forms')
    .insert([form])
    .select();
  
  if (formError || !formData) {
    console.error('Error creating form:', formError);
    throw formError;
  }
  
  const newForm = formData[0];
  
  if (fields && fields.length > 0) {
    const formattedFields = fields.map(field => ({
      ...field,
      formId: newForm.id
    }));
    
    const { error: fieldsError } = await supabase
      .from('form_fields')
      .insert(formattedFields);
    
    if (fieldsError) {
      console.error('Error creating form fields:', fieldsError);
      throw fieldsError;
    }
  }
  
  return newForm;
};

// Update an existing form
export const updateForm = async (formId: string, form: Partial<Form>, fields?: FormField[]) => {
  const { data: formData, error: formError } = await supabase
    .from('forms')
    .update(form)
    .eq('id', formId)
    .select();
  
  if (formError) {
    console.error('Error updating form:', formError);
    throw formError;
  }
  
  if (fields && fields.length > 0) {
    // First delete existing fields
    const { error: deleteError } = await supabase
      .from('form_fields')
      .delete()
      .eq('formId', formId);
    
    if (deleteError) {
      console.error('Error deleting existing form fields:', deleteError);
      throw deleteError;
    }
    
    // Insert the new fields
    const { error: fieldsError } = await supabase
      .from('form_fields')
      .insert(fields.map(field => ({
        ...field,
        formId: formId
      })));
    
    if (fieldsError) {
      console.error('Error updating form fields:', fieldsError);
      throw fieldsError;
    }
  }
  
  return formData?.[0];
};

// Delete a form and its fields
export const deleteForm = async (formId: string) => {
  // Delete fields first (due to foreign key constraints)
  const { error: fieldsError } = await supabase
    .from('form_fields')
    .delete()
    .eq('formId', formId);
  
  if (fieldsError) {
    console.error('Error deleting form fields:', fieldsError);
    throw fieldsError;
  }
  
  // Then delete the form
  const { error: formError } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId);
  
  if (formError) {
    console.error('Error deleting form:', formError);
    throw formError;
  }
  
  return true;
};

// Submit form data
export const submitFormData = async (formId: string, data: Record<string, any>) => {
  // Get form type
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('type')
    .eq('id', formId)
    .single();
  
  if (formError || !form) {
    console.error('Error fetching form type:', formError);
    throw formError;
  }
  
  // Insert data into the appropriate table based on form type
  const { data: result, error } = await supabase
    .from(form.type + 's') // Append 's' to make it plural (e.g., lead -> leads)
    .insert([data])
    .select();
  
  if (error) {
    console.error(`Error submitting ${form.type} data:`, error);
    throw error;
  }
  
  return result?.[0];
};
