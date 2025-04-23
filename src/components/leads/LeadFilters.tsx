
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [sourceFilter, setSourceFilter] = React.useState<string>('');

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange({ status: value || undefined, source: sourceFilter || undefined });
  };

  const handleSourceChange = (value: string) => {
    setSourceFilter(value);
    onFilterChange({ status: statusFilter || undefined, source: value || undefined });
  };

  return (
    <Card className="border-t-0 rounded-t-none">
      <CardContent className="p-4 space-y-4">
        <div>
          <Label className="block mb-2 text-sm">حالة العميل</Label>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الحالات</SelectItem>
              <SelectItem value="جديد">جديد</SelectItem>
              <SelectItem value="مؤهل">مؤهل</SelectItem>
              <SelectItem value="عرض سعر">عرض سعر</SelectItem>
              <SelectItem value="تفاوض">تفاوض</SelectItem>
              <SelectItem value="مغلق">مغلق</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block mb-2 text-sm">مصدر العميل</Label>
          <Select value={sourceFilter} onValueChange={handleSourceChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="جميع المصادر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع المصادر</SelectItem>
              <SelectItem value="موقع إلكتروني">موقع إلكتروني</SelectItem>
              <SelectItem value="وسائل التواصل الاجتماعي">وسائل التواصل الاجتماعي</SelectItem>
              <SelectItem value="معرض تجاري">معرض تجاري</SelectItem>
              <SelectItem value="توصية">توصية</SelectItem>
              <SelectItem value="إعلان">إعلان</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFilters;
