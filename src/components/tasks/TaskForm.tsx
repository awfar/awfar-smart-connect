import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Task, TaskCreateInput } from '@/services/tasks/types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AutocompleteOption, Autocomplete } from '@/components/ui/autocomplete';

export interface TaskFormProps {
  leadId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  task?: Task;
  isSubmitting?: boolean;
  onSubmit?: (data: TaskCreateInput) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  leadId, 
  onSuccess, 
  onClose,
  onCancel,
  task,
  isSubmitting: externalIsSubmitting = false,
  onSubmit: externalOnSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadsOptions, setLeadsOptions] = useState<AutocompleteOption[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>(leadId || task?.lead_id);
  
  const { register, handleSubmit, formState, setValue, watch, control } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      due_date: task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
      lead_id: leadId || task?.lead_id || '',
    }
  });

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
        return;
      }
      
      if (data && Array.isArray(data)) {
        const options = data.map(lead => ({
          value: lead.id,
          label: `${lead.first_name || ''} ${lead.last_name || ''} ${lead.email ? `(${lead.email})` : ''}`.trim()
        }));
        setLeadsOptions(options);
      } else {
        console.log("No leads data returned or data is not an array");
        setLeadsOptions([]);
      }
    } catch (error) {
      console.error("Error in fetchLeads:", error);
      setLeadsOptions([]);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (!leadId) {
      fetchLeads();
    }
  }, [leadId]);
  
  const onFormSubmit = async (data: TaskCreateInput) => {
    try {
      setIsSubmitting(true);
      
      if (!data.title) {
        toast.error("عنوان المهمة مطلوب");
        setIsSubmitting(false);
        return;
      }
      
      const dueDate = data.due_date ? new Date(data.due_date).toISOString() : undefined;
      
      const taskData = {
        ...data,
        due_date: dueDate,
        lead_id: selectedLeadId || data.lead_id,
      };
      
      console.log("Submitting task data:", taskData);

      if (externalOnSubmit) {
        await externalOnSubmit(data);
      } else {
        if (task) {
          await updateTask(task.id, taskData);
          toast.success("تم تحديث المهمة بنجاح");
        } else {
          await createTask(taskData);
          toast.success("تم إنشاء المهمة بنجاح");
        }
        
        onSuccess?.();
        onClose?.();
      }
    } catch (error) {
      console.error("Error creating/updating task:", error);
      toast.error("فشل في إنشاء/تحديث المهمة");
    } finally {
      setIsSubmitting(false);
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col space-y-4">
      <div>
        <Label htmlFor="title">عنوان المهمة</Label>
        <Input 
          id="title" 
          type="text" 
          placeholder="أدخل عنوان المهمة" 
          {...register("title", { required: 'العنوان مطلوب' })} 
        />
        {formState.errors.title && <p className="text-red-500 text-sm">{formState.errors.title.message?.toString()}</p>}
      </div>
      
      <div>
        <Label htmlFor="description">وصف المهمة</Label>
        <Textarea 
          id="description" 
          placeholder="أدخل وصف المهمة" 
          {...register("description")} 
        />
      </div>
      
      {!leadId && (
        <div>
          <Label htmlFor="lead_id">العميل المحتمل</Label>
          <Autocomplete 
            options={leadsOptions || []}
            value={selectedLeadId}
            onValueChange={(value) => {
              setSelectedLeadId(value);
              setValue("lead_id", value);
            }}
            placeholder="اختر عميل محتمل"
            emptyMessage="لا يوجد عملاء محتملين"
            isLoading={loadingLeads}
            onSearch={(term) => fetchLeads(term)}
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="priority">الأولوية</Label>
        <Select 
          defaultValue={watch("priority") || "medium"}
          onValueChange={(value) => setValue("priority", value as "low" | "medium" | "high")}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الأولوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">منخفضة</SelectItem>
            <SelectItem value="medium">متوسطة</SelectItem>
            <SelectItem value="high">عالية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
        <Input
          id="due_date"
          type="datetime-local"
          {...register("due_date")}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={handleCancel}>إلغاء</Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || externalIsSubmitting}
        >
          {isSubmitting || externalIsSubmitting ? 'جاري الحفظ...' : task ? 'تحديث' : 'حفظ'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
