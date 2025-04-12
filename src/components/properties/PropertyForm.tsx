
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
import { Switch } from "@/components/ui/switch";
import { Property, PropertyType, FieldType } from '@/services/propertiesService';
import { Separator } from '@/components/ui/separator';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyFormProps {
  property?: Property;
  type: PropertyType;
  onSubmit: (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(50).regex(/^[a-zA-Z0-9_]+$/, {
    message: "يمكن استخدام الأحرف الإنجليزية والأرقام والشرطة السفلية فقط",
  }),
  label: z.string().min(1, "العنوان مطلوب").max(100),
  fieldType: z.string().min(1, "نوع الحقل مطلوب"),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  isRequired: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  group: z.string().optional(),
  options: z.array(
    z.object({
      label: z.string().min(1, "عنوان الخيار مطلوب"),
      value: z.string().min(1, "قيمة الخيار مطلوبة"),
    })
  ).optional(),
});

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  property, 
  type, 
  onSubmit, 
  onCancel 
}) => {
  const [fieldType, setFieldType] = useState<string>(property?.fieldType || 'text');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: property?.name || '',
      label: property?.label || '',
      fieldType: property?.fieldType || 'text',
      description: property?.description || '',
      placeholder: property?.placeholder || '',
      defaultValue: property?.defaultValue?.toString() || '',
      isRequired: property?.isRequired || false,
      isDefault: property?.isDefault || false,
      group: property?.group || '',
      options: property?.options || [{ label: '', value: '' }],
    },
  });

  useEffect(() => {
    if (property) {
      form.reset({
        name: property.name,
        label: property.label,
        fieldType: property.fieldType,
        description: property.description || '',
        placeholder: property.placeholder || '',
        defaultValue: property.defaultValue?.toString() || '',
        isRequired: property.isRequired,
        isDefault: property.isDefault,
        group: property.group || '',
        options: property.options || [{ label: '', value: '' }],
      });
      setFieldType(property.fieldType);
    }
  }, [property, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const finalValues = {
      ...values,
      type, // Set the property type
      isSystem: property?.isSystem || false,
      options: hasOptions(values.fieldType as FieldType) ? values.options : undefined,
    };
    
    onSubmit(finalValues);
  };

  // Check if the field type requires options
  const hasOptions = (type: FieldType) => {
    return ['select', 'multiselect', 'radio', 'checkbox'].includes(type);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الداخلي</FormLabel>
                <FormControl>
                  <Input placeholder="first_name" {...field} />
                </FormControl>
                <FormDescription>
                  اسم الحقل في قاعدة البيانات. يستخدم الأحرف الإنجليزية فقط.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان المعروض</FormLabel>
                <FormControl>
                  <Input placeholder="الاسم الأول" {...field} />
                </FormControl>
                <FormDescription>
                  العنوان المعروض للمستخدمين في النماذج.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fieldType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع الحقل</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFieldType(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الحقل" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">نص</SelectItem>
                    <SelectItem value="number">رقم</SelectItem>
                    <SelectItem value="email">بريد إلكتروني</SelectItem>
                    <SelectItem value="phone">هاتف</SelectItem>
                    <SelectItem value="date">تاريخ</SelectItem>
                    <SelectItem value="datetime">وقت وتاريخ</SelectItem>
                    <SelectItem value="select">اختيار منفرد</SelectItem>
                    <SelectItem value="multiselect">اختيار متعدد</SelectItem>
                    <SelectItem value="checkbox">صندوق اختيار</SelectItem>
                    <SelectItem value="radio">زر راديو</SelectItem>
                    <SelectItem value="textarea">نص طويل</SelectItem>
                    <SelectItem value="url">رابط</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  نوع الحقل يحدد كيفية عرضه وإدخال البيانات.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المجموعة</FormLabel>
                <FormControl>
                  <Input placeholder="معلومات أساسية" {...field} />
                </FormControl>
                <FormDescription>
                  المجموعة التي ينتمي إليها هذا الحقل.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="وصف مختصر للحقل وكيفية استخدامه" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                وصف يساعد المستخدمين على فهم الحقل بشكل أفضل.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="placeholder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>النص التلميحي</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل الاسم الأول" {...field} />
                </FormControl>
                <FormDescription>
                  النص الذي يظهر قبل إدخال البيانات.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>القيمة الافتراضية</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  القيمة التي سيتم تعبئتها افتراضيًا.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="isRequired"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">إلزامي</FormLabel>
                  <FormDescription>
                    هل هذا الحقل مطلوب عند تعبئة النماذج؟
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

          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">افتراضي</FormLabel>
                  <FormDescription>
                    هل يظهر هذا الحقل في جميع النماذج افتراضيًا؟
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
        </div>

        {hasOptions(fieldType as FieldType) && (
          <>
            <Separator />
            <div className="space-y-4">
              <FormLabel className="text-base">الخيارات</FormLabel>
              <FormDescription>
                قائمة الخيارات المتاحة للمستخدم.
              </FormDescription>
              
              {form.watch('options')?.map((_, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`options.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">عنوان الخيار</FormLabel>
                          <FormControl>
                            <Input placeholder="عنوان الخيار" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`options.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">قيمة الخيار</FormLabel>
                          <FormControl>
                            <Input placeholder="قيمة الخيار" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const currentOptions = form.getValues('options') || [];
                      if (currentOptions.length > 1) {
                        form.setValue('options', 
                          currentOptions.filter((_, i) => i !== index)
                        );
                      } else {
                        toast.error('يجب أن يكون هناك خيار واحد على الأقل');
                      }
                    }}
                    className="mt-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentOptions = form.getValues('options') || [];
                  form.setValue('options', [
                    ...currentOptions,
                    { label: '', value: '' }
                  ]);
                }}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> إضافة خيار
              </Button>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit">
            {property ? 'تحديث الخاصية' : 'إضافة خاصية'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;
