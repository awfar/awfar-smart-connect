
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lead } from "@/services/leads/types";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';

interface EditLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSuccess: (updatedLead: Lead) => void;
}

const EditLeadDialog: React.FC<EditLeadDialogProps> = ({
  isOpen,
  onOpenChange,
  lead,
  onSuccess
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      first_name: lead?.first_name || '',
      last_name: lead?.last_name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      company: lead?.company || '',
      position: lead?.position || '',
      country: lead?.country || '',
      industry: lead?.industry || '',
      status: lead?.status || '',
      source: lead?.source || '',
      notes: lead?.notes || '',
    }
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Create updated lead object
      const updatedLead: Lead = {
        ...lead,
        ...data
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess(updatedLead);
      toast.success("تم تحديث بيانات العميل المحتمل بنجاح");
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error("حدث خطأ أثناء تحديث بيانات العميل المحتمل");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">تعديل بيانات العميل المحتمل</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">الاسم الأول</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('first_name', { required: 'الاسم الأول مطلوب' })}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name.message?.toString()}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">اسم العائلة</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('last_name', { required: 'اسم العائلة مطلوب' })}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name.message?.toString()}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('email', { required: 'البريد الإلكتروني مطلوب' })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message?.toString()}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">رقم الهاتف</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('phone')}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">الشركة</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('company')}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">المنصب</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('position')}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">الدولة</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('country')}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">القطاع</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('industry')}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">الحالة</label>
              <select
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('status')}
              >
                <option value="جديد">جديد</option>
                <option value="اتصال أولي">اتصال أولي</option>
                <option value="مؤهل">مؤهل</option>
                <option value="تفاوض">تفاوض</option>
                <option value="عرض سعر">عرض سعر</option>
                <option value="عميل">عميل</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">المصدر</label>
              <input
                className="w-full border rounded-md px-3 py-2 mt-1"
                {...register('source')}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">ملاحظات</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 mt-1 min-h-[100px]"
              {...register('notes')}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border rounded-md text-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {isSubmitting ? 'جار الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
