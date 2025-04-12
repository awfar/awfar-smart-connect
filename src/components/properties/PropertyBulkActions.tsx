
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Property } from '@/services/propertiesService';
import { ChevronDown, Trash, Copy, Download, Upload } from 'lucide-react';
import { toast } from "sonner";

interface PropertyBulkActionsProps {
  properties: Property[];
  onDelete: (propertyIds: string[]) => void;
  onDuplicate: (propertyIds: string[]) => void;
  onImport: () => void;
  onExport: () => void;
}

const PropertyBulkActions: React.FC<PropertyBulkActionsProps> = ({
  properties,
  onDelete,
  onDuplicate,
  onImport,
  onExport
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      // Select all non-system properties
      const nonSystemPropertyIds = properties
        .filter(property => !property.isSystem)
        .map(property => property.id);
      setSelectedIds(nonSystemPropertyIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, propertyId]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== propertyId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("لم يتم تحديد أي خصائص للحذف");
      return;
    }
    onDelete(selectedIds);
  };

  const handleDuplicateSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("لم يتم تحديد أي خصائص للنسخ");
      return;
    }
    onDuplicate(selectedIds);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox 
              id="select-all" 
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
              تحديد الكل
            </label>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash className="h-3.5 w-3.5" />
                  <span>حذف المحدد ({selectedIds.length})</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDuplicateSelected}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>نسخ المحدد</span>
                </Button>
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <span>المزيد من الإجراءات</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onImport} className="flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span>استيراد الخصائص</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExport} className="flex items-center gap-2 cursor-pointer">
                  <Download className="h-4 w-4" />
                  <span>تصدير الخصائص</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="border rounded-md mt-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 p-3 text-right"></th>
                <th className="p-3 text-right text-sm font-medium text-gray-500">الخاصية</th>
                <th className="p-3 text-right text-sm font-medium text-gray-500">نوع الحقل</th>
                <th className="p-3 text-right text-sm font-medium text-gray-500">المجموعة</th>
                <th className="p-3 text-right text-sm font-medium text-gray-500">إلزامي</th>
                <th className="p-3 text-right text-sm font-medium text-gray-500">نظامي</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox 
                      checked={selectedIds.includes(property.id)} 
                      onCheckedChange={(checked) => handleSelectProperty(property.id, !!checked)}
                      disabled={property.isSystem}
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{property.label}</div>
                    <div className="text-xs text-gray-500">{property.name}</div>
                  </td>
                  <td className="p-3">{property.fieldType}</td>
                  <td className="p-3">{property.group || "-"}</td>
                  <td className="p-3">{property.isRequired ? "نعم" : "لا"}</td>
                  <td className="p-3">{property.isSystem ? "نعم" : "لا"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyBulkActions;
