
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
import { Edit, MoreHorizontal, Plus, Trash2, Eye } from 'lucide-react';
import { Property, PropertyType } from '@/services/propertiesService';
import PropertyDetailsDialog from './PropertyDetailsDialog';

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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setTimeout(() => setSelectedProperty(null), 300);
  };

  const handleEditFromDetails = (property: Property) => {
    handleCloseDetails();
    setTimeout(() => onEdit(property), 300);
  };

  const handleDeleteFromDetails = (property: Property) => {
    handleCloseDetails();
    setTimeout(() => onDelete(property), 300);
  };

  return (
    <>
      {properties && properties.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>الاسم التقني</TableHead>
                <TableHead>نوع الحقل</TableHead>
                <TableHead>المجموعة</TableHead>
                <TableHead>إلزامي</TableHead>
                <TableHead>نظامي</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{property.label}</TableCell>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>
                    <Badge variant={property.fieldType === 'text' ? 'default' : 'outline'} 
                      className={property.fieldType === 'select' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
                    >
                      {getFieldTypeLabel(property.fieldType)}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.group || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={property.isRequired ? 'destructive' : 'outline'} className="font-normal">
                      {property.isRequired ? 'نعم' : 'لا'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={property.isSystem ? 'secondary' : 'outline'} className="font-normal">
                      {property.isSystem ? 'نعم' : 'لا'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(property)} className="gap-2">
                          <Eye className="h-4 w-4" />
                          <span>عرض التفاصيل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(property)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          <span>تعديل</span>
                        </DropdownMenuItem>
                        {!property.isSystem && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(property)}
                            className="text-red-600 gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
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
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-md bg-muted/20">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-muted">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">لا توجد خصائص</h3>
              <p className="text-muted-foreground mb-4">لا توجد خصائص مضافة حالياً. يمكنك إضافة خصائص جديدة.</p>
              <Button onClick={onAdd} className="gap-2 bg-awfar-accent text-awfar-primary hover:bg-awfar-accent/90">
                <Plus className="h-4 w-4" />
                إضافة خاصية جديدة
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedProperty && (
        <PropertyDetailsDialog 
          property={selectedProperty}
          open={detailsOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseDetails();
            else setDetailsOpen(true);
          }}
          onEdit={handleEditFromDetails}
          onDelete={handleDeleteFromDetails}
        />
      )}
    </>
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
