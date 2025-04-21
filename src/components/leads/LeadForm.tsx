
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useLeadForm } from "@/hooks/leads/useLeadForm";
import { Lead } from "@/services/leads/types";
import { createLead, updateLead } from "@/services/leads/api";

export interface LeadFormProps {
  lead?: Lead;
  onClose: () => void;
  onSuccess: (lead?: Lead) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose, onSuccess }) => {
  const {
    formData,
    setFormData,
    options,
    isLoading,
    formErrors,
    handleChange,
    handleSelectChange,
    validateForm,
  } = useLeadForm(lead);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      let result: Lead | null = null;

      if (lead?.id) {
        // Update existing lead
        result = await updateLead({
          ...formData,
          id: lead.id,
        });
      } else {
        // Create new lead
        result = await createLead(formData);
      }

      if (result) {
        onSuccess(result);
      } else {
        throw new Error("Failed to save lead");
      }
    } catch (error) {
      console.error("Error saving lead:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium mb-1">الاسم الأول</label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            placeholder="أدخل الاسم الأول"
            required
            className="w-full"
            error={formErrors.first_name}
          />
          {formErrors.first_name && (
            <p className="text-xs text-red-500 mt-1">{formErrors.first_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium mb-1">اسم العائلة</label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            placeholder="أدخل اسم العائلة"
            required
            className="w-full"
            error={formErrors.last_name}
          />
          {formErrors.last_name && (
            <p className="text-xs text-red-500 mt-1">{formErrors.last_name}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="example@company.com"
          required
          className="w-full"
          error={formErrors.email}
        />
        {formErrors.email && (
          <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">رقم الهاتف</label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          placeholder="05xxxxxxxx"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">الشركة</label>
          <Input
            id="company"
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
            placeholder="اسم الشركة"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium mb-1">المنصب</label>
          <Input
            id="position"
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
            placeholder="المنصب الوظيفي"
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">المرحلة</label>
          <Select
            name="status"
            value={formData.status || "جديد"}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المرحلة" />
            </SelectTrigger>
            <SelectContent>
              {options.stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium mb-1">المصدر</label>
          <Select
            name="source"
            value={formData.source || ""}
            onValueChange={(value) => handleSelectChange("source", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المصدر" />
            </SelectTrigger>
            <SelectContent>
              {options.sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">الدولة</label>
          <Select
            name="country"
            value={formData.country || ""}
            onValueChange={(value) => handleSelectChange("country", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الدولة" />
            </SelectTrigger>
            <SelectContent>
              {options.countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium mb-1">القطاع</label>
          <Select
            name="industry"
            value={formData.industry || ""}
            onValueChange={(value) => handleSelectChange("industry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر القطاع" />
            </SelectTrigger>
            <SelectContent>
              {options.industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">ملاحظات</label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="اكتب ملاحظاتك هنا..."
          rows={3}
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={submitting}
        >
          إلغاء
        </Button>
        
        <Button 
          type="submit" 
          disabled={submitting || isLoading}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : lead?.id ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
