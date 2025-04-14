
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { addLeadActivity } from '@/services/leadsService';
import { LeadActivity } from '@/types/leads';
import { toast } from 'sonner';

interface ActivityFormProps {
  leadId: string;
  onClose: () => void;
  onSuccess: (activity: LeadActivity) => void;
  title?: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ leadId, onClose, onSuccess, title = "إضافة نشاط" }) => {
  const [activityType, setActivityType] = useState<string>('note');
  const [description, setDescription] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('الرجاء إدخال وصف للنشاط');
      return;
    }

    setIsLoading(true);
    try {
      const activity = await addLeadActivity({
        leadId,
        type: activityType,
        description,
        scheduled_at: scheduledDate ? scheduledDate.toISOString() : undefined,
        createdBy: 'الحالي' // في نظام حقيقي، هذا سيكون معرف المستخدم الحالي
      });
      
      onSuccess(activity);
      toast.success('تم إضافة النشاط بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة النشاط:', error);
      toast.error('حدث خطأ أثناء إضافة النشاط');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-card">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>إلغاء</Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="activity-type">نوع النشاط</Label>
          <Select 
            value={activityType} 
            onValueChange={setActivityType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر نوع النشاط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="note">ملاحظة</SelectItem>
              <SelectItem value="call">مكالمة</SelectItem>
              <SelectItem value="meeting">اجتماع</SelectItem>
              <SelectItem value="email">بريد إلكتروني</SelectItem>
              <SelectItem value="task">مهمة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">الوصف</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="أدخل وصف النشاط هنا"
            required
          />
        </div>

        {activityType !== 'note' && (
          <div>
            <Label htmlFor="scheduled-date">تاريخ الجدولة</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-right"
                  id="scheduled-date"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {scheduledDate ? (
                    format(scheduledDate, 'PPP', { locale: ar })
                  ) : (
                    <span>اختر تاريخاً</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  locale={ar}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin ml-2"></div>
              جاري الحفظ...
            </div>
          ) : (
            'حفظ النشاط'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
