import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskCreateInput } from '@/services/tasks/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

const PRIORITIES = [
  { value: 'low', label: 'منخفضة' },
  { value: 'medium', label: 'متوسطة' },
  { value: 'high', label: 'عالية' }
];

const STATUSES = [
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'in_progress', label: 'قيد التنفيذ' },
  { value: 'completed', label: 'مكتملة' },
  { value: 'cancelled', label: 'ملغاة' },
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
      assigned_to: task?.assigned_to || '',
      type: task?.type || 'task',
      lead_id: leadId || task?.lead_id || '',
      contact_id: task?.contact_id || '',
      company_id: task?.company_id || '',
      deal_id: task?.deal_id || '',
      appointment_id: task?.appointment_id || '',
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
    const safeData: TaskCreateInput = {
      ...data,
      priority: data.priority as 'low' | 'medium' | 'high',
      status: data.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      start_time: data.start_time ? new Date(data.start_time).toISOString() : null,
    };

    await onSubmit(safeData);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">الأولوية</label>
          <Select value={watch('priority')} onValueChange={v => setValue('priority', v)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الأولوية" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">الحالة</label>
          <Select value={watch('status')} onValueChange={v => setValue('status', v)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

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
      <div>
        <label className="text-sm font-medium">تعيين إلى مستخدم</label>
        <Select
          value={watch('assigned_to')}
          onValueChange={v => setValue('assigned_to', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر مستخدم..." />
          </SelectTrigger>
          <SelectContent>
            {users.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">الجهة المرتبطة (اختياري)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Select
            value={watch('lead_id')}
            onValueChange={v => setValue('lead_id', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="ربط عميل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون</SelectItem>
              {leads.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select
            value={watch('company_id')}
            onValueChange={v => setValue('company_id', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="ربط شركة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون</SelectItem>
              {companies.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select
            value={watch('deal_id')}
            onValueChange={v => setValue('deal_id', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="ربط صفقة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون</SelectItem>
              {deals.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select
            value={watch('appointment_id')}
            onValueChange={v => setValue('appointment_id', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="ربط موعد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون</SelectItem>
              {appointments.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

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
