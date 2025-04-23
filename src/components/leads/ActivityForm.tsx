
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addLeadActivity } from '@/services/leads/leadActivities';
import { LeadActivityType } from '@/services/leads/types';
import { Loader2 } from 'lucide-react';

interface ActivityFormProps {
  leadId: string;
  initialType?: LeadActivityType;
  onSuccess?: (activity?: any) => void;
  onClose?: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  leadId,
  initialType = 'note',
  onSuccess,
  onClose
}) => {
  const [type, setType] = useState<LeadActivityType>(initialType);
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      alert("الرجاء إدخال وصف للنشاط");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure we're using the correct types for the activity
      const activity = {
        lead_id: leadId,
        type: type as LeadActivityType, // Make sure this is cast to the correct type
        description: description,
        scheduled_at: scheduledAt || undefined
      };
      
      console.log("Submitting activity with data:", activity);
      
      const result = await addLeadActivity(activity);
      
      if (result) {
        console.log("Activity added successfully:", result);
        setDescription('');
        setScheduledAt('');
        onSuccess?.(result);
        onClose?.();
      }
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const needsDateTime = ['call', 'meeting', 'email'].includes(type);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="activityType">نوع النشاط</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as LeadActivityType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع النشاط" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">ملاحظة</SelectItem>
            <SelectItem value="call">مكالمة</SelectItem>
            <SelectItem value="meeting">اجتماع</SelectItem>
            <SelectItem value="email">بريد إلكتروني</SelectItem>
            <SelectItem value="whatsapp">واتساب</SelectItem>
            <SelectItem value="task">مهمة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{type === 'note' ? 'الملاحظة' : 'الوصف'}</Label>
        <Textarea
          id="description"
          placeholder={type === 'note' ? 'أدخل الملاحظة هنا...' : 'أدخل وصف النشاط هنا...'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      {needsDateTime && (
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">وقت الموعد</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2 space-x-reverse">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...
            </>
          ) : (
            'إضافة النشاط'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
