
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Mail, Phone, Building, User, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Lead, createLead, updateLead } from "@/services/leadsService";

interface LeadFormProps {
  onClose: () => void;
  onSuccess: (lead: Lead) => void;
  initialData?: Lead;
  title: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ onClose, onSuccess, initialData, title }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    company: initialData?.company || "",
    position: initialData?.position || "",
    country: initialData?.country || "",
    industry: initialData?.industry || "",
    stage: initialData?.stage || "جديد",
    source: initialData?.source || "موقع الويب",
    notes: initialData?.notes || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof Partial<Lead>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      if (initialData?.id) {
        result = await updateLead(initialData.id, formData);
      } else {
        result = await createLead(formData);
      }
      
      if (result) {
        onSuccess(result);
      } else {
        throw new Error("Failed to save lead");
      }
      
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error(initialData ? "فشل تحديث العميل المحتمل" : "فشل إضافة العميل المحتمل");
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">الاسم الأول</Label>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input 
                  id="first_name" 
                  value={formData.first_name} 
                  onChange={(e) => handleChange("first_name", e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">الاسم الأخير</Label>
              <div className="flex items-center">
                <Input 
                  id="last_name" 
                  value={formData.last_name} 
                  onChange={(e) => handleChange("last_name", e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input 
                id="phone" 
                value={formData.phone || ""} 
                onChange={(e) => handleChange("phone", e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">الشركة</Label>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input 
                  id="company" 
                  value={formData.company || ""} 
                  onChange={(e) => handleChange("company", e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">المنصب</Label>
              <Input 
                id="position" 
                value={formData.position || ""} 
                onChange={(e) => handleChange("position", e.target.value)} 
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
              <Label htmlFor="industry">القطاع</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">المرحلة</Label>
              <Select 
                value={formData.stage} 
                onValueChange={(value) => handleChange("stage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المرحلة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="جديد">جديد</SelectItem>
                  <SelectItem value="مؤهل">مؤهل</SelectItem>
                  <SelectItem value="فرصة">فرصة</SelectItem>
                  <SelectItem value="عرض سعر">عرض سعر</SelectItem>
                  <SelectItem value="تفاوض">تفاوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">المصدر</Label>
              <Select 
                value={formData.source || ""} 
                onValueChange={(value) => handleChange("source", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المصدر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="موقع الويب">موقع الويب</SelectItem>
                  <SelectItem value="وسائل التواصل الاجتماعي">وسائل التواصل الاجتماعي</SelectItem>
                  <SelectItem value="إحالة">إحالة</SelectItem>
                  <SelectItem value="معرض">معرض</SelectItem>
                  <SelectItem value="مكالمة مبيعات">مكالمة مبيعات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea 
              id="notes" 
              rows={3}
              value={formData.notes || ""} 
              onChange={(e) => handleChange("notes", e.target.value)} 
            />
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

export default LeadForm;
