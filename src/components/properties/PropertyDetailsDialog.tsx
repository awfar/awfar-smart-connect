
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
import { Edit, Trash2, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';

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
          <div className="flex items-center">
            <DialogTitle className="text-xl">{property.label}</DialogTitle>
            {property.isSystem && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>هذه خاصية نظامية لا يمكن حذفها</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <DialogDescription>
            تفاصيل الخاصية وإعداداتها
          </DialogDescription>
        </DialogHeader>
        
        <PropertyDetails property={property} />
        
        <div className="flex justify-end gap-3 mt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={() => onEdit(property)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" /> تعديل
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>تعديل خصائص وإعدادات {property.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {!property.isSystem && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive"
                    onClick={() => onDelete(property)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> حذف
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>حذف الخاصية نهائياً. هذا الإجراء لا يمكن التراجع عنه!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsDialog;
