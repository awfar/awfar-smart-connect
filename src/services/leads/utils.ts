
// Utility function to get the color class for a lead stage
export const getStageColorClass = (stage: string): string => {
  switch (stage.toLowerCase()) {
    case 'جديد':
    case 'new':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'مؤهل':
    case 'qualified':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'جاري التواصل':
    case 'in progress':
    case 'in contact':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'تم التحويل':
    case 'converted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'غير مؤهل':
    case 'disqualified':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
