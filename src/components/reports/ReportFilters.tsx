
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchIcon, X } from "lucide-react";

const ReportFilters = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-range">نطاق التاريخ</Label>
            <Select defaultValue="this-month">
              <SelectTrigger>
                <SelectValue placeholder="اختر الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="yesterday">الأمس</SelectItem>
                <SelectItem value="this-week">هذا الأسبوع</SelectItem>
                <SelectItem value="last-week">الأسبوع الماضي</SelectItem>
                <SelectItem value="this-month">هذا الشهر</SelectItem>
                <SelectItem value="last-month">الشهر الماضي</SelectItem>
                <SelectItem value="this-quarter">هذا الربع</SelectItem>
                <SelectItem value="this-year">هذه السنة</SelectItem>
                <SelectItem value="last-year">السنة الماضية</SelectItem>
                <SelectItem value="custom">تاريخ مخصص</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team-member">عضو الفريق</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="اختر عضو الفريق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأعضاء</SelectItem>
                <SelectItem value="1">أحمد محمد</SelectItem>
                <SelectItem value="2">سارة أحمد</SelectItem>
                <SelectItem value="3">محمد علي</SelectItem>
                <SelectItem value="4">فاطمة حسن</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">الحالة</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="qualified">مؤهل</SelectItem>
                <SelectItem value="proposal">عرض سعر</SelectItem>
                <SelectItem value="negotiation">تفاوض</SelectItem>
                <SelectItem value="won">مغلق مكسب</SelectItem>
                <SelectItem value="lost">مغلق خسارة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="product">المنتج</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="اختر المنتج" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المنتجات</SelectItem>
                <SelectItem value="1">المنتج أ</SelectItem>
                <SelectItem value="2">المنتج ب</SelectItem>
                <SelectItem value="3">المنتج ج</SelectItem>
                <SelectItem value="4">المنتج د</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">القطاع</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="اختر القطاع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع القطاعات</SelectItem>
                <SelectItem value="tech">تكنولوجيا المعلومات</SelectItem>
                <SelectItem value="healthcare">الرعاية الصحية</SelectItem>
                <SelectItem value="education">التعليم</SelectItem>
                <SelectItem value="retail">التجزئة</SelectItem>
                <SelectItem value="manufacturing">التصنيع</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search">بحث</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="search" placeholder="بحث عن عميل، منتج، صفقة..." className="pl-9" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <Label className="flex items-center gap-2">
            <Checkbox id="compare" />
            <span>مقارنة مع الفترة السابقة</span>
          </Label>
          
          <Label className="flex items-center gap-2">
            <Checkbox id="cumulative" />
            <span>عرض البيانات التراكمية</span>
          </Label>
          
          <Label className="flex items-center gap-2">
            <Checkbox id="targets" />
            <span>عرض الأهداف</span>
          </Label>
        </div>
        
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" className="gap-1">
            <X className="h-4 w-4" />
            مسح
          </Button>
          <Button size="sm" className="gap-1">
            <SearchIcon className="h-4 w-4" />
            تطبيق الفلاتر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
