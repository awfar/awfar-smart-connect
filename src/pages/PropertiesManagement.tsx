
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PropertyList from '@/components/properties/PropertyList';
import PropertyForm from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Property, PropertyType, getPropertiesByType, createProperty, updateProperty, deleteProperty } from '@/services/propertiesService';
import { toast } from 'sonner';

const PropertiesManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);
  const propertyType: PropertyType = 'lead'; // Default to lead properties
  
  const { data: properties = [], isLoading, refetch } = useQuery({
    queryKey: ['properties', propertyType],
    queryFn: () => getPropertiesByType(propertyType),
  });
  
  const handleAddProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createProperty(property);
      toast.success('تم إضافة الخاصية بنجاح');
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الخاصية');
      console.error(error);
    }
  };
  
  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDialogOpen(true);
  };
  
  const handleUpdateProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedProperty) return;
    
    try {
      await updateProperty(selectedProperty.id, property);
      toast.success('تم تحديث الخاصية بنجاح');
      refetch();
      setIsDialogOpen(false);
      setSelectedProperty(undefined);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الخاصية');
      console.error(error);
    }
  };
  
  const handleDeleteProperty = async (property: Property) => {
    try {
      await deleteProperty(property.id);
      toast.success('تم حذف الخاصية بنجاح');
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الخاصية');
      console.error(error);
    }
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProperty(undefined);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة الخصائص</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setSelectedProperty(undefined)}>
                <Plus className="h-4 w-4" />
                إضافة خاصية
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogTitle>{selectedProperty ? 'تعديل خاصية' : 'إضافة خاصية جديدة'}</DialogTitle>
              <PropertyForm 
                property={selectedProperty} 
                type={propertyType} 
                onSubmit={selectedProperty ? handleUpdateProperty : handleAddProperty}
                onCancel={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>الخصائص</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyList 
              properties={properties}
              type={propertyType}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              onAdd={() => {
                setSelectedProperty(undefined);
                setIsDialogOpen(true);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PropertiesManagement;
