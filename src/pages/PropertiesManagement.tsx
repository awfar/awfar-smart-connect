
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { 
  Property, 
  PropertyType, 
  fetchPropertiesByType,
  createProperty,
  updateProperty,
  deleteProperty
} from '@/services/propertiesService';
import PropertyList, { getTypeLabel } from '@/components/properties/PropertyList';
import PropertyForm from '@/components/properties/PropertyForm';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardNav from '@/components/dashboard/DashboardNav';

const PropertiesManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PropertyType>('lead');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    loadProperties(activeTab);
  }, [activeTab]);

  const loadProperties = async (type: PropertyType) => {
    setIsLoading(true);
    try {
      const data = await fetchPropertiesByType(type);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الخصائص",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProperty = () => {
    setSelectedProperty(undefined);
    setIsDialogOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDialogOpen(true);
  };

  const handleDeleteProperty = async (property: Property) => {
    try {
      await deleteProperty(property.id);
      toast({
        title: "تم الحذف",
        description: `تم حذف الخاصية "${property.label}" بنجاح`,
      });
      loadProperties(activeTab);
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الخاصية",
        variant: "destructive"
      });
    }
  };

  const handlePropertySubmit = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedProperty) {
        await updateProperty(selectedProperty.id, propertyData);
        toast({
          title: "تم التحديث",
          description: `تم تحديث الخاصية "${propertyData.label}" بنجاح`,
        });
      } else {
        await createProperty(propertyData);
        toast({
          title: "تمت الإضافة",
          description: `تم إضافة الخاصية "${propertyData.label}" بنجاح`,
        });
      }
      setIsDialogOpen(false);
      loadProperties(activeTab);
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الخاصية",
        variant: "destructive"
      });
    }
  };

  const propertyTypes: PropertyType[] = [
    'lead',
    'company',
    'contact',
    'deal',
    'user',
    'product',
    'invoice'
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة الخصائص</h1>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as PropertyType)}>
            <TabsList className="mb-6 overflow-auto flex w-full border-b pb-px">
              {propertyTypes.map((type) => (
                <TabsTrigger 
                  key={type} 
                  value={type} 
                  className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  {getTypeLabel(type)}
                </TabsTrigger>
              ))}
            </TabsList>

            {propertyTypes.map((type) => (
              <TabsContent key={type} value={type}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <PropertyList
                    properties={properties}
                    type={type}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteProperty}
                    onAdd={handleAddProperty}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProperty ? 'تعديل الخاصية' : 'إضافة خاصية جديدة'}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            property={selectedProperty}
            type={activeTab}
            onSubmit={handlePropertySubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesManagement;
