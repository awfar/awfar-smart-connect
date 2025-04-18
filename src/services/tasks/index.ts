
// سيتم تصدير جميع الوظائف والأنواع من هذا الملف المركزي

export * from './types';
export * from './api';
export * from './utils';

export const getTasks = async (filterOptions?: {
  status?: string;
  assigned_to?: string;
  lead_id?: string;
}) => {
  const { getTasks } = await import('./api');
  return getTasks(filterOptions);
};

export const completeTask = async (taskId: string) => {
  const { completeTask } = await import('./api');
  return completeTask(taskId);
};

// لا نقوم بتصدير البيانات التجريبية مباشرة لأنها مستخدمة داخليًا فقط
