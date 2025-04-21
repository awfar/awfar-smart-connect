
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from "@/components/ui/date-picker";
import { addDays, addHours, format } from 'date-fns';

interface AppointmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess?: () => void;
}

const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  open,
  onClose,
  leadId,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(addHours(new Date(), 1));
  const [endDate, setEndDate] = useState<Date | undefined>(addHours(new Date(), 2));
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('الرجاء إدخال عنوان الموعد');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('الرجاء تحديد وقت البدء والانتهاء');
      return;
    }

    if (endDate <= startDate) {
      toast.error('يجب أن يكون وقت الانتهاء بعد وقت البدء');
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: user } = await supabase.auth.getUser();
      
      // استخدام الحقول المناسبة لجدول appointments
      const appointment = {
        title,
        description,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        location,
        client_id: leadId, // استخدام client_id كما هو مطلوب في قاعدة البيانات
        created_by: user.user?.id,
        status: 'scheduled'
      };

      const { error } = await supabase
        .from('appointments')
        .insert(appointment);

      if (error) throw error;

      toast.success('تم إضافة الموعد بنجاح');
      onSuccess?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('حدث خطأ أثناء إنشاء الموعد');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(addHours(new Date(), 1));
    setEndDate(addHours(new Date(), 2));
    setLocation('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة موعد جديد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الموعد</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الموعد"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف الموعد"
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label>وقت البدء</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="datetime-local"
                value={startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                className="flex-1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>وقت الانتهاء</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="datetime-local"
                value={endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                className="flex-1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">المكان</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="أدخل مكان الموعد"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الحفظ...' : 'إضافة موعد'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
