
import React, { useState, useEffect, ChangeEvent } from 'react';
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lead } from "@/services/leads/types";
import { useLeadForm } from '@/hooks/leads/useLeadForm';
import { Loader2 } from "lucide-react";

export interface LeadFormProps {
  lead?: Lead;
  onSuccess: (updatedLead?: Lead) => void;
  onCancel?: () => void;
  onClose?: () => void; // Added onClose prop to match expected props
  onSubmit?: (updatedLead: Lead) => void; // Added onSubmit prop to match expected props
}

const LeadForm: React.FC<LeadFormProps> = ({
  lead,
  onSuccess,
  onCancel,
  onClose, // Handle both onClose and onCancel
  onSubmit // Handle both onSubmit and onSuccess
}) => {
  const {
    formData,
    errors,
    isLoading,
    sourceOptions,
    stageOptions,
    countryOptions,
    industryOptions,
    ownerOptions,
    handleChange,
    handleSelectChange,
    validateForm,
    saveLead
  } = useLeadForm(lead);

  // Use either onClose or onCancel function
  const handleCancel = () => {
    if (onClose) onClose();
    if (onCancel) onCancel();
  };

  // Use either onSubmit or onSuccess function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("يرجى إدخال جميع الحقول المطلوبة");
      return;
    }
    
    try {
      const savedLead = await saveLead();
      if (savedLead) {
        toast.success(`تم ${lead ? 'تحديث' : 'إضافة'} العميل المحتمل بنجاح`);
        if (onSubmit) onSubmit(savedLead);
        onSuccess(savedLead);
      } 
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error(`فشل في ${lead ? 'تحديث' : 'إضافة'} العميل المحتمل`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="first_name">الاسم الأول</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="أدخل الاسم الأول"
            required
            className={errors.first_name ? "border-red-500" : ""}
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name}</p>
          )}
        </div>
        
        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="last_name">اسم العائلة</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="أدخل اسم العائلة"
            required
            className={errors.last_name ? "border-red-500" : ""}
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name}</p>
          )}
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@domain.com"
            required
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="+966 55 555 5555"
            className=""
          />
        </div>
        
        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">الشركة</Label>
          <Input
            id="company"
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
            placeholder="اسم الشركة"
            className=""
          />
        </div>
        
        {/* Position */}
        <div className="space-y-2">
          <Label htmlFor="position">المنصب</Label>
          <Input
            id="position"
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
            placeholder="المنصب الوظيفي"
            className=""
          />
        </div>
        
        {/* Source */}
        <div className="space-y-2">
          <Label htmlFor="source">المصدر</Label>
          <Select
            value={formData.source || ''}
            onValueChange={(value) => handleSelectChange('source', value)}
          >
            <SelectTrigger id="source" className="">
              <SelectValue placeholder="اختر المصدر" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Stage/Status */}
        <div className="space-y-2">
          <Label htmlFor="status">المرحلة</Label>
          <Select
            value={formData.status || ''}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger id="status" className="">
              <SelectValue placeholder="اختر المرحلة" />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">الدولة</Label>
          <Select
            value={formData.country || ''}
            onValueChange={(value) => handleSelectChange('country', value)}
          >
            <SelectTrigger id="country" className="">
              <SelectValue placeholder="اختر الدولة" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry">المجال</Label>
          <Select
            value={formData.industry || ''}
            onValueChange={(value) => handleSelectChange('industry', value)}
          >
            <SelectTrigger id="industry" className="">
              <SelectValue placeholder="اختر المجال" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Owner */}
        <div className="space-y-2">
          <Label htmlFor="assigned_to">المسؤول</Label>
          <Select
            value={formData.assigned_to || ''}
            onValueChange={(value) => handleSelectChange('assigned_to', value)}
          >
            <SelectTrigger id="assigned_to" className="">
              <SelectValue placeholder="اختر المسؤول" />
            </SelectTrigger>
            <SelectContent>
              {ownerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="أي ملاحظات إضافية..."
          className="min-h-[100px]"
        />
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
          disabled={isLoading}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : lead ? 'تحديث' : 'إضافة' }
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
