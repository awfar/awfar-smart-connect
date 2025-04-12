
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  fetchFormWithFields, 
  FormWithFields 
} from '@/services/formBuilderService';
import { 
  getPropertiesByType, 
  Property 
} from '@/services/propertiesService';
import DynamicForm from '@/components/forms/DynamicForm';
import { Loader2 } from 'lucide-react';

const FormEmbed: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormWithFields | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) {
        setError("معرف النموذج غير صالح");
        setIsLoading(false);
        return;
      }
      
      try {
        const formData = await fetchFormWithFields(formId);
        if (!formData) {
          setError("النموذج غير موجود");
          setIsLoading(false);
          return;
        }
        
        setForm(formData);
        
        // Load properties for this form type
        const propertiesData = await getPropertiesByType(formData.type);
        setProperties(propertiesData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading form:', error);
        setError("حدث خطأ أثناء تحميل النموذج");
        setIsLoading(false);
      }
    };
    
    loadForm();
  }, [formId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">خطأ</h2>
          <p>{error || "النموذج غير متاح"}</p>
        </div>
      </div>
    );
  }

  if (!form.isActive) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">النموذج غير مفعل</h2>
          <p>هذا النموذج غير متاح للاستخدام حاليًا</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 md:p-6 rtl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{form?.name}</h1>
        {form?.description && (
          <p className="text-muted-foreground mb-4">{form?.description}</p>
        )}
        
        <DynamicForm 
          form={form} 
          properties={properties}
        />
      </div>
    </div>
  );
};

export default FormEmbed;
