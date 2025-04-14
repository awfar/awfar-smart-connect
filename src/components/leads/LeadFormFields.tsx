
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadFormOptions } from "@/hooks/useLeadForm";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanyQuickAddDialog from "@/components/companies/CompanyQuickAddDialog";
import { getCompanies } from "@/services/companiesService";
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
  const [companyOptions, setCompanyOptions] = useState<{label: string, value: string}[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [loadCompanyError, setLoadCompanyError] = useState<string | null>(null);
  
  // Load companies when component mounts
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        setLoadCompanyError(null);
        const companies = await getCompanies();
        
        // Make sure companies is an array before mapping
        if (Array.isArray(companies)) {
          const companyOpts = companies.map(c => ({
            label: c.name,
            value: c.name
          }));
          setCompanyOptions(companyOpts);
        } else {
          console.error("Companies data is not an array:", companies);
          setCompanyOptions([]);
        }
      } catch (error) {
        console.error("Error loading companies:", error);
        setLoadCompanyError("لم نتمكن من تحميل قائمة الشركات");
        toast.error("لم نتمكن من تحميل قائمة الشركات");
        // Always set an empty array as fallback
        setCompanyOptions([]);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    
    loadCompanies();
  }, []);

  // Add the company selected in the form to the options if it doesn't exist yet
  useEffect(() => {
    if (formData.company && 
        companyOptions.length > 0 && 
        !companyOptions.some(c => c.value === formData.company)) {
      setCompanyOptions(prev => [
        ...prev,
        { label: formData.company, value: formData.company }
      ]);
    }
  }, [formData.company, companyOptions]);

  const handleAddCompany = (companyName: string) => {
    if (!companyName) return;
    
    // Add the new company to company options
    const newOption = { label: companyName, value: companyName };
    
    // Make sure company doesn't already exist
    if (!companyOptions.some(opt => opt.value === companyName)) {
      setCompanyOptions(prev => [...prev, newOption]);
    }
    
    // Select the new company in the form
    handleSelectChange("company", companyName);
    
    // Show success message
    toast.success(`تمت إضافة الشركة "${companyName}" بنجاح`);
  };

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
        <Autocomplete
          options={companyOptions}
          value={formData.company || ''}
          onValueChange={(value) => handleSelectChange("company", value)}
          placeholder={isLoadingCompanies ? "جاري التحميل..." : "اختر أو اكتب اسم الشركة"}
          emptyMessage={loadCompanyError ? loadCompanyError : "لم يتم العثور على نتائج"}
          disableCreate={false}
          onCreateNew={() => setIsAddCompanyOpen(true)}
          createNewLabel="إضافة شركة جديدة"
          disabled={isLoadingCompanies}
        />
        {isLoadingCompanies && (
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            جاري تحميل قائمة الشركات...
          </div>
        )}
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
              {Array.isArray(options.countries) && options.countries.length > 0 ? options.countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              )) : (
                <SelectItem value="no-countries" disabled>لا توجد دول متاحة</SelectItem>
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
              {Array.isArray(options.industries) && options.industries.length > 0 ? options.industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              )) : (
                <SelectItem value="no-industries" disabled>لا توجد قطاعات متاحة</SelectItem>
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
              {Array.isArray(options.stages) && options.stages.length > 0 ? options.stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              )) : (
                <SelectItem value="new" disabled>جديد</SelectItem>
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
              {Array.isArray(options.sources) && options.sources.length > 0 ? options.sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              )) : (
                <SelectItem value="no-sources" disabled>لا توجد مصادر متاحة</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="assigned_to">المسؤول</Label>
        <Select 
          value={formData.assigned_to || ''} 
          onValueChange={(value) => handleSelectChange("assigned_to", value)}
        >
          <SelectTrigger id="assigned_to">
            <SelectValue placeholder="اختر المسؤول" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">غير مخصص</SelectItem>
            {Array.isArray(options.owners) && options.owners.length > 0 ? options.owners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.name}
              </SelectItem>
            )) : null}
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
