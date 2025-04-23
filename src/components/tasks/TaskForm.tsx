
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskCreateInput } from '@/services/tasks/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import TaskPriorityStatusSection from './TaskPriorityStatusSection';
import AssigneeSelect from './AssigneeSelect';
import TaskAssociationSection from './TaskAssociationSection';

interface TaskFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
  task?: Task;
  leadId?: string;
  isSubmitting?: boolean;
}

type EntityOption = { value: string; label: string };

const TASK_TYPES = [
  { value: 'todo', label: 'مهمة شخصية (Todo)' },
  { value: 'reminder', label: 'تذكير' },
  { value: 'follow_up', label: 'متابعة' },
  { value: 'task', label: 'مهمة' },
  { value: 'project', label: 'مشروع' },
  { value: 'multi_contact_task', label: 'مهمة لعدة جهات اتصال' },
  { value: 'contact_list_task', label: 'مهمة قائمة جهات اتصال' },
];

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  onClose,
  task,
  leadId,
  isSubmitting = false,
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: (task?.priority || 'medium') as 'low' | 'medium' | 'high',
      status: (task?.status || 'pending') as 'pending' | 'in_progress' | 'completed' | 'cancelled',
      due_date: task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
      start_time: task?.start_time ? new Date(task.start_time).toISOString().slice(0, 16) : '',
      assigned_to: task?.assigned_to || 'none',
      type: task?.type || 'task',
      lead_id: leadId || task?.lead_id || 'none',
      contact_id: task?.contact_id || '',
      company_id: task?.company_id || 'none',
      deal_id: task?.deal_id || 'none',
      appointment_id: task?.appointment_id || 'none',
    }
  });

  const [users, setUsers] = useState<EntityOption[]>([]);
  const [leads, setLeads] = useState<EntityOption[]>([]);
  const [companies, setCompanies] = useState<EntityOption[]>([]);
  const [deals, setDeals] = useState<EntityOption[]>([]);
  const [appointments, setAppointments] = useState<EntityOption[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(true);

  useEffect(() => {
    const fetchEntities = async () => {
      setLoadingEntities(true);
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
      setUsers(
        usersData?.map((u) => ({
          value: u.id,
          label: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || 'مستخدم بدون اسم'
        })) ?? []
      );

      const { data: leadsData } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email');
      setLeads(
        leadsData?.map((l) => ({
          value: l.id,
          label: `${l.first_name ?? ''} ${l.last_name ?? ''}`.trim() || l.email || 'بدون اسم'
        })) ?? []
      );

      const { data: comps } = await supabase.from('companies').select('id, name');
      setCompanies(comps ? comps.map((c)=>({value:c.id,label:c.name})) : []);

      const { data: dealsData } = await supabase.from('deals').select('id, name');
      setDeals(dealsData ? dealsData.map((d)=>({value:d.id,label:d.name})) : []);
      
      const { data: appointmentsData } = await supabase.from('appointments').select('id, title');
      setAppointments(appointmentsData ? appointmentsData.map((a)=>({value:a.id,label:a.title})) : []);

      setLoadingEntities(false);
    };

    fetchEntities();
  }, []);

  const handleCancel = () => onCancel ? onCancel() : onClose?.();

  const handleFormSubmit = async (data: any) => {
    // Normalize 'none' values to empty string or null for backend
    const safeData: TaskCreateInput = {
      ...data,
      priority: data.priority as 'low' | 'medium' | 'high',
      status: data.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
      assigned_to: data.assigned_to === "none" ? null : data.assigned_to,
      lead_id: data.lead_id === "none" ? null : data.lead_id,
      company_id: data.company_id === "none" ? null : data.company_id,
      deal_id: data.deal_id === "none" ? null : data.deal_id,
      appointment_id: data.appointment_id === "none" ? null : data.appointment_id,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      start_time: data.start_time ? new Date(data.start_time).toISOString() : null,
    };

    await onSubmit(safeData);
  };

  // Get watched values for controlled components
  const priority = watch('priority');
  const status = watch('status');
  const assigned_to = watch('assigned_to');
  const lead_id = watch('lead_id');
  const company_id = watch('company_id');
  const deal_id = watch('deal_id');
  const appointment_id = watch('appointment_id');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">عنوان المهمة *</label>
        <Input placeholder="أدخل عنوان المهمة" {...register('title', { required: 'العنوان مطلوب' })} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message?.toString()}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">نوع المهمة *</label>
        <Select
          value={watch('type')}
          onValueChange={(value) => setValue('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع المهمة" />
          </SelectTrigger>
          <SelectContent>
            {TASK_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">الوصف</label>
        <Textarea className="resize-none" {...register('description')} />
      </div>

      <TaskPriorityStatusSection
        priority={priority}
        status={status}
        setPriority={v => setValue('priority', v)}
        setStatus={v => setValue('status', v)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">تاريخ الاستحقاق</label>
          <Input type="datetime-local" {...register('due_date')} />
        </div>
        <div>
          <label className="text-sm font-medium">تاريخ البدء</label>
          <Input type="datetime-local" {...register('start_time')} />
        </div>
      </div>

      <AssigneeSelect
        users={users}
        value={assigned_to}
        onChange={v => setValue('assigned_to', v)}
      />

      <TaskAssociationSection
        leadId={lead_id}
        companyId={company_id}
        dealId={deal_id}
        appointmentId={appointment_id}
        leads={leads}
        companies={companies}
        deals={deals}
        appointments={appointments}
        setLeadId={v => setValue('lead_id', v)}
        setCompanyId={v => setValue('company_id', v)}
        setDealId={v => setValue('deal_id', v)}
        setAppointmentId={v => setValue('appointment_id', v)}
      />

      <div className="flex justify-end">
        <Button type="button" variant="outline" className="mr-2" onClick={handleCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting || loadingEntities}>
          {isSubmitting ? 'جاري الحفظ...' : task ? 'تحديث المهمة' : 'إضافة مهمة'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
