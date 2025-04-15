import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadFormOptions } from "@/hooks/useLeadForm";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanyQuickAddDialog from "@/components/companies/CompanyQuickAddDialog";
import { toast } from "sonner";

interface LeadFormFieldsProps {
  formData: any;
  formErrors: Record<string, string>;
  options: LeadFormOptions;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const LeadFormFields: React.FC<LeadFormFieldsProps> = ({
  formData,
  formErrors,
  options,
  handleChange,
  handleSelectChange
}) => {
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectChange("company", e.target.value);
  };

  const handleAddCompany = (companyName: string) => {
    if (!companyName) return;
    
    console.log("Setting company value in form:", companyName);
    
    handleSelectChange("company", companyName);
    toast.success("تم إضافة الشركة بنجاح");
  };

  const filterValidItems = (items: string[]): string[] => {
    return items.filter(item => typeof item === 'string' && item.trim() !== '');
  };

  const getCountries = () => filterValidItems(Array.isArray(options.countries) ? options.countries : []);
  const getIndustries = () => filterValidItems(Array.isArray(options.industries) ? options.industries : []);
  const getStages = () => filterValidItems(Array.isArray(options.stages) ? options.stages : ['جديد']);
  const getSources = () => filterValidItems(Array.isArray(options.sources) ? options.sources : []);
  const getOwners = () => Array.isArray(options.owners) ? options.owners.filter(owner => owner && owner.id && typeof owner.id === 'string' && owner.id.trim() !== '') : [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">الاسم الأول *</Label>
          <Input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            className={formErrors.first_name ? "border-red-500" : ""}
          />
          {formErrors.first_name && (
            <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="last_name">اسم العائلة *</Label>
          <Input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            className={formErrors.last_name ? "border-red-500" : ""}
          />
          {formErrors.last_name && (
            <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">البريد الإلكتروني *</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          className={formErrors.email ? "border-red-500" : ""}
        />
        {formErrors.email && (
          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="company" className="flex justify-between">
          <span>الشركة</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-5 text-xs text-primary"
            onClick={() => setIsAddCompanyOpen(true)}
          >
            <Plus className="h-3 w-3 ml-1" />
            إضافة شركة
          </Button>
        </Label>
        <Input
          type="text"
          id="company"
          value={formData.company || ''}
          onChange={handleCompanyChange}
          placeholder="اكتب اسم الشركة"
        />
      </div>

      <div>
        <Label htmlFor="position">المنصب</Label>
        <Input
          type="text"
          id="position"
          name="position"
          value={formData.position || ''}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">الدولة</Label>
          <Select 
            value={formData.country || ''} 
            onValueChange={(value) => handleSelectChange("country", value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="اختر الدولة" />
            </SelectTrigger>
            <SelectContent>
              {getCountries().length > 0 ? (
                getCountries().map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-options-available" disabled>
                  لا توجد خيارات متاحة
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="industry">القطاع</Label>
          <Select 
            value={formData.industry || ''} 
            onValueChange={(value) => handleSelectChange("industry", value)}
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="اختر القطاع" />
            </SelectTrigger>
            <SelectContent>
              {getIndustries().length > 0 ? (
                getIndustries().map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-options-available" disabled>
                  لا توجد خيارات متاحة
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">المرحلة</Label>
          <Select 
            value={formData.status || 'جديد'} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="اختر المرحلة" />
            </SelectTrigger>
            <SelectContent>
              {getStages().length > 0 ? (
                getStages().map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="جديد">جديد</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="source">المصدر</Label>
          <Select 
            value={formData.source || ''} 
            onValueChange={(value) => handleSelectChange("source", value)}
          >
            <SelectTrigger id="source">
              <SelectValue placeholder="اختر المصدر" />
            </SelectTrigger>
            <SelectContent>
              {getSources().length > 0 ? (
                getSources().map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-source-available" disabled>
                  لا توجد مصادر متاحة
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="assigned_to">مسؤول</Label>
        <Select 
          value={formData.assigned_to || 'not-assigned'} 
          onValueChange={(value) => handleSelectChange("assigned_to", value)}
        >
          <SelectTrigger id="assigned_to">
            <SelectValue placeholder="اختر المسؤول" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-assigned">غير مخصص</SelectItem>
            {getOwners().map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={4}
        />
      </div>
      
      <CompanyQuickAddDialog 
        isOpen={isAddCompanyOpen} 
        onOpenChange={setIsAddCompanyOpen}
        onSuccess={handleAddCompany}
      />
    </>
  );
};

export default LeadFormFields;
