
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskCreateInput } from '@/services/tasks/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import TaskPriorityStatusSection from './TaskPriorityStatusSection';
import AssigneeSelect from './AssigneeSelect';
import TaskAssociationSection from './TaskAssociationSection';

interface TaskFormProps {
  onSubmit: (data: TaskCreateInput) => Promise<void>;
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

// Type guards for priority and status values
const isPriority = (value: string): value is 'low' | 'medium' | 'high' => {
  return ['low', 'medium', 'high'].includes(value);
};

const isStatus = (value: string): value is 'pending' | 'in_progress' | 'completed' | 'cancelled' => {
  return ['pending', 'in_progress', 'completed', 'cancelled'].includes(value);
};

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
      priority: task?.priority || 'medium',
      status: task?.status || 'pending',
      due_date: task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
      start_time: task?.start_time ? new Date(task.start_time).toISOString().slice(0, 16) : '',
      assigned_to: task?.assigned_to || 'none',
      type: task?.type || 'task',
      lead_id: leadId || task?.lead_id || 'none',
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
      try {
        // Fetch users with pagination for better performance
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .limit(50);
        
        if (usersError) {
          console.error("Error fetching users:", usersError);
          toast.error("فشل في تحميل بيانات المستخدمين");
        } else {
          setUsers(
            usersData?.map((u) => ({
              value: u.id,
              label: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || 'مستخدم بدون اسم'
            })) ?? []
          );
        }

        // Fetch leads with pagination
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('id, first_name, last_name, email')
          .limit(50);
        
        if (leadsError) {
          console.error("Error fetching leads:", leadsError);
          toast.error("فشل في تحميل بيانات العملاء المحتملين");
        } else {
          setLeads(
            leadsData?.map((l) => ({
              value: l.id,
              label: `${l.first_name ?? ''} ${l.last_name ?? ''}`.trim() || l.email || 'بدون اسم'
            })) ?? []
          );
        }

        // Fetch companies with pagination
        const { data: compsData, error: compsError } = await supabase
          .from('companies')
          .select('id, name')
          .limit(50);
        
        if (compsError) {
          console.error("Error fetching companies:", compsError);
          toast.error("فشل في تحميل بيانات الشركات");
        } else {
          setCompanies(compsData ? compsData.map((c) => ({value: c.id, label: c.name})) : []);
        }

        // Fetch deals with pagination
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('id, name')
          .limit(50);
        
        if (dealsError) {
          console.error("Error fetching deals:", dealsError);
          toast.error("فشل في تحميل بيانات الصفقات");
        } else {
          setDeals(dealsData ? dealsData.map((d) => ({value: d.id, label: d.name})) : []);
        }
        
        // Fetch appointments with pagination
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('id, title')
          .limit(50);
        
        if (appointmentsError) {
          console.error("Error fetching appointments:", appointmentsError);
          toast.error("فشل في تحميل بيانات المواعيد");
        } else {
          setAppointments(appointmentsData ? appointmentsData.map((a) => ({value: a.id, label: a.title})) : []);
        }
      } catch (error) {
        console.error("Error fetching entities:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoadingEntities(false);
      }
    };

    fetchEntities();
  }, []);

  const handleCancel = () => onCancel ? onCancel() : onClose?.();

  const handleFormSubmit = async (data: any) => {
    try {
      // Validate priority and status
      const priority = isPriority(data.priority) ? data.priority : 'medium';
      const status = isStatus(data.status) ? data.status : 'pending';

      // Prepare task data for submission
      const safeData: TaskCreateInput = {
        ...data,
        priority: priority,
        status: status,
        assigned_to: data.assigned_to === "none" ? null : data.assigned_to,
        lead_id: data.lead_id === "none" ? null : data.lead_id,
        company_id: data.company_id === "none" ? null : data.company_id,
        deal_id: data.deal_id === "none" ? null : data.deal_id,
        appointment_id: data.appointment_id === "none" ? null : data.appointment_id,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
        start_time: data.start_time ? new Date(data.start_time).toISOString() : null,
      };

      console.log("Submitting task with data:", safeData);
      await onSubmit(safeData);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("حدث خطأ أثناء حفظ المهمة");
    }
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
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={watch('type')}
          onChange={(e) => setValue('type', e.target.value)}
        >
          {TASK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">الوصف</label>
        <Textarea className="resize-none" {...register('description')} />
      </div>

      <TaskPriorityStatusSection
        priority={isPriority(priority) ? priority : 'medium'}
        status={isStatus(status) ? status : 'pending'}
        setPriority={(v) => setValue('priority', v)}
        setStatus={(v) => setValue('status', v)}
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
        onChange={(v) => setValue('assigned_to', v)}
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
        setLeadId={(v) => setValue('lead_id', v)}
        setCompanyId={(v) => setValue('company_id', v)}
        setDealId={(v) => setValue('deal_id', v)}
        setAppointmentId={(v) => setValue('appointment_id', v)}
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
