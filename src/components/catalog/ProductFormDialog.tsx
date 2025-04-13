
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProductForm from '@/components/catalog/ProductForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          إضافة منتج جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة منتج جديد</DialogTitle>
        </DialogHeader>
        <ProductForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
