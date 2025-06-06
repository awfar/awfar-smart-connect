
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon, Loader2, Plus, AlertCircle } from "lucide-react";
import { createDeal, updateDeal } from "@/services/deals/dealMutations";
import { getSalesTeamMembers } from "@/services/deals/dealQueries";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface DealFormProps {
  onCancel: () => void;
  onSave: () => void;
  dealId?: string;
  initialData?: any;
  companyId?: string;
  leadId?: string;
}

const dealFormSchema = z.object({
  name: z.string().min(1, { message: "اسم الصفقة مطلوب" }),
  value: z.string().optional(),
  stage: z.string().min(1, { message: "المرحلة مطلوبة" }),
  company_id: z.string().optional().nullable(),
  lead_id: z.string().optional().nullable(),
  contact_id: z.string().optional().nullable(),
  status: z.string().default("active"),
  owner_id: z.string().optional().nullable(),
  expected_close_date: z.date().optional().nullable(),
  description: z.string().optional().nullable(),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

const DealForm = ({ onCancel, onSave, dealId, initialData, companyId, leadId }: DealFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesTeam, setSalesTeam] = useState<{id: string; name: string}[]>([]);
  const [companies, setCompanies] = useState<{id: string; name: string}[]>([]);
  const [leads, setLeads] = useState<{id: string; name: string}[]>([]);
  const [contacts, setContacts] = useState<{id: string; name: string}[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Create form with validation
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
      stage: "discovery",
      company_id: companyId || null,
      lead_id: leadId || null,
      contact_id: null,
      status: "active",
      owner_id: null,
      description: "",
    },
  });
  
  // Fetch sales team members
  useEffect(() => {
    const fetchSalesTeam = async () => {
      try {
        const members = await getSalesTeamMembers();
        setSalesTeam(members.map((member: any) => ({
          id: member.id,
          name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email || member.id
        })));
      } catch (error) {
        console.error("Error fetching sales team members:", error);
        toast.error("حدث خطأ أثناء جلب بيانات فريق المبيعات");
      }
    };
    
    fetchSalesTeam();
  }, []);
  
  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setCompanies(data.map(company => ({
          id: company.id,
          name: company.name
        })));
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("حدث خطأ أثناء جلب بيانات الشركات");
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    
    fetchCompanies();
  }, [showCompanyDialog]); // Refetch when company dialog is closed
  
  // Fetch leads based on company selection or all leads if no company selected
  const fetchLeadsForCompany = async (companyId: string | null) => {
    setIsLoadingLeads(true);
    try {
      let query = supabase
        .from('leads')
        .select('id, first_name, last_name, email');
        
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      const { data, error } = await query.order('first_name');
      
      if (error) throw error;
      
      setLeads(data.map(lead => ({
        id: lead.id,
        name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || lead.email || lead.id
      })));
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("حدث خطأ أثناء جلب بيانات العملاء المحتملين");
    } finally {
      setIsLoadingLeads(false);
    }
  };
  
  // Fetch contacts based on company selection
  const fetchContactsForCompany = async (companyId: string | null) => {
    if (!companyId) {
      setContacts([]);
      return;
    }
    
    setIsLoadingContacts(true);
    try {
      const { data, error } = await supabase
        .from('company_contacts')
        .select('id, name, email')
        .eq('company_id', companyId)
        .order('name');
        
      if (error) throw error;
      
      setContacts(data.map(contact => ({
        id: contact.id,
        name: contact.name || contact.email || contact.id
      })));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("حدث خطأ أثناء جلب بيانات جهات الاتصال");
    } finally {
      setIsLoadingContacts(false);
    }
  };
  
  // Watch company ID to update leads and contacts
  const selectedCompanyId = form.watch("company_id");
  useEffect(() => {
    fetchLeadsForCompany(selectedCompanyId);
    fetchContactsForCompany(selectedCompanyId);
  }, [selectedCompanyId, showLeadDialog]); // Refetch when lead dialog is closed
  
  // If initial data contains company_id and we're editing, load leads and contacts
  useEffect(() => {
    if (initialData?.company_id) {
      fetchLeadsForCompany(initialData.company_id);
      fetchContactsForCompany(initialData.company_id);
    }
  }, [initialData]);
  
  // If companyId is provided as prop, load leads and contacts
  useEffect(() => {
    if (companyId) {
      fetchLeadsForCompany(companyId);
      fetchContactsForCompany(companyId);
      form.setValue("company_id", companyId);
    }
  }, [companyId, form]);
  
  // If leadId is provided, set it
  useEffect(() => {
    if (leadId) {
      form.setValue("lead_id", leadId);
    }
  }, [leadId, form]);

  const onSubmit = async (data: DealFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Parse the value to a number if provided
      const parsedData = {
        ...data,
        value: data.value ? parseFloat(data.value) : null
      };
      
      if (dealId) {
        // Update existing deal
        await updateDeal(dealId, parsedData as any);
        toast.success("تم تحديث الصفقة بنجاح");
      } else {
        // Create new deal
        await createDeal(parsedData as any);
        toast.success("تم إنشاء الصفقة بنجاح");
      }
      
      onSave();
    } catch (error: any) {
      console.error("Error saving deal:", error);
      setFormError(error.message || "حدث خطأ أثناء حفظ الصفقة");
      toast.error("حدث خطأ أثناء حفظ الصفقة");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddCompany = () => {
    setShowCompanyDialog(true);
  };
  
  const handleAddLead = () => {
    setShowLeadDialog(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الصفقة*</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="أدخل اسم الصفقة" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>قيمة الصفقة</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      type="number" 
                      placeholder="أدخل قيمة الصفقة"
                      className="pl-16"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-l">
                      <span className="text-gray-500">ر.س</span>
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الشركة</FormLabel>
                <FormControl>
                  <div>
                    <Combobox
                      items={companies.map(company => ({
                        label: company.name,
                        value: company.id
                      }))}
                      value={field.value || ''}
                      placeholder={isLoadingCompanies ? "جاري التحميل..." : "اختر الشركة"}
                      onChange={(value) => {
                        field.onChange(value);
                        // Clear lead_id and contact_id when company changes
                        if (field.value !== value) {
                          form.setValue("lead_id", null);
                          form.setValue("contact_id", null);
                        }
                      }}
                      disabled={isLoadingCompanies}
                      emptyMessage="لا توجد شركات مطابقة"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto" 
                    type="button"
                    onClick={handleAddCompany}
                  >
                    <Plus className="h-3 w-3 ml-1" /> إضافة شركة جديدة
                  </Button>
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lead_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العميل المحتمل</FormLabel>
                <FormControl>
                  <div>
                    <Combobox
                      items={leads.map(lead => ({
                        label: lead.name,
                        value: lead.id
                      }))}
                      value={field.value || ''}
                      placeholder={isLoadingLeads ? "جاري التحميل..." : "اختر العميل"}
                      onChange={field.onChange}
                      disabled={isLoadingLeads}
                      emptyMessage={selectedCompanyId ? 
                        "لا يوجد عملاء محتملون لهذه الشركة" : 
                        "اختر شركة أولاً أو أضف عميل محتمل جديد"
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto"
                    type="button"
                    onClick={handleAddLead}
                    disabled={!selectedCompanyId}
                  >
                    <Plus className="h-3 w-3 ml-1" /> إضافة عميل جديد
                  </Button>
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>مرحلة الصفقة*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="discovery">مرحلة الاكتشاف</SelectItem>
                    <SelectItem value="proposal">تقديم العرض</SelectItem>
                    <SelectItem value="negotiation">مرحلة التفاوض</SelectItem>
                    <SelectItem value="closed_won">صفقة مربوحة</SelectItem>
                    <SelectItem value="closed_lost">صفقة خاسرة</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة الصفقة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="won">مربوح</SelectItem>
                    <SelectItem value="lost">خسارة</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expected_close_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ الإغلاق المتوقع</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-right"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخاً</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="owner_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مسؤول الصفقة</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المسؤول" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">بدون تعيين</SelectItem>
                  {salesTeam.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف الصفقة</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل تفاصيل الصفقة والملاحظات"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : dealId ? "حفظ التغييرات" : "إنشاء الصفقة"}
          </Button>
        </div>
      </form>
      
      {/* Company Creation Dialog (placeholder) */}
      <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة شركة جديدة</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* Company form would go here */}
            <p className="text-center">هذه النافذة مخصصة لإضافة شركة جديدة<br />يمكنك تنفيذ هذا الجزء بشكل منفصل</p>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowCompanyDialog(false)}>إغلاق</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Lead Creation Dialog (placeholder) */}
      <Dialog open={showLeadDialog} onOpenChange={setShowLeadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة عميل محتمل جديد</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* Lead form would go here */}
            <p className="text-center">هذه النافذة مخصصة لإضافة عميل محتمل جديد<br />يمكنك تنفيذ هذا الجزء بشكل منفصل</p>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowLeadDialog(false)}>إغلاق</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default DealForm;
