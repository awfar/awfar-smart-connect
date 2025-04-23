
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { addLeadActivity } from "@/services/leads";
import { LeadActivityType } from "@/services/leads/types";
import { toast } from "sonner";

interface ActivityFormProps {
  leadId: string;
  onSuccess?: (activity?: any) => void;
  onClose?: () => void;
  initialType?: LeadActivityType;
  title?: string;
  activityType?: LeadActivityType;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  leadId,
  onSuccess,
  onClose,
  initialType = 'note',
  activityType,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState<LeadActivityType>(activityType || initialType);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [scheduledDate, setScheduledDate] = useState<string>('');

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Prepare the activity data
      const activityData = {
        lead_id: leadId,
        type: selectedActivityType,
        description: data.description,
        scheduled_at: scheduledDate ? new Date(scheduledDate).toISOString() : undefined
      };

      // Call the API to add the activity
      const newActivity = await addLeadActivity(activityData);

      if (onSuccess) {
        onSuccess(newActivity);
      }

      toast.success("تم إضافة النشاط بنجاح");
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("فشل في إضافة النشاط");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">نوع النشاط</label>
        <Select value={selectedActivityType} onValueChange={(value) => setSelectedActivityType(value as LeadActivityType)}>
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع النشاط" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">ملاحظة</SelectItem>
            <SelectItem value="call">مكالمة</SelectItem>
            <SelectItem value="meeting">اجتماع</SelectItem>
            <SelectItem value="email">بريد إلكتروني</SelectItem>
            <SelectItem value="whatsapp">واتساب</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الوصف</label>
        <textarea
          className="w-full border rounded-md px-3 py-2 min-h-[100px]"
          {...register('description', { required: "الوصف مطلوب" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message as string}
          </p>
        )}
      </div>

      {(selectedActivityType === 'call' || selectedActivityType === 'meeting') && (
        <div>
          <label className="block text-sm font-medium mb-1">موعد مجدول</label>
          <input
            type="datetime-local"
            className="w-full border rounded-md px-3 py-2"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="ml-2"
          >
            إلغاء
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="ml-2" />
              جار الحفظ...
            </>
          ) : (
            'حفظ'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
