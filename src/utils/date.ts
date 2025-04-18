
import { format as dateFnsFormat } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * Format a date using date-fns with Arabic locale
 */
export const format = (date: Date | string | number, formatString: string): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateFnsFormat(dateObj, formatString, { locale: ar });
};
