
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Lead } from '@/services/leads/types';

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (updatedLead: Lead) => void;
  onCancel: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Lead>>(lead || {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    country: '',
    industry: '',
    source: '',
    status: 'جديد',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Lead);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">الاسم الأول</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">اسم العائلة</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">الشركة</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">المسمى الوظيفي</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">الدولة</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">القطاع</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">المصدر</Label>
          <Select 
            value={formData.source} 
            onValueChange={(value) => handleSelectChange('source', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المصدر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="موقع الويب">موقع الويب</SelectItem>
              <SelectItem value="وسائل التواصل الاجتماعي">وسائل التواصل الاجتماعي</SelectItem>
              <SelectItem value="إحالة">إحالة</SelectItem>
              <SelectItem value="مكالمة هاتفية">مكالمة هاتفية</SelectItem>
              <SelectItem value="معرض">معرض</SelectItem>
              <SelectItem value="أخرى">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">الحالة</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="جديد">جديد</SelectItem>
              <SelectItem value="جاري التواصل">جاري التواصل</SelectItem>
              <SelectItem value="مؤهل">مؤهل</SelectItem>
              <SelectItem value="غير مؤهل">غير مؤهل</SelectItem>
              <SelectItem value="تم التحويل">تم التحويل</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          حفظ
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
