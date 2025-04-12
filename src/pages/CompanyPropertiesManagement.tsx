
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import PropertyList from "@/components/properties/PropertyList";
import PropertyForm from "@/components/properties/PropertyForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Property, getPropertiesByType, createProperty, updateProperty, deleteProperty } from "@/services/propertiesService";

const CompanyPropertiesManagement = () => {
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['properties', 'company'],
    queryFn: () => getPropertiesByType('company'),
  });

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setIsAddingProperty(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsAddingProperty(true);
  };

  const handleDeleteProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;
    
    try {
      await deleteProperty(selectedProperty.id);
      toast.success("تم حذف الخاصية بنجاح");
      setShowDeleteDialog(false);
      refetch();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("حدث خطأ أثناء حذف الخاصية");
    }
  };

  const handleSubmitProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedProperty) {
        await updateProperty(selectedProperty.id, propertyData);
        toast.success("تم تحديث الخاصية بنجاح");
      } else {
        await createProperty(propertyData);
        toast.success("تم إضافة الخاصية بنجاح");
      }
      setIsAddingProperty(false);
      refetch();
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error("حدث خطأ أثناء حفظ الخاصية");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">إدارة خصائص الشركات</h1>
            <p className="text-gray-500">تخصيص الخصائص والحقول المتعلقة بالشركات</p>
          </div>
        </div>
        
        <PropertyList
          properties={properties || []}
          type="company"
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
          onAdd={handleAddProperty}
        />
      </div>
      
      <Dialog open={isAddingProperty} onOpenChange={setIsAddingProperty}>
        <DialogContent className="max-w-2xl rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProperty ? "تعديل خاصية" : "إضافة خاصية جديدة"}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            property={selectedProperty || undefined}
            type="company"
            onSubmit={handleSubmitProperty}
            onCancel={() => setIsAddingProperty(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rtl">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>هل أنت متأكد من رغبتك في حذف خاصية "{selectedProperty?.label}"؟</p>
            <p className="text-gray-500 text-sm mt-2">هذا الإجراء لا يمكن التراجع عنه.</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CompanyPropertiesManagement;
