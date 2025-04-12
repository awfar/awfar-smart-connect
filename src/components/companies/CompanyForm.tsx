
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface CompanyFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onCancel, onSave }) => {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">اسم الشركة</Label>
          <Input id="name" placeholder="أدخل اسم الشركة" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">القطاع</Label>
          <Select>
            <SelectTrigger id="industry">
              <SelectValue placeholder="اختر قطاع الشركة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">تقنية المعلومات</SelectItem>
              <SelectItem value="healthcare">الرعاية الصحية</SelectItem>
              <SelectItem value="retail">التجزئة</SelectItem>
              <SelectItem value="education">التعليم</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">نوع الشركة</Label>
          <Select>
            <SelectTrigger id="type">
              <SelectValue placeholder="اختر نوع الشركة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">عميل</SelectItem>
              <SelectItem value="vendor">مورد</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">الدولة</Label>
          <Select>
            <SelectTrigger id="country">
              <SelectValue placeholder="اختر الدولة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sa">السعودية</SelectItem>
              <SelectItem value="ae">الإمارات</SelectItem>
              <SelectItem value="kw">الكويت</SelectItem>
              <SelectItem value="bh">البحرين</SelectItem>
              <SelectItem value="qa">قطر</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input id="phone" placeholder="أدخل رقم هاتف الشركة" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">الموقع الإلكتروني</Label>
          <Input id="website" placeholder="أدخل رابط الموقع الإلكتروني" />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">العنوان</Label>
          <Textarea id="address" placeholder="أدخل عنوان الشركة" rows={2} />
        </div>
      </div>
      
      <div className="pt-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>إلغاء</Button>
        <Button onClick={onSave}>حفظ</Button>
      </div>
    </form>
  );
};

export default CompanyForm;
