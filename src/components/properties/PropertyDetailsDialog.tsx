
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Property } from '@/services/propertiesService';
import PropertyDetails from './PropertyDetails';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface PropertyDetailsDialogProps {
  property?: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

const PropertyDetailsDialog: React.FC<PropertyDetailsDialogProps> = ({
  property,
  open,
  onOpenChange,
  onEdit,
  onDelete
}) => {
  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{property.label}</DialogTitle>
          <DialogDescription>
            تفاصيل الخاصية وإعداداتها
          </DialogDescription>
        </DialogHeader>
        
        <PropertyDetails property={property} />
        
        <div className="flex justify-end gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onEdit(property)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" /> تعديل
          </Button>
          
          {!property.isSystem && (
            <Button 
              variant="destructive"
              onClick={() => onDelete(property)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" /> حذف
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsDialog;
