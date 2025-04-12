
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Property, PropertyType } from '@/services/propertiesService';
import { FormWithFields } from '@/services/formBuilderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Grip, Plus, Settings, Trash2, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface FormBuilderProps {
  properties: Property[];
  form?: FormWithFields;
  type: PropertyType;
  onSave: (form: any) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "اسم النموذج مطلوب"),
  description: z.string().optional(),
  submitButtonText: z.string().default("إرسال"),
  successMessage: z.string().default("تم إرسال النموذج بنجاح"),
  redirectUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

const FormBuilder: React.FC<FormBuilderProps> = ({ 
  properties, 
  form, 
  type, 
  onSave, 
  onCancel 
}) => {
  const [formFields, setFormFields] = useState<any[]>(
    form?.fields?.map(field => {
      const property = properties.find(p => p.id === field.propertyId);
      return { 
        ...field, 
        property 
      };
    }) || []
  );
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: form?.name || '',
      description: form?.description || '',
      submitButtonText: form?.submitButtonText || 'إرسال',
      successMessage: form?.successMessage || 'تم إرسال النموذج بنجاح',
      redirectUrl: form?.redirectUrl || '',
      isActive: form?.isActive ?? true,
    },
  });

  useEffect(() => {
    // Filter out properties that are already used in the form
    const usedPropertyIds = formFields.map(field => field.property?.id);
    const filtered = properties.filter(
      property => !usedPropertyIds.includes(property.id)
    );
    setAvailableProperties(filtered);
  }, [properties, formFields]);

  const handleAddField = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setFormFields([
        ...formFields, 
        {
          propertyId,
          order: formFields.length,
          isRequired: property.isRequired,
          isVisible: true,
          property
        }
      ]);
      // Remove from available properties
      setAvailableProperties(availableProperties.filter(p => p.id !== propertyId));
    }
  };

  const handleRemoveField = (index: number) => {
    const field = formFields[index];
    if (field.property) {
      // Add the property back to available properties
      setAvailableProperties([...availableProperties, field.property]);
    }
    // Remove from form fields
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleToggleRequired = (index: number) => {
    const updatedFields = [...formFields];
    updatedFields[index].isRequired = !updatedFields[index].isRequired;
    setFormFields(updatedFields);
  };

  const handleToggleVisible = (index: number) => {
    const updatedFields = [...formFields];
    updatedFields[index].isVisible = !updatedFields[index].isVisible;
    setFormFields(updatedFields);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setFormFields(updatedItems);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (formFields.length === 0) {
      toast.error('يجب إضافة حقل واحد على الأقل للنموذج');
      return;
    }

    const formData = {
      ...values,
      type,
      id: form?.id,
      fields: formFields.map(field => ({
        id: field.id,
        propertyId: field.propertyId,
        formId: form?.id,
        order: field.order,
        isRequired: field.isRequired,
        isVisible: field.isVisible
      }))
    };

    onSave(formData);
  };

  return (
    <div className="space-y-8">
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النموذج</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={formMethods.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم النموذج</FormLabel>
                      <FormControl>
                        <Input placeholder="نموذج التسجيل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formMethods.control}
                  name="submitButtonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نص زر الإرسال</FormLabel>
                      <FormControl>
                        <Input placeholder="إرسال" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={formMethods.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف النموذج</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="وصف مختصر للنموذج" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={formMethods.control}
                  name="successMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رسالة النجاح</FormLabel>
                      <FormControl>
                        <Input placeholder="تم إرسال النموذج بنجاح" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formMethods.control}
                  name="redirectUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رابط التوجيه بعد الإرسال</FormLabel>
                      <FormControl>
                        <Input placeholder="/thank-you" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={formMethods.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">تفعيل النموذج</FormLabel>
                      <FormDescription>
                        هل هذا النموذج متاح للاستخدام؟
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>حقول النموذج</CardTitle>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="form-fields">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {formFields.length > 0 ? (
                            formFields.map((field, index) => (
                              <Draggable 
                                key={field.property?.id || index} 
                                draggableId={field.property?.id || `field-${index}`} 
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`border rounded-md p-4 ${!field.isVisible ? 'opacity-50' : ''}`}
                                  >
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center">
                                        <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                                          <Grip className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium">{field.property?.label}</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {field.property?.name}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleToggleRequired(index)}
                                        >
                                          {field.isRequired ? 'إلزامي' : 'اختياري'}
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleToggleVisible(index)}
                                        >
                                          <Settings className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveField(index)}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    {/* Preview of the field based on its type */}
                                    {field.isVisible && (
                                      <div className="opacity-70">
                                        <FormLabel htmlFor={`preview-${index}`}>
                                          {field.property?.label}
                                          {field.isRequired && <span className="text-red-500 mr-1">*</span>}
                                        </FormLabel>
                                        <div className="mt-1">
                                          {renderFieldPreview(field.property, index)}
                                        </div>
                                        {field.property?.description && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {field.property.description}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className="text-center py-8 border border-dashed rounded-md">
                              <p className="text-muted-foreground">
                                أضف حقول إلى النموذج من القائمة اليمنى
                              </p>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>الخصائص المتاحة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {availableProperties.length > 0 ? (
                      availableProperties.map((property) => (
                        <div 
                          key={property.id} 
                          className="border rounded-md p-3 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium">{property.label}</h4>
                            <p className="text-xs text-muted-foreground">{property.name}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddField(property.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        لا توجد خصائص متاحة للإضافة
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 rtl:space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
            <Button type="submit">
              {form ? 'تحديث النموذج' : 'إنشاء النموذج'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

function renderFieldPreview(property: Property | undefined, index: number) {
  if (!property) return null;

  switch (property.fieldType) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <Input 
          id={`preview-${index}`}
          type={property.fieldType === 'email' ? 'email' : 'text'}
          placeholder={property.placeholder || ''}
          disabled
        />
      );
    case 'number':
      return (
        <Input 
          id={`preview-${index}`}
          type="number"
          placeholder={property.placeholder || ''}
          disabled
        />
      );
    case 'textarea':
      return (
        <Textarea 
          id={`preview-${index}`}
          placeholder={property.placeholder || ''}
          disabled
        />
      );
    case 'select':
      return (
        <Select disabled>
          <SelectTrigger id={`preview-${index}`}>
            <SelectValue placeholder={property.placeholder || 'اختر...'} />
          </SelectTrigger>
          <SelectContent>
            {property.options?.map((option, i) => (
              <SelectItem key={i} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          {property.options?.map((option, i) => (
            <div key={i} className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox id={`preview-${index}-${i}`} disabled />
              <label htmlFor={`preview-${index}-${i}`}>{option.label}</label>
            </div>
          ))}
        </div>
      );
    case 'radio':
      return (
        <RadioGroup disabled>
          {property.options?.map((option, i) => (
            <div key={i} className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value={option.value} id={`preview-${index}-${i}`} />
              <label htmlFor={`preview-${index}-${i}`}>{option.label}</label>
            </div>
          ))}
        </RadioGroup>
      );
    case 'date':
      return (
        <Input 
          id={`preview-${index}`}
          type="date"
          disabled
        />
      );
    case 'datetime':
      return (
        <Input 
          id={`preview-${index}`}
          type="datetime-local"
          disabled
        />
      );
    default:
      return (
        <Input 
          id={`preview-${index}`}
          disabled
          placeholder={property.placeholder || ''}
        />
      );
  }
}

export default FormBuilder;
