
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

const LeadFilters = () => {
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
          <Label htmlFor="source">المصدر</Label>
          <Select>
            <SelectTrigger id="source">
              <SelectValue placeholder="جميع المصادر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المصادر</SelectItem>
              <SelectItem value="website">نموذج موقع</SelectItem>
              <SelectItem value="whatsapp">واتساب</SelectItem>
              <SelectItem value="exhibition">معرض</SelectItem>
              <SelectItem value="referral">إحالة</SelectItem>
              <SelectItem value="social">وسائل التواصل</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stage">المرحلة</Label>
          <Select>
            <SelectTrigger id="stage">
              <SelectValue placeholder="جميع المراحل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              <SelectItem value="new">جديد</SelectItem>
              <SelectItem value="qualified">مؤهل</SelectItem>
              <SelectItem value="opportunity">فرصة</SelectItem>
              <SelectItem value="proposal">عرض سعر</SelectItem>
              <SelectItem value="negotiation">تفاوض</SelectItem>
              <SelectItem value="closed-won">مغلق ناجح</SelectItem>
              <SelectItem value="closed-lost">مغلق خاسر</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="owner">المسؤول</Label>
          <Select>
            <SelectTrigger id="owner">
              <SelectValue placeholder="جميع المسؤولين" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المسؤولين</SelectItem>
              <SelectItem value="ahmed">أحمد محمد</SelectItem>
              <SelectItem value="sara">سارة أحمد</SelectItem>
              <SelectItem value="mahmoud">محمود عبد الله</SelectItem>
              <SelectItem value="nora">نورا سعيد</SelectItem>
              <SelectItem value="khalid">خالد محمود</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">تاريخ الإنشاء</Label>
          <Select>
            <SelectTrigger id="date">
              <SelectValue placeholder="جميع التواريخ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التواريخ</SelectItem>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="yesterday">أمس</SelectItem>
              <SelectItem value="last-week">آخر أسبوع</SelectItem>
              <SelectItem value="last-month">آخر شهر</SelectItem>
              <SelectItem value="last-quarter">آخر 3 شهور</SelectItem>
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

export default LeadFilters;
