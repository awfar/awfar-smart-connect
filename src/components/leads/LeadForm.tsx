
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  createLead, 
  updateLead, 
  getLeadSources, 
  getIndustries, 
  getLeadStages,
  getCountries,
  getSalesOwners,
  Lead 
} from "@/services/leads";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    position: lead?.position || "",
    notes: lead?.notes || "",
    assigned_to: lead?.assigned_to || "",
    created_at: lead?.created_at || new Date().toISOString(),
    updated_at: lead?.updated_at || new Date().toISOString(),
  });

  // State for dropdown options
  const [sources, setSources] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [owners, setOwners] = useState<{id: string, name: string}[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch options for dropdown menus
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const [sourcesData, industriesData, stagesData, countriesData, ownersData] = await Promise.all([
          getLeadSources(),
          getIndustries(),
          getLeadStages(),
          getCountries(),
          getSalesOwners()
        ]);
        
        setSources(sourcesData);
        setIndustries(industriesData);
        setStages(stagesData);
        setCountries(countriesData);
        setOwners(ownersData);
      } catch (error) {
        console.error("Error fetching form options:", error);
        toast.error("فشل في تحميل خيارات النموذج");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mr-2 text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">الاسم الأول *</Label>
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
          <Label htmlFor="last_name">اسم العائلة *</Label>
          <Input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">البريد الإلكتروني *</Label>
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
          value={formData.phone || ''}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">الشركة</Label>
          <Input
            type="text"
            id="company"
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stage">المرحلة</Label>
          <Select 
            value={formData.stage || 'جديد'} 
            onValueChange={(value) => handleSelectChange("stage", value)}
          >
            <SelectTrigger id="stage">
              <SelectValue placeholder="اختر المرحلة" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
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
              {sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
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
            {owners.map((owner) => (
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
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          إلغاء
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الحفظ..." : editMode ? "تحديث" : "إضافة"}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
