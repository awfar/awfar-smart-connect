
/**
 * Returns the Tailwind CSS class for the lead stage badge
 */
export const getStageColorClass = (stage: string): string => {
  switch (stage.toLowerCase()) {
    case 'جديد':
    case 'new':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'مؤهل':
    case 'qualified':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'عرض سعر':
    case 'quote':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'تفاوض':
    case 'negotiation':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case 'مغلق - فوز':
    case 'closed-won':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'مغلق - خسارة':
    case 'closed-lost':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

/**
 * Formats a lead's full name
 */
export const formatLeadName = (lead: { first_name?: string, last_name?: string }): string => {
  return `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
};
