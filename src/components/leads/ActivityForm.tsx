
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadActivityInput } from '@/services/leads';
import { addLeadActivity } from '@/services/leads/api';

interface ActivityFormProps {
  leadId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ leadId, onSuccess, onClose }) => {
  const [activityType, setActivityType] = useState<'call' | 'email' | 'meeting' | 'note' | 'task' | 'whatsapp'>('note');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description) {
      return;
    }
    
    setLoading(true);
    
    const activity: LeadActivityInput = {
      lead_id: leadId,
      type: activityType,
      description,
      scheduled_at: scheduledDate ? scheduledDate.toISOString() : undefined,
    };
    
    try {
      await addLeadActivity(activity);
      onSuccess();
    } catch (error) {
      console.error('Error adding activity:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border-t">
      <h3 className="text-lg font-medium mb-4">إضافة نشاط جديد</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="activityType">نوع النشاط</Label>
          <Select 
            value={activityType} 
            onValueChange={(value: any) => setActivityType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع النشاط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">مكالمة</SelectItem>
              <SelectItem value="email">بريد إلكتروني</SelectItem>
              <SelectItem value="meeting">اجتماع</SelectItem>
              <SelectItem value="note">ملاحظة</SelectItem>
              <SelectItem value="task">مهمة</SelectItem>
              <SelectItem value="whatsapp">واتساب</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">الوصف</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أدخل وصفًا للنشاط"
            rows={4}
            required
          />
        </div>
        
        {activityType !== 'note' && (
          <div className="space-y-2">
            <Label htmlFor="scheduledDate">تاريخ المتابعة</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? (
                    format(scheduledDate, "PPP", { locale: ar })
                  ) : (
                    <span>اختر تاريخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" disabled={!description || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              'إضافة'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
