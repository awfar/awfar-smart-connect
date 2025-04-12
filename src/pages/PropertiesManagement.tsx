
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PropertyList from '@/components/properties/PropertyList';
import PropertyForm from '@/components/properties/PropertyForm';
import PropertyTypesSelector from '@/components/properties/PropertyTypesSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Property, PropertyType, getPropertiesByType, createProperty, updateProperty, deleteProperty } from '@/services/propertiesService';
import { toast } from 'sonner';
import { getTypeLabel } from '@/components/properties/PropertyList';

const PropertiesManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);
  const [propertyType, setPropertyType] = useState<PropertyType>('lead');
  
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

  const handlePropertyTypeChange = (type: PropertyType) => {
    setPropertyType(type);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">إدارة الخصائص</h1>
            <p className="text-gray-500">تخصيص الخصائص والحقول لإدارة البيانات</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setSelectedProperty(undefined)}>
                <Plus className="h-4 w-4" />
                إضافة خاصية جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogTitle>
                {selectedProperty ? 'تعديل خاصية' : 'إضافة خاصية جديدة'}
              </DialogTitle>
              <PropertyForm 
                property={selectedProperty} 
                type={propertyType} 
                onSubmit={selectedProperty ? handleUpdateProperty : handleAddProperty}
                onCancel={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <PropertyTypesSelector 
          selectedType={propertyType}
          onTypeChange={handlePropertyTypeChange}
        />
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>خصائص {getTypeLabel(propertyType)}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PropertiesManagement;
