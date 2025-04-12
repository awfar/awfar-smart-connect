
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface CompanyFormProps {
  onCancel: () => void;
  onSave: (company: {
    name: string;
    industry: string;
    type: string;
    country: string;
    phone: string;
    website: string;
    address: string;
  }) => void;
  initialData?: {
    name: string;
    industry: string;
    type: string;
    country: string;
    phone: string;
    website: string;
    address: string;
  };
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onCancel, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [industry, setIndustry] = useState(initialData?.industry || '');
  const [type, setType] = useState(initialData?.type || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [website, setWebsite] = useState(initialData?.website || '');
  const [address, setAddress] = useState(initialData?.address || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !industry || !type || !country) {
      toast.error("الرجاء إكمال جميع الحقول المطلوبة");
      return;
    }
    
    onSave({
      name,
      industry,
      type,
      country,
      phone,
      website,
      address
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">اسم الشركة</Label>
          <Input 
            id="name" 
            placeholder="أدخل اسم الشركة" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">القطاع</Label>
          <Select value={industry} onValueChange={setIndustry} required>
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
          <Select value={type} onValueChange={setType} required>
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
          <Select value={country} onValueChange={setCountry} required>
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
          <Input 
            id="phone" 
            placeholder="أدخل رقم هاتف الشركة"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">الموقع الإلكتروني</Label>
          <Input 
            id="website" 
            placeholder="أدخل رابط الموقع الإلكتروني"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">العنوان</Label>
          <Textarea 
            id="address" 
            placeholder="أدخل عنوان الشركة" 
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>
      
      <div className="pt-4 border-t flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>إلغاء</Button>
        <Button type="submit">حفظ</Button>
      </div>
    </form>
  );
};

export default CompanyForm;
