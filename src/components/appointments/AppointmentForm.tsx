
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Appointment, AppointmentStatus } from '@/services/appointments/types';
import { createAppointment, updateAppointment } from '@/services/appointments/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AutocompleteOption, Autocomplete } from '@/components/ui/autocomplete';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>(leadId || appointment?.lead_id);
  
  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      title: appointment?.title || '',
      description: appointment?.description || '',
      start_time: appointment?.start_time ? new Date(appointment.start_time).toISOString().slice(0, 16) : '',
      end_time: appointment?.end_time ? new Date(appointment.end_time).toISOString().slice(0, 16) : '',
      location: appointment?.location || '',
      lead_id: leadId || appointment?.lead_id || '',
      status: appointment?.status || 'scheduled',
    }
  });
  
  // Fetch leads for autocomplete with search and pagination
  const fetchLeads = async (search = '') => {
    if (leadId) return; // Don't fetch if leadId is provided
    
    setLoadingLeads(true);
    try {
      let query = supabase
        .from('leads')
        .select('id, first_name, last_name, email')
        .limit(50);
      
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching leads:", error);
        toast.error("فشل في تحميل بيانات العملاء المحتملين");
        setLeadsOptions([]);
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

  // Initial load of leads
  useEffect(() => {
    if (!leadId) {
      fetchLeads();
    }
  }, [leadId]);
  
  // Fetch lead information if leadId is provided
  useEffect(() => {
    const fetchLeadInfo = async () => {
      if (!selectedLeadId || selectedLeadId === 'none') return;
      
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('first_name, last_name, email')
          .eq('id', selectedLeadId)
          .single();
        
        if (error) throw error;
        if (data) setLeadInfo(data);
      } catch (err) {
        console.error('Error fetching lead info:', err);
      }
    };

    fetchLeadInfo();
  }, [selectedLeadId]);
  
  const onFormSubmit = async (formData: any) => {
    if (loading || isSubmitting) return;
    
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.title) {
        toast.error("عنوان الموعد مطلوب");
        setLoading(false);
        return;
      }
      
      if (!formData.start_time || !formData.end_time) {
        toast.error("تاريخ البداية والنهاية مطلوبان");
        setLoading(false);
        return;
      }
      
      const appointmentData = {
        ...formData,
        lead_id: selectedLeadId || formData.lead_id,
      };
      
      console.log("Submitting appointment data:", appointmentData);
      
      if (externalSubmit) {
        await externalSubmit(appointmentData);
      } else {
        if (appointment) {
          // Update existing appointment
          const result = await updateAppointment(appointment.id, appointmentData);
          if (result) {
            toast.success("تم تحديث الموعد بنجاح");
          }
        } else {
          // Create new appointment
          const result = await createAppointment(appointmentData);
          if (result) {
            toast.success("تم إنشاء الموعد بنجاح");
          }
        }
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error("Error submitting appointment form:", error);
      toast.error(`فشل في ${appointment ? 'تحديث' : 'إنشاء'} الموعد: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان الموعد *</Label>
        <Input
          id="title"
          placeholder="أدخل عنوان الموعد"
          {...form.register('title', { required: true })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف الموعد</Label>
        <Textarea
          id="description"
          placeholder="أدخل تفاصيل الموعد"
          {...form.register('description')}
        />
      </div>

      {!leadId && (
        <div className="space-y-2">
          <Label htmlFor="lead_id">العميل المحتمل</Label>
          <Autocomplete
            options={leadsOptions}
            value={selectedLeadId}
            onValueChange={(value) => {
              setSelectedLeadId(value);
              form.setValue('lead_id', value);
            }}
            placeholder="اختر عميل محتمل"
            emptyMessage="لا يوجد عملاء محتملين"
            isLoading={loadingLeads}
            onSearch={(term) => fetchLeads(term)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">وقت البدء *</Label>
          <Input
            id="start_time"
            type="datetime-local"
            {...form.register('start_time', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">وقت الانتهاء *</Label>
          <Input
            id="end_time"
            type="datetime-local"
            {...form.register('end_time', { required: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">المكان</Label>
        <Input
          id="location"
          placeholder="أدخل مكان الموعد"
          {...form.register('location')}
        />
      </div>

      {appointment && (
        <div className="space-y-2">
          <Label htmlFor="status">الحالة</Label>
          <Select 
            defaultValue={form.watch('status')}
            onValueChange={(value) => form.setValue('status', value as AppointmentStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">مجدول</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
              <SelectItem value="rescheduled">معاد جدولته</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2 space-x-reverse mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
        >
          إلغاء
        </Button>
        <Button 
          type="submit"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? (
            <span className="flex items-center">
              <Calendar className="animate-spin ml-2 h-4 w-4" />
              جاري الحفظ...
            </span>
          ) : (
            appointment ? 'تحديث الموعد' : 'إنشاء موعد'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
