
import React, { useState } from 'react';
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
import { FormWithFields, submitFormData } from '@/services/formBuilderService';
import { Property } from '@/services/propertiesService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DynamicFormProps {
  form: FormWithFields;
  properties: Property[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ 
  form, 
  properties,
  onSuccess,
  onError
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Build schema dynamically based on form fields
  const buildZodSchema = () => {
    const schemaMap: any = {};
    
    form.fields.forEach((field) => {
      const property = properties.find(p => p.id === field.propertyId);
      if (!property || !field.isVisible) return;
      
      let fieldSchema: any;
      switch (property.fieldType) {
        case 'text':
        case 'textarea':
          fieldSchema = z.string();
          break;
        case 'email':
          fieldSchema = z.string().email({ message: 'البريد الإلكتروني غير صالح' });
          break;
        case 'number':
          fieldSchema = z.coerce.number();
          break;
        case 'date':
        case 'datetime':
          fieldSchema = z.string();
          break;
        case 'select':
        case 'radio':
          fieldSchema = z.string();
          break;
        case 'checkbox':
          fieldSchema = z.array(z.string()).optional();
          break;
        case 'phone':
          fieldSchema = z.string().regex(/^[0-9+\s()-]+$/, { 
            message: 'رقم الهاتف غير صالح' 
          });
          break;
        case 'url':
          fieldSchema = z.string().url({ message: 'الرابط غير صالح' });
          break;
        default:
          fieldSchema = z.string();
      }
      
      if (field.isRequired) {
        if (property.fieldType === 'checkbox') {
          fieldSchema = z.array(z.string()).min(1, { message: 'يجب اختيار خيار واحد على الأقل' });
        } else {
          fieldSchema = fieldSchema.min(1, { message: 'هذا الحقل مطلوب' });
        }
      } else {
        if (property.fieldType !== 'checkbox') {
          fieldSchema = fieldSchema.optional();
        }
      }
      
      schemaMap[property.name] = fieldSchema;
    });
    
    return z.object(schemaMap);
  };

  const formSchema = buildZodSchema();
  
  // Build default values for the form
  const buildDefaultValues = () => {
    const defaultValues: any = {};
    
    form.fields.forEach((field) => {
      const property = properties.find(p => p.id === field.propertyId);
      if (!property || !field.isVisible) return;
      
      if (property.defaultValue) {
        if (property.fieldType === 'checkbox') {
          defaultValues[property.name] = [property.defaultValue];
        } else {
          defaultValues[property.name] = property.defaultValue;
        }
      } else {
        if (property.fieldType === 'checkbox') {
          defaultValues[property.name] = [];
        } else {
          defaultValues[property.name] = '';
        }
      }
    });
    
    return defaultValues;
  };
  
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaultValues(),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await submitFormData(form.id, values);
      setIsSubmitted(true);
      toast.success(form.successMessage || 'تم إرسال النموذج بنجاح');
      formMethods.reset();
      
      if (form.redirectUrl) {
        window.location.href = form.redirectUrl;
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('حدث خطأ أثناء إرسال النموذج');
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && !form.redirectUrl) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium mb-2">{form.successMessage || 'تم إرسال النموذج بنجاح'}</h3>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="mt-4"
        >
          إرسال نموذج آخر
        </Button>
      </div>
    );
  }

  return (
    <Form {...formMethods}>
      <form 
        onSubmit={formMethods.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        {form.fields
          .sort((a, b) => a.order - b.order)
          .map((field) => {
            const property = properties.find(p => p.id === field.propertyId);
            if (!property || !field.isVisible) return null;
            
            return (
              <FormField
                key={field.propertyId}
                control={formMethods.control}
                name={property.name as any}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {property.label}
                      {field.isRequired && <span className="text-red-500 mr-1">*</span>}
                    </FormLabel>
                    <FormControl>
                      {renderFormControl(property, formField)}
                    </FormControl>
                    {property.description && (
                      <FormDescription>
                        {property.description}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
          
        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {form.submitButtonText || 'إرسال'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

function renderFormControl(property: Property, field: any) {
  switch (property.fieldType) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <Input 
          {...field} 
          type={property.fieldType === 'email' ? 'email' : 'text'}
          placeholder={property.placeholder || ''}
        />
      );
      
    case 'number':
      return (
        <Input 
          {...field} 
          type="number"
          placeholder={property.placeholder || ''}
          onChange={(e) => field.onChange(e.target.valueAsNumber)}
        />
      );
      
    case 'textarea':
      return (
        <Textarea 
          {...field} 
          placeholder={property.placeholder || ''}
        />
      );
      
    case 'select':
      return (
        <Select
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={property.placeholder || 'اختر...'} />
          </SelectTrigger>
          <SelectContent>
            {property.options?.map((option, i) => (
              <SelectItem key={i} value={option.value || `option-${i}`}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
    case 'checkbox':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {property.options?.map((option, i) => (
            <div 
              key={option.value || `option-${i}`} 
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Checkbox
                id={`${property.name}-${option.value || `option-${i}`}`}
                checked={field.value?.includes(option.value || `option-${i}`)}
                onCheckedChange={(checked) => {
                  const currentValues = field.value || [];
                  const optionValue = option.value || `option-${i}`;
                  if (checked) {
                    field.onChange([...currentValues, optionValue]);
                  } else {
                    field.onChange(
                      currentValues.filter((value: string) => value !== optionValue)
                    );
                  }
                }}
              />
              <label
                htmlFor={`${property.name}-${option.value || `option-${i}`}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );
      
    case 'radio':
      return (
        <RadioGroup
          value={field.value}
          onValueChange={field.onChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          {property.options?.map((option, i) => (
            <div key={option.value || `option-${i}`} className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value={option.value || `option-${i}`} id={`${property.name}-${option.value || `option-${i}`}`} />
              <label
                htmlFor={`${property.name}-${option.value || `option-${i}`}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      );
      
    case 'date':
      return (
        <Input 
          {...field} 
          type="date"
          placeholder={property.placeholder || ''}
        />
      );
      
    case 'datetime':
      return (
        <Input 
          {...field} 
          type="datetime-local"
          placeholder={property.placeholder || ''}
        />
      );
      
    default:
      return (
        <Input 
          {...field} 
          placeholder={property.placeholder || ''}
        />
      );
  }
}

export default DynamicForm;
