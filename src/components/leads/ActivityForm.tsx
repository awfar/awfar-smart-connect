
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { addLeadActivity } from "@/services/leads";
import { LeadActivity } from "@/services/types/leadTypes";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface ActivityFormProps {
  leadId: string;
  title: string;
  onSuccess: (activity?: LeadActivity) => void;
  onClose?: () => void; 
}

const ActivityForm: React.FC<ActivityFormProps> = ({ leadId, title, onSuccess, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "note", // Default activity type
    description: "",
    scheduled_at: null as Date | null,
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create the new activity
      const newActivity = await addLeadActivity({
        lead_id: leadId,
        type: formData.type,
        description: formData.description,
        scheduled_at: formData.scheduled_at ? formData.scheduled_at.toISOString() : null,
      });
      
      // Call the success callback with the new activity
      onSuccess(newActivity);
      
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (key: string, value: string | Date | null) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">نوع النشاط</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => handleChange('type', value)}
        >
          <SelectTrigger id="type">
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
        <Label htmlFor="description">التفاصيل</Label>
        <Textarea 
          id="description" 
          value={formData.description} 
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="أدخل تفاصيل النشاط"
          required 
        />
      </div>
      
      {formData.type !== "note" && (
        <div>
          <Label htmlFor="scheduled_at">موعد التنفيذ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-right font-normal",
                  !formData.scheduled_at && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formData.scheduled_at ? (
                  format(formData.scheduled_at, "PPP", { locale: ar })
                ) : (
                  "اختر تاريخ"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.scheduled_at || undefined}
                onSelect={(date) => handleChange('scheduled_at', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        {onClose && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جاري الحفظ..." : "إضافة النشاط"}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
