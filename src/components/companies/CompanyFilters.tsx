
import React, { useState } from 'react';
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { CompanyFilters as CompanyFiltersType } from "@/services/companiesService";

interface CompanyFiltersProps {
  onApplyFilters: (filters: CompanyFiltersType) => void;
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState<CompanyFiltersType>({});

  const handleFilterChange = (key: keyof CompanyFiltersType, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    onApplyFilters({});
  };

  return (
    <CardContent className="border-y p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">تصفية النتائج</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">الدولة</Label>
          <Select 
            value={filters.country || "all"}
            onValueChange={(value) => handleFilterChange("country", value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="جميع الدول" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الدول</SelectItem>
              <SelectItem value="eg">مصر</SelectItem>
              <SelectItem value="sa">السعودية</SelectItem>
              <SelectItem value="ae">الإمارات</SelectItem>
              <SelectItem value="kw">الكويت</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">القطاع</Label>
          <Select 
            value={filters.industry || "all"}
            onValueChange={(value) => handleFilterChange("industry", value)}
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="جميع القطاعات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع القطاعات</SelectItem>
              <SelectItem value="tech">تكنولوجيا المعلومات</SelectItem>
              <SelectItem value="retail">تجزئة</SelectItem>
              <SelectItem value="healthcare">رعاية صحية</SelectItem>
              <SelectItem value="food">مطاعم ومقاهي</SelectItem>
              <SelectItem value="finance">خدمات مالية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="size">الحجم</Label>
          <Select>
            <SelectTrigger id="size">
              <SelectValue placeholder="جميع الأحجام" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأحجام</SelectItem>
              <SelectItem value="small">صغيرة (&lt;50 موظف)</SelectItem>
              <SelectItem value="medium">متوسطة (50-200 موظف)</SelectItem>
              <SelectItem value="large">كبيرة (&gt;200 موظف)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">الحالة</Label>
          <Select 
            value={filters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="customer">عميل</SelectItem>
              <SelectItem value="prospect">محتمل</SelectItem>
              <SelectItem value="opportunity">فرصة</SelectItem>
              <SelectItem value="former">سابق</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subscription">الباقة</Label>
          <Select 
            value={filters.subscription || "all"}
            onValueChange={(value) => handleFilterChange("subscription", value)}
          >
            <SelectTrigger id="subscription">
              <SelectValue placeholder="جميع الباقات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الباقات</SelectItem>
              <SelectItem value="basic">أساسية</SelectItem>
              <SelectItem value="advanced">متقدمة</SelectItem>
              <SelectItem value="pro">احترافية</SelectItem>
              <SelectItem value="trial">تجريبية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="manager">مدير الحساب</Label>
          <Select 
            value={filters.manager || "all"}
            onValueChange={(value) => handleFilterChange("manager", value)}
          >
            <SelectTrigger id="manager">
              <SelectValue placeholder="جميع المدراء" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المدراء</SelectItem>
              <SelectItem value="ahmed">أحمد محمد</SelectItem>
              <SelectItem value="sara">سارة أحمد</SelectItem>
              <SelectItem value="mahmoud">محمود عبد الله</SelectItem>
              <SelectItem value="nora">نورا سعيد</SelectItem>
              <SelectItem value="khalid">خالد محمود</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleResetFilters}>إعادة ضبط</Button>
        <Button onClick={handleApplyFilters}>تطبيق الفلتر</Button>
      </div>
    </CardContent>
  );
};

export default CompanyFilters;
