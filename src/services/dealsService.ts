
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Deal {
  id: string;
  name: string;
  company_id: string | null;
  contact_id: string | null;
  value: number | null;
  stage: string;
  status: string;
  owner_id: string | null;
  description: string | null;
  expected_close_date: string | null;
  created_at: string;
  updated_at: string;
  company_name?: string; // للعرض
}

export const fetchDeals = async (): Promise<Deal[]> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        companies (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // تنسيق البيانات
    return (data || []).map(deal => ({
      ...deal,
      company_name: deal.companies?.name
    }));
  } catch (error) {
    console.error("خطأ في جلب الصفقات:", error);
    toast.error("فشل في جلب بيانات الصفقات");
    return [];
  }
};

export const fetchDealById = async (id: string): Promise<Deal | null> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        companies (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      company_name: data.companies?.name
    };
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الصفقة:", error);
    toast.error("فشل في جلب تفاصيل الصفقة");
    return null;
  }
};

export const createDeal = async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal | null> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert([{
        ...deal,
        owner_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إنشاء الصفقة بنجاح");
    return data;
  } catch (error) {
    console.error("خطأ في إنشاء الصفقة:", error);
    toast.error("فشل في إنشاء الصفقة");
    return null;
  }
};

export const updateDeal = async (deal: Partial<Deal> & { id: string }): Promise<Deal | null> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .update({
        ...deal,
        updated_at: new Date().toISOString()
      })
      .eq('id', deal.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث الصفقة بنجاح");
    return data;
  } catch (error) {
    console.error("خطأ في تحديث الصفقة:", error);
    toast.error("فشل في تحديث الصفقة");
    return null;
  }
};

export const deleteDeal = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("تم حذف الصفقة بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في حذف الصفقة:", error);
    toast.error("فشل في حذف الصفقة");
    return false;
  }
};

export const filterDeals = async (filters: {
  status?: string;
  stage?: string;
  minValue?: number;
  maxValue?: number;
}): Promise<Deal[]> => {
  try {
    let query = supabase
      .from('deals')
      .select(`
        *,
        companies (name)
      `);
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.stage && filters.stage !== 'all') {
      query = query.eq('stage', filters.stage);
    }
    
    if (filters.minValue) {
      query = query.gte('value', filters.minValue);
    }
    
    if (filters.maxValue) {
      query = query.lte('value', filters.maxValue);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(deal => ({
      ...deal,
      company_name: deal.companies?.name
    }));
  } catch (error) {
    console.error("خطأ في فلترة الصفقات:", error);
    toast.error("فشل في فلترة الصفقات");
    return [];
  }
};
