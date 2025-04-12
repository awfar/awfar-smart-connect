
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Property, 
  PropertyType, 
  FieldType 
} from '@/services/propertiesService';
import { X, Plus, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PropertyFormProps {
  property?: Property;
  type: PropertyType;
  onSubmit: (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const fieldTypeOptions: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'نص' },
  { value: 'textarea', label: 'نص طويل' },
  { value: 'number', label: 'رقم' },
  { value: 'email', label: 'بريد إلكتروني' },
  { value: 'phone', label: 'هاتف' },
  { value: 'date', label: 'تاريخ' },
  { value: 'datetime', label: 'تاريخ ووقت' },
  { value: 'select', label: 'اختيار منفرد' },
  { value: 'checkbox', label: 'اختيار متعدد' },
  { value: 'radio', label: 'زر راديو' },
  { value: 'url', label: 'رابط' },
];

const PropertyForm: React.FC<PropertyFormProps> = ({ property, type, onSubmit, onCancel }) => {
  const [fieldType, setFieldType] = useState<FieldType>(property?.fieldType || 'text');
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    property?.options || []
  );
  const [activeTab, setActiveTab] = useState<string>("basic");

  const formSchema = z.object({
    name: z.string().min(1, { message: "اسم الخاصية مطلوب" })
      .regex(/^[a-z_][a-z0-9_]*$/, { 
        message: "يجب أن يبدأ الاسم بحرف صغير أو شرطة سفلية ويحتوي على أحرف صغيرة وأرقام وشرطات سفلية فقط" 
      }),
    label: z.string().min(1, { message: "عنوان الخاصية مطلوب" }),
    fieldType: z.string(),
    description: z.string().optional(),
    isRequired: z.boolean().default(false),
    isDefault: z.boolean().default(false),
    placeholder: z.string().optional(),
    defaultValue: z.string().optional(),
    group: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: property?.name || '',
      label: property?.label || '',
      fieldType: property?.fieldType || 'text',
      description: property?.description || '',
      isRequired: property?.isRequired || false,
      isDefault: property?.isDefault || false,
      placeholder: property?.placeholder || '',
      defaultValue: property?.defaultValue || '',
      group: property?.group || '',
    },
  });

  useEffect(() => {
    if (property?.fieldType) {
      setFieldType(property.fieldType);
    }
  }, [property]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'> = {
      name: values.name,
      label: values.label,
      type,
      fieldType: values.fieldType as FieldType,
      description: values.description,
      isRequired: values.isRequired,
      isDefault: values.isDefault,
      isSystem: property?.isSystem || false,
      placeholder: values.placeholder,
      defaultValue: values.defaultValue,
      group: values.group,
      options: ['select', 'checkbox', 'radio'].includes(values.fieldType) ? options : undefined,
    };

    onSubmit(propertyData);
  };

  const addOption = () => {
    setOptions([...options, { value: '', label: '' }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: 'value' | 'label', value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const validateOptions = () => {
    if (['select', 'checkbox', 'radio'].includes(fieldType) && options.length === 0) {
      return false;
    }
    
    if (['select', 'checkbox', 'radio'].includes(fieldType)) {
      for (const option of options) {
        if (!option.value.trim() || !option.label.trim()) {
          return false;
        }
      }
    }
    
    return true;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="basic">معلومات أساسية</TabsTrigger>
            <TabsTrigger value="advanced">إعدادات متقدمة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان الخاصية</FormLabel>
                    <FormControl>
                      <Input placeholder="الاسم الأول" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>اسم الخاصية التقني</FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-5 h-5 rounded-full p-0">
                            <HelpCircle className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">اسم تقني يستخدم داخل النظام ويجب أن يكون بالإنجليزية بدون مسافات أو رموز خاصة</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <Input placeholder="first_name" {...field} />
                    </FormControl>
                    <FormDescription>
                      اسم تقني يتم استخدامه في قاعدة البيانات
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      setFieldType(value as FieldType);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الحقل" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea placeholder="وصف الخاصية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {['select', 'checkbox', 'radio'].includes(fieldType) && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>الخيارات</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="h-4 w-4 mr-1" /> إضافة خيار
                  </Button>
                </div>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option.label}
                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                        placeholder="العنوان"
                        className="flex-1"
                      />
                      <Input
                        value={option.value}
                        onChange={(e) => updateOption(index, 'value', e.target.value)}
                        placeholder="القيمة"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {options.length === 0 && (
                    <div className="text-center py-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground text-sm">أضف خيارات للحقل</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>النص التوضيحي</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل..." {...field} />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                    المجموعة التي تنتمي إليها هذه الخاصية (اختياري)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">إلزامي</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">عرض بشكل افتراضي</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button 
            type="submit"
            disabled={!validateOptions()}
          >
            {property ? 'تحديث الخاصية' : 'إضافة خاصية'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;
