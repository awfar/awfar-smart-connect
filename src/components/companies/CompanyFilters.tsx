
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

const CompanyFilters = () => {
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
          <Select>
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
          <Select>
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
          <Select>
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
          <Select>
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
          <Select>
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
        <Button variant="outline">إعادة ضبط</Button>
        <Button>تطبيق الفلتر</Button>
      </div>
    </CardContent>
  );
};

export default CompanyFilters;
