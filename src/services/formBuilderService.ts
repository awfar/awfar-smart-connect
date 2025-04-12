
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

  // Map database column names to our TypeScript interface properties
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    type: item.type as PropertyType,
    isActive: item.isactive,
    submitButtonText: item.submitbuttontext,
    successMessage: item.successmessage,
    redirectUrl: item.redirecturl,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
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
    .eq('formid', formId)
    .order('order', { ascending: true });
  
  if (fieldsError) {
    console.error('Error fetching form fields:', fieldsError);
    return {
      id: form.id,
      name: form.name,
      description: form.description,
      type: form.type as PropertyType,
      isActive: form.isactive,
      submitButtonText: form.submitbuttontext,
      successMessage: form.successmessage,
      redirectUrl: form.redirecturl,
      created_at: form.created_at,
      updated_at: form.updated_at,
      fields: []
    };
  }

  // Map database column names to our TypeScript interface properties
  const mappedFields = fields.map(field => ({
    id: field.id,
    propertyId: field.propertyid,
    formId: field.formid,
    order: field.order,
    isRequired: field.isrequired,
    isVisible: field.isvisible
  }));

  return {
    id: form.id,
    name: form.name,
    description: form.description,
    type: form.type as PropertyType,
    isActive: form.isactive,
    submitButtonText: form.submitbuttontext,
    successMessage: form.successmessage,
    redirectUrl: form.redirecturl,
    created_at: form.created_at,
    updated_at: form.updated_at,
    fields: mappedFields
  };
};

// Create a new form
export const createForm = async (form: Omit<Form, 'id' | 'created_at' | 'updated_at'>, fields?: Omit<FormField, 'id' | 'formId'>[]) => {
  // Convert our TypeScript interface properties to database column names
  const dbForm = {
    name: form.name,
    description: form.description,
    type: form.type,
    isactive: form.isActive,
    submitbuttontext: form.submitButtonText,
    successmessage: form.successMessage,
    redirecturl: form.redirectUrl
  };
  
  const { data: formData, error: formError } = await supabase
    .from('forms')
    .insert([dbForm])
    .select();
  
  if (formError || !formData) {
    console.error('Error creating form:', formError);
    throw formError;
  }
  
  const newForm = {
    id: formData[0].id,
    name: formData[0].name,
    description: formData[0].description,
    type: formData[0].type as PropertyType,
    isActive: formData[0].isactive,
    submitButtonText: formData[0].submitbuttontext,
    successMessage: formData[0].successmessage,
    redirectUrl: formData[0].redirecturl,
    created_at: formData[0].created_at,
    updated_at: formData[0].updated_at
  };
  
  if (fields && fields.length > 0) {
    const formattedFields = fields.map(field => ({
      formid: newForm.id,
      propertyid: field.propertyId,
      order: field.order,
      isrequired: field.isRequired,
      isvisible: field.isVisible
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
  // Convert our TypeScript interface properties to database column names
  const dbForm: any = {};
  
  if (form.name !== undefined) dbForm.name = form.name;
  if (form.description !== undefined) dbForm.description = form.description;
  if (form.type !== undefined) dbForm.type = form.type;
  if (form.isActive !== undefined) dbForm.isactive = form.isActive;
  if (form.submitButtonText !== undefined) dbForm.submitbuttontext = form.submitButtonText;
  if (form.successMessage !== undefined) dbForm.successmessage = form.successMessage;
  if (form.redirectUrl !== undefined) dbForm.redirecturl = form.redirectUrl;
  
  const { data: formData, error: formError } = await supabase
    .from('forms')
    .update(dbForm)
    .eq('id', formId)
    .select();
  
  if (formError) {
    console.error('Error updating form:', formError);
    throw formError;
  }

  let updatedForm: Form = {
    id: formData[0].id,
    name: formData[0].name,
    description: formData[0].description,
    type: formData[0].type as PropertyType,
    isActive: formData[0].isactive,
    submitButtonText: formData[0].submitbuttontext,
    successMessage: formData[0].successmessage,
    redirectUrl: formData[0].redirecturl,
    created_at: formData[0].created_at,
    updated_at: formData[0].updated_at
  };
  
  if (fields && fields.length > 0) {
    // First delete existing fields
    const { error: deleteError } = await supabase
      .from('form_fields')
      .delete()
      .eq('formid', formId);
    
    if (deleteError) {
      console.error('Error deleting existing form fields:', deleteError);
      throw deleteError;
    }
    
    // Insert the new fields
    const formattedFields = fields.map(field => ({
      formid: formId,
      propertyid: field.propertyId,
      order: field.order,
      isrequired: field.isRequired,
      isvisible: field.isVisible
    }));
    
    const { error: fieldsError } = await supabase
      .from('form_fields')
      .insert(formattedFields);
    
    if (fieldsError) {
      console.error('Error updating form fields:', fieldsError);
      throw fieldsError;
    }
  }
  
  return updatedForm;
};

// Delete a form and its fields
export const deleteForm = async (formId: string) => {
  // Delete fields first (due to foreign key constraints)
  const { error: fieldsError } = await supabase
    .from('form_fields')
    .delete()
    .eq('formid', formId);
  
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
  const { data: formData, error: formError } = await supabase
    .from('forms')
    .select('type')
    .eq('id', formId)
    .single();
  
  if (formError || !formData) {
    console.error('Error fetching form type:', formError);
    throw formError;
  }
  
  const tableName = formData.type + 's'; // Append 's' to make it plural (e.g., lead -> leads)
  
  // Insert data into the appropriate table based on form type
  const { data: result, error } = await supabase
    .from(tableName)
    .insert([data])
    .select();
  
  if (error) {
    console.error(`Error submitting ${formData.type} data:`, error);
    throw error;
  }
  
  return result?.[0];
};
