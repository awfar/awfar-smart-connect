
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
import { createTask, Task } from '@/services/tasks';
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { ar } from 'date-fns/locale';

export interface TaskFormProps {
  leadId: string;
  onSuccess: (task?: Task) => void;
  onClose?: () => void; 
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  leadId, 
  onSuccess, 
  onClose 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as Task['status'],
    priority: "medium" as Task['priority'],
    due_date: null as Date | null,
    lead_id: leadId,
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the new task
      const newTask = await createTask({
        ...formData,
        due_date: formData.due_date ? formData.due_date.toISOString() : null,
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: null,
        lead_id: leadId,
      });
      
      // Call the success callback with the new task
      onSuccess(newTask || undefined);
      
    } catch (error) {
      console.error("Error adding task:", error);
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
        <Label htmlFor="title">عنوان المهمة</Label>
        <Input 
          id="title" 
          value={formData.title} 
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="أدخل عنوان المهمة"
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="description">التفاصيل</Label>
        <Textarea 
          id="description" 
          value={formData.description} 
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="أدخل تفاصيل المهمة"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">الأولوية</Label>
          <Select 
            value={formData.priority} 
            onValueChange={(value) => handleChange('priority', value as Task['priority'])}
            disabled={isSubmitting}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="اختر الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">الحالة</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleChange('status', value as Task['status'])}
            disabled={isSubmitting}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">معلقة</SelectItem>
              <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
              <SelectItem value="completed">مكتملة</SelectItem>
              <SelectItem value="cancelled">ملغاة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="due_date">موعد الاستحقاق</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-right font-normal",
                !formData.due_date && "text-muted-foreground"
              )}
              disabled={isSubmitting}
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {formData.due_date ? (
                format(formData.due_date, "PPP", { locale: ar })
              ) : (
                "اختر تاريخ"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.due_date || undefined}
              onSelect={(date) => handleChange('due_date', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
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
        <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الإضافة...
            </>
          ) : "إضافة المهمة"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
