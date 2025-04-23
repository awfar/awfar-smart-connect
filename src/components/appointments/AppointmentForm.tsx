
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Appointment } from '@/services/appointments/types';
import { createAppointment, updateAppointment } from '@/services/appointments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AutocompleteOption, Autocomplete } from '@/components/ui/autocomplete';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

export interface AppointmentFormProps {
  leadId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (data: any) => Promise<void>;
  appointment?: Appointment;
  isSubmitting?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  leadId, 
  onSuccess, 
  onClose,
  onCancel,
  onSubmit: externalSubmit,
  appointment,
  isSubmitting = false
}) => {
  const [leadInfo, setLeadInfo] = useState<{first_name: string, last_name: string, email: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [leadsOptions, setLeadsOptions] = useState<AutocompleteOption[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  
  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      title: appointment?.title || '',
      description: appointment?.description || '',
      start_time: appointment?.start_time ? new Date(appointment.start_time).toISOString().slice(0, 16) : '',
      end_time: appointment?.end_time ? new Date(appointment.end_time).toISOString().slice(0, 16) : '',
      location: appointment?.location || '',
      lead_id: leadId || appointment?.lead_id || '',
    }
  });
  
  // Fetch leads for autocomplete
  useEffect(() => {
    const fetchLeads = async () => {
      setLoadingLeads(true);
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('id, first_name, last_name, email')
          .limit(50);
        
        if (error) {
          console.error("Error fetching leads:", error);
          toast.error("فشل في تحميل بيانات العملاء المحتملين");
          return;
        }
        
        if (data && Array.isArray(data)) {
          const options = data.map(lead => ({
            value: lead.id,
            label: `${lead.first_name || ''} ${lead.last_name || ''} ${lead.email ? `(${lead.email})` : ''}`.trim()
          }));
          setLeadsOptions(options);
        } else {
          console.log("No leads data returned or data is not an array", data);
          setLeadsOptions([]);
        }
      } catch (error) {
        console.error("Error in fetchLeads:", error);
        setLeadsOptions([]);
      } finally {
        setLoadingLeads(false);
      }
    };

    fetchLeads();
  }, []);
  
  // Fetch lead information if leadId is provided
  useEffect(() => {
    const fetchLeadInfo = async () => {
      const currentLeadId = form.getValues('lead_id');
      if (!currentLeadId || currentLeadId === 'none') return;
      
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('first_name, last_name, email')
          .eq('id', currentLeadId)
          .single();
        
        if (error) throw error;
        if (data) setLeadInfo(data);
      } catch (err) {
        console.error('Error fetching lead info:', err);
      }
    };

    fetchLeadInfo();
  }, [form]);
  
  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!data.title) {
        toast.error("عنوان الموعد مطلوب");
        setLoading(false);
        return;
      }
      
      if (!data.start_time || !data.end_time) {
        toast.error("تاريخ البداية والنهاية مطلوبان");
        setLoading(false);
        return;
      }
      
      const startTime = new Date(data.start_time).toISOString();
      const endTime = new Date(data.end_time).toISOString();
      
      const appointmentData = {
        ...data,
        start_time: startTime,
        end_time: endTime,
      };
      
      // Remove empty or 'none' values
      Object.keys(appointmentData).forEach(key => {
        if (appointmentData[key] === '' || appointmentData[key] === 'none') {
          delete appointmentData[key];
        }
      });
      
      console.log("Submitting appointment data:", appointmentData);
      
      if (externalSubmit) {
        // Use provided onSubmit function if available
        await externalSubmit(appointmentData);
      } else {
        // Use default create/update logic if no onSubmit provided
        if (appointment) {
          // Editing existing appointment
          await updateAppointment(appointment.id, appointmentData);
          toast.success("تم تحديث الموعد بنجاح");
        } else {
          // Creating a new appointment
          await createAppointment(appointmentData);
          toast.success("تم إنشاء موعد جديد بنجاح");
        }
      }
      
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error creating/updating appointment:", error);
      toast.error("فشل في حفظ الموعد");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel - use either onCancel or onClose
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        {leadInfo && (
          <div className="bg-muted p-3 rounded-md mb-4">
            <h4 className="font-medium">معلومات العميل:</h4>
            <p className="text-sm">{leadInfo.first_name} {leadInfo.last_name} - {leadInfo.email}</p>
          </div>
        )}
        
        <div>
          <Label htmlFor="title">عنوان الموعد</Label>
          <Input 
            id="title" 
            type="text" 
            placeholder="أدخل عنوان الموعد" 
            {...form.register("title", { required: true })} 
          />
        </div>
        
        <div>
          <Label htmlFor="description">وصف الموعد</Label>
          <Textarea 
            id="description" 
            placeholder="أدخل وصف الموعد" 
            {...form.register("description")} 
          />
        </div>
        
        {!leadId && (
          <div className="mb-4">
            <Label htmlFor="lead_id">العميل المحتمل</Label>
            <FormField
              control={form.control}
              name="lead_id"
              render={({ field }) => (
                <Autocomplete
                  options={leadsOptions || []}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="اختر عميل محتمل"
                  emptyMessage="لا يوجد عملاء محتملين"
                  isLoading={loadingLeads}
                />
              )}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_time">وقت البدء</Label>
            <div className="relative">
              <Input 
                id="start_time" 
                type="datetime-local" 
                {...form.register("start_time", { required: true })} 
              />
              <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="end_time">وقت الانتهاء</Label>
            <div className="relative">
              <Input 
                id="end_time" 
                type="datetime-local" 
                {...form.register("end_time", { required: true })} 
              />
              <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="location">الموقع</Label>
          <Input 
            id="location" 
            type="text" 
            placeholder="أدخل موقع الموعد" 
            {...form.register("location")} 
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? 'جاري الحفظ...' : 'حفظ الموعد'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
