
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from '@/services/propertiesService';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface PropertyDetailsProps {
  property: Property;
}

const getFieldTypeLabel = (fieldType: string) => {
  const types: Record<string, string> = {
    'text': 'نص',
    'number': 'رقم',
    'email': 'بريد إلكتروني',
    'phone': 'هاتف',
    'date': 'تاريخ',
    'datetime': 'تاريخ ووقت',
    'select': 'اختيار منفرد',
    'multiselect': 'اختيار متعدد',
    'checkbox': 'صندوق اختيار',
    'radio': 'زر راديو',
    'textarea': 'نص طويل',
    'url': 'رابط'
  };
  
  return types[fieldType] || fieldType;
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-semibold">{property.label}</CardTitle>
          <Badge variant="outline">{getFieldTypeLabel(property.fieldType)}</Badge>
        </div>
        <p className="text-gray-500 text-sm">{property.name}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {property.description && (
          <div>
            <h3 className="text-sm font-medium mb-1">الوصف</h3>
            <p className="text-sm">{property.description}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">النوع التقني</h3>
            <p className="text-sm">{property.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">المجموعة</h3>
            <p className="text-sm">{property.group || "غير محدد"}</p>
          </div>
        </div>
        
        {(property.placeholder || property.defaultValue) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.placeholder && (
              <div>
                <h3 className="text-sm font-medium mb-1">النص التوضيحي</h3>
                <p className="text-sm">{property.placeholder}</p>
              </div>
            )}
            
            {property.defaultValue && (
              <div>
                <h3 className="text-sm font-medium mb-1">القيمة الافتراضية</h3>
                <p className="text-sm">{property.defaultValue}</p>
              </div>
            )}
          </div>
        )}
        
        {property.options && property.options.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">الخيارات</h3>
            <div className="space-y-1">
              {property.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">إلزامي</span>
            <Switch checked={property.isRequired} disabled />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">افتراضي</span>
            <Switch checked={property.isDefault} disabled />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">نظامي</span>
            <Switch checked={property.isSystem} disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
