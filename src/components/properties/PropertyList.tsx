
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Property, PropertyType } from '@/services/propertiesService';

interface PropertyListProps {
  properties: Property[];
  type: PropertyType;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onAdd: () => void;
}

const getFieldTypeLabel = (fieldType: string) => {
  const types: Record<string, string> = {
    'text': 'نص',
    'number': 'رقم',
    'email': 'بريد إلكتروني',
    'phone': 'هاتف',
    'date': 'تاريخ',
    'datetime': 'وقت وتاريخ',
    'select': 'اختيار منفرد',
    'multiselect': 'اختيار متعدد',
    'checkbox': 'صندوق اختيار',
    'radio': 'زر راديو',
    'textarea': 'نص طويل',
    'url': 'رابط'
  };
  
  return types[fieldType] || fieldType;
};

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  type, 
  onEdit, 
  onDelete,
  onAdd
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">خصائص {getTypeLabel(type)}</CardTitle>
        <Button onClick={onAdd} className="gap-1">
          <Plus className="h-4 w-4" /> إضافة خاصية
        </Button>
      </CardHeader>
      <CardContent>
        {properties && properties.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>نوع الحقل</TableHead>
                <TableHead>إلزامي</TableHead>
                <TableHead>افتراضي</TableHead>
                <TableHead>نظامي</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.label}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getFieldTypeLabel(property.fieldType)}</Badge>
                  </TableCell>
                  <TableCell>{property.isRequired ? 'نعم' : 'لا'}</TableCell>
                  <TableCell>{property.isDefault ? 'نعم' : 'لا'}</TableCell>
                  <TableCell>{property.isSystem ? 'نعم' : 'لا'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(property)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>تعديل</span>
                        </DropdownMenuItem>
                        {!property.isSystem && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(property)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>حذف</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            لا توجد خصائص مضافة. انقر على إضافة خاصية لإنشاء خاصية جديدة.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export function getTypeLabel(type: PropertyType): string {
  const types: Record<PropertyType, string> = {
    'lead': 'العميل المحتمل',
    'company': 'الشركة',
    'contact': 'جهة الاتصال',
    'deal': 'الصفقة',
    'user': 'المستخدم',
    'product': 'المنتج',
    'invoice': 'الفاتورة'
  };
  
  return types[type];
}

export default PropertyList;
