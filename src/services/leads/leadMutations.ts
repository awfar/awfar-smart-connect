
// Functions for modifying lead data
import { supabase } from "../../integrations/supabase/client";
import { Lead, LeadActivity } from "./types";
import { mockLeads, mockActivities } from "./mockData";
import { toast } from "sonner";
import { addLeadActivity } from "./leadActivities";

// Update lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  try {
    console.log("Updating lead:", lead);
    
    // تحضير البيانات للإرسال إلى Supabase
    const { owner, ...leadToUpdate } = lead;
    
    // محاولة تحديث العميل المحتمل في Supabase
    const { data, error } = await supabase
      .from('leads')
      .update({
        ...leadToUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('id', lead.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating lead in Supabase:", error);
      throw error;
    }
    
    // إذا نجحت العملية، نقوم بإرجاع العميل المحتمل المحدث
    if (data) {
      return {
        ...data,
        owner: lead.owner // نحتفظ بمعلومات المالك من البيانات المقدمة
      };
    }
    
    // في حالة عدم وجود بيانات مرجعة، نستخدم البيانات المحلية
    const index = mockLeads.findIndex((l) => l.id === lead.id);
    if (index >= 0) {
      mockLeads[index] = lead;
    }
    return Promise.resolve(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    
    // في حالة الخطأ، نستخدم البيانات المحلية
    const index = mockLeads.findIndex((l) => l.id === lead.id);
    if (index >= 0) {
      mockLeads[index] = lead;
    }
    return Promise.resolve(lead);
  }
};

// Create new lead
export const createLead = async (lead: Omit<Lead, "id">): Promise<Lead> => {
  try {
    console.log("Creating new lead:", lead);
    
    // تحضير البيانات للإرسال إلى Supabase
    const { owner, ...leadToCreate } = lead as any;
    
    // التأكد من وجود تاريخ الإنشاء
    if (!leadToCreate.created_at) {
      leadToCreate.created_at = new Date().toISOString();
    }
    
    // التأكد من وجود تاريخ التحديث
    if (!leadToCreate.updated_at) {
      leadToCreate.updated_at = new Date().toISOString();
    }
    
    // محاولة إنشاء العميل المحتمل في Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert(leadToCreate)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating lead in Supabase:", error);
      throw error;
    }
    
    // إذا نجحت العملية، نقوم بإرجاع العميل المحتمل الجديد
    if (data) {
      // إنشاء نشاط تلقائي للمتابعة بعد 3 أيام
      const followupDate = new Date();
      followupDate.setDate(followupDate.getDate() + 3);
      
      try {
        await addLeadActivity({
          leadId: data.id,
          type: "call",
          description: "متابعة هاتفية للعميل المحتمل الجديد",
          scheduled_at: followupDate.toISOString()
        });
      } catch (error) {
        console.error("Error creating follow-up activity:", error);
        // لا نريد أن نوقف الإنشاء إذا فشلت إضافة النشاط
      }
      
      const newLead = {
        ...data,
        owner // نستخدم معلومات المالك من البيانات المقدمة إذا كانت موجودة
      };
      
      toast.success("تم إنشاء العميل المحتمل بنجاح");
      return newLead;
    }
    
    // في حالة عدم وجود بيانات مرجعة، نستخدم البيانات المحلية
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...lead,
    };
    mockLeads.push(newLead);
    
    // إنشاء نشاط تلقائي للمتابعة بعد 3 أيام
    const followupDate = new Date();
    followupDate.setDate(followupDate.getDate() + 3);
    
    const followupActivity: Omit<LeadActivity, "id"> = {
      leadId: newLead.id,
      type: "call",
      description: "متابعة هاتفية للعميل المحتمل الجديد",
      scheduled_at: followupDate.toISOString()
    };
    
    await addLeadActivity(followupActivity);
    
    return Promise.resolve(newLead);
  } catch (error) {
    console.error("Error creating lead:", error);
    
    // في حالة الخطأ، نستخدم البيانات المحلية
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...lead,
    };
    mockLeads.push(newLead);
    
    // إنشاء نشاط تلقائي للمتابعة بعد 3 أيام
    const followupDate = new Date();
    followupDate.setDate(followupDate.getDate() + 3);
    
    const followupActivity: Omit<LeadActivity, "id"> = {
      leadId: newLead.id,
      type: "call",
      description: "متابعة هاتفية للعميل المحتمل الجديد",
      scheduled_at: followupDate.toISOString()
    };
    
    try {
      await addLeadActivity(followupActivity);
    } catch (error) {
      console.error("Error creating follow-up activity:", error);
    }
    
    return Promise.resolve(newLead);
  }
};

// Delete lead
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting lead with ID:", id);
    
    // محاولة حذف العميل المحتمل من Supabase
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting lead from Supabase:", error);
      throw error;
    }
    
    // حذف الأنشطة المرتبطة بالعميل المحتمل
    if (mockActivities[id]) {
      delete mockActivities[id];
    }
    
    // حذف العميل المحتمل من البيانات المحلية أيضًا
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index >= 0) {
      mockLeads.splice(index, 1);
    }
    
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error deleting lead:", error);
    
    // في حالة الخطأ، نحذف من البيانات المحلية فقط
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index >= 0) {
      mockLeads.splice(index, 1);
      if (mockActivities[id]) {
        delete mockActivities[id];
      }
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
};
