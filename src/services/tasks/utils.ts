
// Add a simple utility file to avoid recursive imports
export const formatTaskPriority = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'عالية';
    case 'medium':
      return 'متوسطة';
    case 'low':
      return 'منخفضة';
    default:
      return priority;
  }
};

export const formatTaskStatus = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'قيد الانتظار';
    case 'in_progress':
      return 'قيد التنفيذ';
    case 'completed':
      return 'مكتمل';
    case 'cancelled':
      return 'ملغي';
    default:
      return status;
  }
};
