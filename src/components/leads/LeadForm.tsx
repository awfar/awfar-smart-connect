import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createLead, updateLead } from "@/services/leadsService";
import { Lead } from "@/types/leads";
import { toast } from "sonner";

interface LeadFormProps {
  lead?: Lead;
  onClose?: () => void;
  onSuccess?: (lead: Lead) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose, onSuccess }) => {
  const editMode = !!lead;

  const [formData, setFormData] = useState<Omit<Lead, "id">>({
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",
    company: lead?.company || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    country: lead?.country || "",
    industry: lead?.industry || "",
    stage: lead?.stage || "جديد",
    source: lead?.source || "",
    notes: lead?.notes || "",
    created_at: lead?.created_at || new Date().toISOString(),
    updated_at: lead?.updated_at || new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (editMode && lead) {
        const updatedLead = await updateLead({
          ...formData,
          id: lead.id,
        });
        toast.success("تم تحديث بيانات العميل المحتمل بنجاح");
        onSuccess?.(updatedLead);
      } else {
        const newLead = await createLead(formData);
        toast.success("تم إضافة عميل محتمل جديد بنجاح");
        onSuccess?.(newLead);
      }
      onClose?.();
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="first_name">الاسم الأول</Label>
        <Input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="last_name">اسم العائلة</Label>
        <Input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="company">الشركة</Label>
        <Input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="country">الدولة</Label>
        <Input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="industry">القطاع</Label>
        <Input
          type="text"
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="stage">المرحلة</Label>
        <Select onValueChange={(value) => handleSelectChange("stage", value)}>
          <SelectTrigger>
            <SelectValue placeholder="اختر المرحلة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="جديد">جديد</SelectItem>
            <SelectItem value="مؤهل">مؤهل</SelectItem>
            <SelectItem value="عرض سعر">عرض سعر</SelectItem>
            <SelectItem value="تفاوض">تفاوض</SelectItem>
            <SelectItem value="مغلق">مغلق</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="source">المصدر</Label>
        <Input
          type="text"
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جاري الحفظ..." : "حفظ"}
      </Button>
    </form>
  );
};

export default LeadForm;
