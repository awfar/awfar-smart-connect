
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Edit, 
  Eye, 
  Link2, 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { 
  Form, 
  FormWithFields, 
  fetchForms, 
  fetchFormWithFields,
  createForm,
  updateForm,
  deleteForm
} from '@/services/formBuilderService';
import { 
  Property, 
  PropertyType, 
  getPropertiesByType 
} from '@/services/propertiesService';
import { getTypeLabel } from '@/components/properties/PropertyList';
import FormBuilder from '@/components/forms/FormBuilder';
import DynamicForm from '@/components/forms/DynamicForm';
import DashboardLayout from '@/components/layout/DashboardLayout';

const FormBuilderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PropertyType>('lead');
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormWithFields | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadForms();
    loadProperties(activeTab);
  }, [activeTab]);

  const loadForms = async () => {
    setIsLoading(true);
    try {
      const data = await fetchForms();
      setForms(data.filter(form => form.type === activeTab));
    } catch (error) {
      console.error('Error loading forms:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل النماذج",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProperties = async (type: PropertyType) => {
    try {
      const data = await getPropertiesByType(type);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الخصائص",
        variant: "destructive"
      });
    }
  };

  const handleAddForm = () => {
    setSelectedForm(null);
    setIsFormDialogOpen(true);
  };

  const handleEditForm = async (formId: string) => {
    setIsLoadingForm(true);
    try {
      const form = await fetchFormWithFields(formId);
      setSelectedForm(form);
      setIsFormDialogOpen(true);
    } catch (error) {
      console.error('Error loading form:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل النموذج",
        variant: "destructive"
      });
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handlePreviewForm = async (formId: string) => {
    setIsLoadingForm(true);
    try {
      const form = await fetchFormWithFields(formId);
      setSelectedForm(form);
      setIsPreviewDialogOpen(true);
    } catch (error) {
      console.error('Error loading form for preview:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل معاينة النموذج",
        variant: "destructive"
      });
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteForm(formId);
      toast({
        title: "تم الحذف",
        description: "تم حذف النموذج بنجاح",
      });
      loadForms();
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف النموذج",
        variant: "destructive"
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (formData.id) {
        await updateForm(formData.id, {
          name: formData.name,
          description: formData.description,
          submitButtonText: formData.submitButtonText,
          successMessage: formData.successMessage,
          redirectUrl: formData.redirectUrl,
          isActive: formData.isActive
        }, formData.fields);
        
        toast({
          title: "تم التحديث",
          description: `تم تحديث النموذج "${formData.name}" بنجاح`,
        });
      } else {
        await createForm({
          name: formData.name,
          description: formData.description,
          type: activeTab,
          submitButtonText: formData.submitButtonText,
          successMessage: formData.successMessage,
          redirectUrl: formData.redirectUrl,
          isActive: formData.isActive
        }, formData.fields);
        
        toast({
          title: "تمت الإضافة",
          description: `تم إنشاء النموذج "${formData.name}" بنجاح`,
        });
      }
      
      setIsFormDialogOpen(false);
      loadForms();
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ النموذج",
        variant: "destructive"
      });
    }
  };

  const copyFormEmbedCode = (formId: string) => {
    const code = `<iframe src="${window.location.origin}/form-embed/${formId}" width="100%" height="600" style="border:none;"></iframe>`;
    navigator.clipboard.writeText(code);
    toast({
      title: "تم النسخ",
      description: "تم نسخ كود تضمين النموذج إلى الحافظة",
    });
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
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">بناء النماذج</h1>
        <Button onClick={handleAddForm} className="gap-1">
          <Plus className="h-4 w-4" /> إنشاء نموذج جديد
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as PropertyType)}>
        <TabsList className="mb-6 overflow-auto flex w-full border-b pb-px">
          {propertyTypes.map((type) => (
            <TabsTrigger 
              key={type} 
              value={type} 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              نماذج {getTypeLabel(type)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forms.length > 0 ? (
                  forms.map((form) => (
                    <Card key={form.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{form.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {form.description || 'لا يوجد وصف'}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">فتح القائمة</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditForm(form.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>تعديل</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePreviewForm(form.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>معاينة</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyFormEmbedCode(form.id)}>
                                <Link2 className="mr-2 h-4 w-4" />
                                <span>نسخ كود التضمين</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteForm(form.id)}>
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">حذف</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          تم إنشاؤه في {new Date(form.created_at!).toLocaleDateString('ar-SA')}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Badge variant={form.isActive ? "default" : "outline"}>
                          {form.isActive ? 'مفعل' : 'غير مفعل'}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => handlePreviewForm(form.id)}>
                          معاينة النموذج
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 py-10 text-center">
                    <p className="text-muted-foreground mb-4">لا توجد نماذج مضافة لهذا النوع</p>
                    <Button onClick={handleAddForm} className="gap-1">
                      <Plus className="h-4 w-4" /> إنشاء نموذج جديد
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Form Builder Dialog */}
      <Dialog 
        open={isFormDialogOpen} 
        onOpenChange={(open) => {
          if (!isLoadingForm) setIsFormDialogOpen(open);
        }}
      >
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto" 
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedForm ? 'تحرير النموذج' : 'إنشاء نموذج جديد'}
            </DialogTitle>
          </DialogHeader>
          {isLoadingForm ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <FormBuilder
              form={selectedForm || undefined}
              properties={properties}
              type={activeTab}
              onSave={handleFormSubmit}
              onCancel={() => setIsFormDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Form Preview Dialog */}
      <Dialog 
        open={isPreviewDialogOpen} 
        onOpenChange={(open) => {
          if (!isLoadingForm) setIsPreviewDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              معاينة النموذج: {selectedForm?.name}
            </DialogTitle>
          </DialogHeader>
          {isLoadingForm ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedForm ? (
            <DynamicForm 
              form={selectedForm} 
              properties={properties} 
              onSuccess={() => setIsPreviewDialogOpen(false)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FormBuilderManagement;
