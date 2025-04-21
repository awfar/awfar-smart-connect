
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ar } from "date-fns/locale";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LeadActivityInput, addLeadActivity } from "@/services/leads";

export interface ActivityFormProps {
  leadId: string;
  onSuccess: (activity?: any) => void;
  onClose?: () => void;
  title?: string; // Made optional to handle existing props
}

const ActivityForm: React.FC<ActivityFormProps> = ({ leadId, onSuccess, onClose, title = "إضافة نشاط جديد" }) => {
  const [activityType, setActivityType] = useState<string>("note");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error("يرجى إدخال وصف النشاط");
      return;
    }
    
    setIsLoading(true);
    try {
      const activity: LeadActivityInput = {
        lead_id: leadId,
        type: activityType as any,
        description,
        scheduled_at: date ? date.toISOString() : undefined
      };
      
      const result = await addLeadActivity(activity);
      
      toast.success("تم إضافة النشاط بنجاح");
      onSuccess(result);
      if (onClose) onClose();
    } catch (error) {
      console.error("خطأ في إضافة النشاط:", error);
      toast.error("حدث خطأ أثناء إضافة النشاط");
    } finally {
      setIsLoading(false);
    }
  };
  
  const needsScheduling = ['call', 'meeting', 'task', 'email', 'whatsapp'].includes(activityType);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium mb-3 block">نوع النشاط</Label>
          <RadioGroup 
            defaultValue="note"
            value={activityType}
            onValueChange={setActivityType}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="note" id="note" />
              <Label htmlFor="note" className="mr-2">ملاحظة</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="call" id="call" />
              <Label htmlFor="call" className="mr-2">مكالمة</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="meeting" id="meeting" />
              <Label htmlFor="meeting" className="mr-2">اجتماع</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="task" id="task" />
              <Label htmlFor="task" className="mr-2">مهمة</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="mr-2">بريد</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp" className="mr-2">واتساب</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">
            {activityType === 'note' ? 'الملاحظة' :
             activityType === 'task' ? 'وصف المهمة' :
             activityType === 'call' ? 'موضوع المكالمة' :
             activityType === 'meeting' ? 'موضوع الاجتماع' :
             activityType === 'email' ? 'موضوع البريد' :
             activityType === 'whatsapp' ? 'موضوع الرسالة' : 'الوصف'}
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              activityType === 'note' ? 'أدخل الملاحظة هنا...' :
              activityType === 'task' ? 'أدخل وصف المهمة هنا...' :
              activityType === 'call' ? 'أدخل موضوع المكالمة هنا...' :
              activityType === 'meeting' ? 'أدخل موضوع الاجتماع هنا...' :
              activityType === 'email' ? 'أدخل موضوع البريد هنا...' :
              activityType === 'whatsapp' ? 'أدخل موضوع الرسالة هنا...' : 'أدخل الوصف هنا...'
            }
            className="min-h-[100px]"
          />
        </div>
        
        {needsScheduling && (
          <div className="space-y-2">
            <Label htmlFor="date">
              {activityType === 'task' ? 'تاريخ المهمة' :
               activityType === 'call' ? 'موعد المكالمة' :
               activityType === 'meeting' ? 'موعد الاجتماع' :
               activityType === 'email' ? 'موعد الإرسال' :
               activityType === 'whatsapp' ? 'موعد الإرسال' : 'التاريخ'}
            </Label>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ar }) : "اختر تاريخ..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ar}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'جاري الحفظ...' : 'إضافة النشاط'}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
