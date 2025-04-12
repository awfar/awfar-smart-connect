
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface CompanyFiltersProps {
  onApplyFilters: (filters: {
    industry?: string;
    country?: string;
    type?: string;
  }) => void;
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({ onApplyFilters }) => {
  const [industry, setIndustry] = useState<string>('all');
  const [country, setCountry] = useState<string>('all');
  const [type, setType] = useState<string>('all');

  const handleApplyFilters = () => {
    onApplyFilters({
      industry,
      country,
      type
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
      <div>
        <Label htmlFor="industry">القطاع</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger id="industry">
            <SelectValue placeholder="كل القطاعات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل القطاعات</SelectItem>
            <SelectItem value="tech">تقنية المعلومات</SelectItem>
            <SelectItem value="healthcare">الرعاية الصحية</SelectItem>
            <SelectItem value="retail">التجزئة</SelectItem>
            <SelectItem value="education">التعليم</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="country">الدولة</Label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger id="country">
            <SelectValue placeholder="كل الدول" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الدول</SelectItem>
            <SelectItem value="sa">السعودية</SelectItem>
            <SelectItem value="ae">الإمارات</SelectItem>
            <SelectItem value="kw">الكويت</SelectItem>
            <SelectItem value="bh">البحرين</SelectItem>
            <SelectItem value="qa">قطر</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="type">النوع</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="كل الأنواع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأنواع</SelectItem>
            <SelectItem value="customer">عميل</SelectItem>
            <SelectItem value="vendor">مورد</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-3 flex justify-end mt-2">
        <Button onClick={handleApplyFilters}>تطبيق الفلتر</Button>
      </div>
    </div>
  );
};

export default CompanyFilters;
