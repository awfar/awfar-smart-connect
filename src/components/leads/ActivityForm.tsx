
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { addLeadActivity } from "@/services/leads";
import { toast } from "sonner";
import { LeadActivity } from "@/services/leads";

interface ActivityFormProps {
  leadId: string;
  onClose: () => void;
  onSuccess?: (activity: LeadActivity) => void;
  title?: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  leadId, 
  onClose, 
  onSuccess, 
  title = "إضافة نشاط"
}) => {
  const [formData, setFormData] = useState({
    type: "call",
    description: "",
    scheduled_at: new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setScheduledDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, scheduled_at: date.toISOString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error("الرجاء إدخال وصف للنشاط");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newActivity = await addLeadActivity({
        lead_id: leadId,
        type: formData.type,
        description: formData.description,
        scheduled_at: formData.scheduled_at
      });
      
      onSuccess?.(newActivity);
      onClose();
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("حدث خطأ أثناء إضافة النشاط");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="activity-type">نوع النشاط</Label>
            <Select 
              value={formData.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="activity-type">
                <SelectValue placeholder="اختر نوع النشاط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">مكالمة هاتفية</SelectItem>
                <SelectItem value="meeting">اجتماع</SelectItem>
                <SelectItem value="email">بريد إلكتروني</SelectItem>
                <SelectItem value="task">مهمة</SelectItem>
                <SelectItem value="note">ملاحظة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="activity-description">الوصف</Label>
            <Textarea
              id="activity-description"
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={3}
              placeholder="أدخل وصفاً للنشاط..."
              className="resize-none"
            />
          </div>
          
          <div>
            <Label htmlFor="activity-date">تاريخ النشاط</Label>
            <div className="mt-1">
              <DatePicker
                date={scheduledDate}
                onSelect={handleDateChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.description.trim()}
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ النشاط"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
