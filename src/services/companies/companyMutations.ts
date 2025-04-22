
import { supabase } from "@/integrations/supabase/client";
import { Company } from "./companyTypes";
import { toast } from "sonner";
import { transformCompanyData } from "./companyUtils";

export const createCompany = async (company: Omit<Company, "id">): Promise<Company> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: company.name,
        industry: company.industry || "",
        type: company.type || "customer",
        country: company.country || "",
        phone: company.phone || "",
        website: company.website || "",
        address: company.address || "",
        status: company.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("تم إضافة الشركة بنجاح");
    return transformCompanyData(data);
  } catch (error) {
    console.error("Error creating company:", error);
    toast.error("فشل في إضافة الشركة");
    throw error;
  }
};

export const updateCompany = async (company: Company): Promise<Company> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update({
        name: company.name,
        industry: company.industry || "",
        type: company.type || "customer",
        country: company.country || "",
        phone: company.phone || "",
        website: company.website || "",
        address: company.address || "",
        status: company.status || "active",
        updated_at: new Date().toISOString()
      })
      .eq('id', company.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("تم تحديث بيانات الشركة بنجاح");
    return transformCompanyData(data);
  } catch (error) {
    console.error("Error updating company:", error);
    toast.error("فشل في تحديث بيانات الشركة");
    throw error;
  }
};

export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success("تم حذف الشركة بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting company:", error);
    toast.error("فشل في حذف الشركة");
    throw error;
  }
};
