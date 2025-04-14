import { supabase } from "../integrations/supabase/client";
import { Lead, LeadActivity } from "../types/leads";
import { toast } from "sonner";

// Re-export the Lead type
export type { Lead, LeadActivity };

// Mock lead data for development and testing
const mockLeads: Lead[] = [
  {
    id: "1",
    first_name: "أحمد",
    last_name: "محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    company: "شركة الخليج للتقنية",
    status: "جديد",
    stage: "جديد",
    source: "معرض تجاري",
    assignedTo: "محمد علي",
    created_at: "2023-04-15",
    lastActivity: "2023-05-01",
    country: "السعودية",
    industry: "تكنولوجيا المعلومات",
    owner: {
      name: "محمد علي",
      avatar: "/placeholder.svg",
      initials: "م.ع"
    }
  },
  // ... more mock leads
];

// Separate mock activities to prevent circular references
const mockActivities: Record<string, LeadActivity[]> = {
  "1": [
    {
      id: "a1",
      leadId: "1",
      type: "اتصال",
      description: "تم التواصل مع العميل وإبداء الاهتمام",
      createdBy: "سارة أحمد",
      createdAt: "2023-04-20",
    },
    {
      id: "a2",
      leadId: "1",
      type: "بريد إلكتروني",
      description: "تم إرسال عرض تقديمي للمنتج",
      createdBy: "محمد علي",
      createdAt: "2023-04-23",
    },
  ],
  // ... more activities for other leads
};

// تحويل البيانات من Supabase
const transformLeadFromSupabase = (lead: any): Lead => {
  if (!lead) return lead;
  
  return {
    ...lead,
    // معالجة حالة وجود assigned_to بدلاً من assignedTo
    assignedTo: lead.assignedTo || lead.assigned_to,
    // ضمان وجود بيانات المالك (owner)
    owner: lead.owner || {
      name: lead.assigned_to_name || "غير مخصص",
      avatar: "/placeholder.svg",
      initials: lead.assigned_to_name ? lead.assigned_to_name.charAt(0) : "؟"
    }
  };
};

// Get all leads from Supabase or fallback to mock data
export const getLeads = async (): Promise<Lead[]> => {
  try {
    console.log("Fetching leads from Supabase...");
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `);
    
    if (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
    
    // تحويل البيانات من Supabase إلى الشكل المطلوب
    if (data && data.length > 0) {
      return data.map(lead => {
        const profile = lead.profiles;
        return {
          ...lead,
          owner: profile ? {
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "غير معروف",
            avatar: "/placeholder.svg",
            initials: profile.first_name ? profile.first_name.charAt(0) : "؟"
          } : undefined
        };
      });
    }
    
    // استخدام البيانات المحلية في حالة عدم وجود بيانات في Supabase
    console.log("No data found in Supabase, using mock data");
    return Promise.resolve(mockLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    toast.error("تعذر جلب بيانات العملاء المحتملين، جاري استخدام البيانات المحلية");
    return Promise.resolve(mockLeads);
  }
};

// Get lead by ID from Supabase or fallback to mock data
export const getLeadById = async (id: string): Promise<Lead | null> => {
  try {
    console.log(`Fetching lead with id ${id} from Supabase...`);
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching lead by ID:", error);
      throw error;
    }
    
    if (data) {
      const profile = data.profiles;
      return {
        ...data,
        owner: profile ? {
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "غير معروف",
          avatar: "/placeholder.svg",
          initials: profile.first_name ? profile.first_name.charAt(0) : "؟"
        } : undefined
      };
    }
    
    // استخدام البيانات المحلية في حالة عدم وجود بيانات في Supabase
    const mockLead = mockLeads.find((lead) => lead.id === id);
    console.log("No data found in Supabase, using mock data");
    return Promise.resolve(mockLead || null);
  } catch (error) {
    console.error("Error fetching lead by ID:", error);
    // استخدام البيانات المحلية في حالة حدوث خطأ
    const mockLead = mockLeads.find((lead) => lead.id === id);
    return Promise.resolve(mockLead || null);
  }
};

// Add an alias for fetchLeadById to maintain compatibility
export const fetchLeadById = getLeadById;

// Get activities for a lead from Supabase or fallback to mock data
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    console.log(`Fetching activities for lead ${leadId} from Supabase...`);
    const { data, error } = await supabase
      .from('lead_activities')
      .select(`
        *,
        profiles:created_by (first_name, last_name)
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching lead activities:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(activity => ({
        id: activity.id,
        leadId: activity.lead_id,
        lead_id: activity.lead_id,
        type: activity.type,
        description: activity.description,
        createdBy: activity.profiles ? `${activity.profiles.first_name || ''} ${activity.profiles.last_name || ''}` : undefined,
        created_by: activity.created_by,
        createdAt: activity.created_at,
        created_at: activity.created_at,
        scheduled_at: activity.scheduled_at,
        completed_at: activity.completed_at
      }));
    }
    
    // استخدام البيانات المحلية في حالة عدم وجود بيانات في Supabase
    console.log("No activities found in Supabase, using mock data");
    return Promise.resolve(mockActivities[leadId] || []);
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    // استخدام البيانات المحلية في حالة حدوث خطأ
    return Promise.resolve(mockActivities[leadId] || []);
  }
};

// Add new activity to a lead
export const addLeadActivity = async (activity: Omit<LeadActivity, "id">): Promise<LeadActivity> => {
  try {
    console.log("Adding new activity:", activity);
    
    // تحضير البيانات للإرسال إلى Supabase
    const activityToInsert = {
      lead_id: activity.leadId || activity.lead_id,
      type: activity.type,
      description: activity.description,
      created_by: activity.createdBy || activity.created_by || null,
      scheduled_at: activity.scheduled_at,
      completed_at: null
    };
    
    // محاولة حفظ النشاط في Supabase
    const { data, error } = await supabase
      .from('lead_activities')
      .insert(activityToInsert)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding activity to Supabase:", error);
      throw error;
    }
    
    // إذا نجحت الع���لية، نقوم بإرجاع النشاط المضاف
    if (data) {
      return {
        id: data.id,
        leadId: data.lead_id,
        lead_id: data.lead_id,
        type: data.type,
        description: data.description,
        createdBy: data.created_by,
        created_by: data.created_by,
        createdAt: data.created_at,
        created_at: data.created_at,
        scheduled_at: data.scheduled_at,
        completed_at: data.completed_at
      };
    }
    
    // في حالة عدم وجود بيانات مرجعة، نستخدم البيانات المحلية
    const newActivity: LeadActivity = {
      id: `a${Date.now()}`,
      ...activity,
      lead_id: activity.leadId || activity.lead_id,
      created_by: activity.createdBy || activity.created_by,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    if (!mockActivities[newActivity.leadId]) {
      mockActivities[newActivity.leadId] = [];
    }
    
    mockActivities[newActivity.leadId].push(newActivity);
    return Promise.resolve(newActivity);
  } catch (error) {
    console.error("Error adding lead activity:", error);
    
    // في حالة الخطأ، نستخدم البيانات المحلية
    const newActivity: LeadActivity = {
      id: `a${Date.now()}`,
      ...activity,
      lead_id: activity.leadId || activity.lead_id,
      created_by: activity.createdBy || activity.created_by,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    if (!mockActivities[newActivity.leadId]) {
      mockActivities[newActivity.leadId] = [];
    }
    
    mockActivities[newActivity.leadId].push(newActivity);
    return Promise.resolve(newActivity);
  }
};

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
    
    // م��اولة إنشاء العميل المحتمل في Supabase
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
    delete mockActivities[id];
    
    // حذف العميل المحتمل من البيانات المحلية أيضًا
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index >= 0) {
      mockLeads.splice(index, 1);
    }
    
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error deleting lead:", error);
    
    // في حالة الخطأ�� نحذف من البيانات المحلية فقط
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index >= 0) {
      mockLeads.splice(index, 1);
      delete mockActivities[id];
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
};

// الحصول على قائمة المصادر المستخدمة
export const getLeadSources = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('source')
      .not('source', 'is', null);
    
    if (error) throw error;
    
    // استخراج المصادر الفريدة
    const sources = data
      .map(item => item.source as string)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    return sources;
  } catch (error) {
    console.error("Error fetching lead sources:", error);
    // قائمة مصادر افتراضية
    return [
      "معرض تجاري",
      "توصية",
      "بحث إلكتروني",
      "وسائل التواصل الاجتماعي",
      "إعلان",
      "مكالمة هاتفية",
      "موقع إلكتروني",
      "شريك أعمال"
    ];
  }
};

// الحصول على قائمة القطاعات المستخدمة
export const getIndustries = async (): Promise<string[]> => {
  try {
    const result = await supabase
      .from('leads')
      .select('industry')
      .not('industry', 'is', null);
    
    // التحقق من وجود خطأ في الاستعلام
    if (result.error) {
      console.error("Error fetching industries:", result.error);
      throw result.error;
    }
    
    // استخراج القطاعات الفريدة
    if (result.data && result.data.length > 0) {
      const industries = result.data
        .map(item => item.industry as string)
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      
      return industries;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching industries:", error);
    // قائمة قطاعات افتراضية
    return [
      "تكنولوجيا المعلومات",
      "الرعاية الصحية",
      "التعليم",
      "التجارة الإلكترونية",
      "المالية والمصرفية",
      "العقارات",
      "الإعلام والترفيه",
      "التصنيع",
      "الخدمات المهنية",
      "البيع بالتجزئة"
    ];
  }
};
