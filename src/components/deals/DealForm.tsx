
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { createDeal } from "@/services/dealsService";
import type { Deal } from "@/services/dealsService";

interface DealFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const DealForm: React.FC<DealFormProps> = ({ onCancel, onSave }) => {
  const [expectedCloseDate, setExpectedCloseDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState<Partial<Deal>>({
    name: '',
    company_id: null,
    contact_id: null,
    value: null,
    stage: '',
    description: null,
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (field: keyof Deal, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.stage) {
      return; // وقف التقديم إذا كانت الحقول المطلوبة غير مملوءة
    }
    
    setIsSubmitting(true);
    
    try {
      const dealToCreate = {
        ...formData,
        expected_close_date: expectedCloseDate ? expectedCloseDate.toISOString() : null
      } as Omit<Deal, 'id' | 'created_at' | 'updated_at'>;
      
      const result = await createDeal(dealToCreate);
      
      if (result) {
        onSave();
      }
    } catch (error) {
      console.error("خطأ في إنشاء الصفقة:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">اسم الصفقة</Label>
          <Input 
            id="name" 
            placeholder="أدخل اسم الصفقة" 
            className="mt-1" 
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">الشركة</Label>
            <Select 
              value={formData.company_id || ''}
              onValueChange={(value) => handleInputChange('company_id', value)}
            >
              <SelectTrigger className="mt-1" id="company">
                <SelectValue placeholder="اختر الشركة" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الشركات</SelectLabel>
                  <SelectItem value="comp1">شركة التقنية الحديثة</SelectItem>
                  <SelectItem value="comp2">مستشفى النور</SelectItem>
                  <SelectItem value="comp3">مدارس المستقبل</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contact">جهة الاتصال</Label>
            <Select
              value={formData.contact_id || ''}
              onValueChange={(value) => handleInputChange('contact_id', value)}
            >
              <SelectTrigger className="mt-1" id="contact">
                <SelectValue placeholder="اختر جهة الاتصال" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>جهات الاتصال</SelectLabel>
                  <SelectItem value="contact1">أحمد محمد</SelectItem>
                  <SelectItem value="contact2">فاطمة خالد</SelectItem>
                  <SelectItem value="contact3">محمد سامي</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="value">قيمة الصفقة</Label>
            <div className="relative mt-1">
              <Input 
                id="value" 
                type="number" 
                placeholder="0" 
                className="pl-16 pr-4"
                value={formData.value || ''}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || null)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-l">
                <span className="text-gray-500">ر.س</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="stage">مرحلة الصفقة</Label>
            <Select 
              required
              value={formData.stage || ''}
              onValueChange={(value) => handleInputChange('stage', value)}
            >
              <SelectTrigger className="mt-1" id="stage">
                <SelectValue placeholder="اختر المرحلة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qualified">مؤهل</SelectItem>
                <SelectItem value="proposal">تم تقديم عرض</SelectItem>
                <SelectItem value="negotiation">تفاوض</SelectItem>
                <SelectItem value="closed_won">مغلق (مربوح)</SelectItem>
                <SelectItem value="closed_lost">مغلق (خسارة)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>تاريخ الإغلاق المتوقع</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-right"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {expectedCloseDate ? (
                    format(expectedCloseDate, "PPP", { locale: ar })
                  ) : (
                    <span>اختر تاريخاً</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expectedCloseDate}
                  onSelect={setExpectedCloseDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="owner">مسؤول الصفقة</Label>
          <Select>
            <SelectTrigger className="mt-1" id="owner">
              <SelectValue placeholder="اختر المسؤول" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>فريق المبيعات</SelectLabel>
                <SelectItem value="user1">محمد أحمد</SelectItem>
                <SelectItem value="user2">سارة خالد</SelectItem>
                <SelectItem value="user3">فهد العمري</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">وصف الصفقة</Label>
          <Textarea
            id="description"
            placeholder="أدخل تفاصيل الصفقة والملاحظات"
            className="mt-1"
            rows={3}
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ الصفقة'}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;
