
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Building, Globe, MapPin, User, Users } from "lucide-react";
import { toast } from "sonner";
import { Company } from "@/services/companiesService";

interface CompanyFormProps {
  onClose: () => void;
  onSubmit: (company: Partial<Company>) => Promise<void>;
  initialData?: Company;
  title: string;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: initialData?.name || "",
    industry: initialData?.industry || "",
    size: initialData?.size || "صغيرة (>50 موظف)",
    country: initialData?.country || "",
    city: initialData?.city || "",
    website: initialData?.website || "",
    status: initialData?.status || "محتمل",
    subscription: initialData?.subscription || "تجريبية",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof Partial<Company>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      toast.success(initialData ? "تم تحديث الشركة بنجاح" : "تم إضافة الشركة بنجاح");
      onClose();
    } catch (error) {
      console.error("Error submitting company:", error);
      toast.error(initialData ? "فشل تحديث الشركة" : "فشل إضافة الشركة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الشركة</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">الموقع الإلكتروني</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input 
                id="website" 
                value={formData.website} 
                onChange={(e) => handleChange("website", e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">الدولة</Label>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input 
                  id="country" 
                  value={formData.country} 
                  onChange={(e) => handleChange("country", e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">المدينة</Label>
              <div className="flex items-center">
                <Input 
                  id="city" 
                  value={formData.city} 
                  onChange={(e) => handleChange("city", e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">القطاع</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select 
                value={formData.industry} 
                onValueChange={(value) => handleChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القطاع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="تكنولوجيا المعلومات">تكنولوجيا المعلومات</SelectItem>
                  <SelectItem value="مطاعم ومقاهي">مطاعم ومقاهي</SelectItem>
                  <SelectItem value="تجزئة">تجزئة</SelectItem>
                  <SelectItem value="الرعاية الصحية">الرعاية الصحية</SelectItem>
                  <SelectItem value="التعليم">التعليم</SelectItem>
                  <SelectItem value="الخدمات المالية">الخدمات المالية</SelectItem>
                  <SelectItem value="البناء والعقارات">البناء والعقارات</SelectItem>
                  <SelectItem value="آخر">آخر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">حجم الشركة</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select 
                value={formData.size} 
                onValueChange={(value) => handleChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحجم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="صغيرة (>50 موظف)">صغيرة (أقل من 50 موظف)</SelectItem>
                  <SelectItem value="متوسطة (50-200 موظف)">متوسطة (50-200 موظف)</SelectItem>
                  <SelectItem value="كبيرة (>200 موظف)">كبيرة (أكثر من 200 موظف)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عميل">عميل</SelectItem>
                  <SelectItem value="محتمل">محتمل</SelectItem>
                  <SelectItem value="فرصة">فرصة</SelectItem>
                  <SelectItem value="سابق">سابق</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscription">الباقة</Label>
              <Select 
                value={formData.subscription} 
                onValueChange={(value) => handleChange("subscription", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الباقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="أساسية">أساسية</SelectItem>
                  <SelectItem value="متقدمة">متقدمة</SelectItem>
                  <SelectItem value="احترافية">احترافية</SelectItem>
                  <SelectItem value="تجريبية">تجريبية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>إلغاء</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "جاري الحفظ..." : initialData ? "تحديث" : "إضافة"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CompanyForm;
