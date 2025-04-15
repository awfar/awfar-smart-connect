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
          console.log("Loaded companies:", companyOpts);
        } else {
          console.error("Companies data is not an array:", companies);
          // Initialize with empty array
          setCompanyOptions([]);
          toast.error("فشل تحميل قائمة الشركات: البيانات المستلمة غير صالحة");
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
        Array.isArray(companyOptions) && 
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
    
    // Check if the company already exists in options
    if (!companyOptions.some(opt => opt.value === companyName)) {
      setCompanyOptions(prevOptions => [...prevOptions, newOption]);
    }
    
    console.log("Added new company to options:", newOption);
    console.log("Setting company value in form:", companyName);
    
    // Select the new company in the form
    handleSelectChange("company", companyName);
  };

  // Safe access to ensure options never cause "Array.from" errors
  const getCountries = () => Array.isArray(options.countries) ? options.countries : [];
  const getIndustries = () => Array.isArray(options.industries) ? options.industries : [];
  const getStages = () => Array.isArray(options.stages) ? options.stages : ['جديد'];
  const getSources = () => Array.isArray(options.sources) ? options.sources : [];
  const getOwners = () => Array.isArray(options.owners) ? options.owners : [];

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
          options={companyOptions || []}
          value={formData.company || ''}
          onValueChange={(value) => handleSelectChange("company", value)}
          placeholder="اختر أو اكتب اسم الشركة"
          emptyMessage={loadCompanyError ? loadCompanyError : "لم يتم العثور على نتائج"}
          disableCreate={false}
          onCreateNew={() => setIsAddCompanyOpen(true)}
          createNewLabel="إضافة شركة جديدة"
          disabled={isLoadingCompanies}
          isLoading={isLoadingCompanies}
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
              {getCountries().map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
              {getCountries().length === 0 && (
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
              {getIndustries().map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
              {getIndustries().length === 0 && (
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
              {getStages().map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
              {getStages().length === 0 && (
                <SelectItem value="new">جديد</SelectItem>
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
              {getSources().map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
              {getSources().length === 0 && (
                <SelectItem value="no-sources" disabled>لا توجد مصادر متاحة</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="assigned_to">مسؤول</Label>
        <Select 
          value={formData.assigned_to || ''} 
          onValueChange={(value) => handleSelectChange("assigned_to", value)}
        >
          <SelectTrigger id="assigned_to">
            <SelectValue placeholder="اختر المسؤول" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">غير مخصص</SelectItem>
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
