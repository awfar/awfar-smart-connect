
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, AlertCircle } from "lucide-react";
import FileUpload from "@/components/cms/FileUpload";
import { CompanyDocument } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CompanyDocumentsProps {
  companyId: string;
}

export const CompanyDocuments: React.FC<CompanyDocumentsProps> = ({ companyId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('quotations');
  const [currentFile, setCurrentFile] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: 'quotations', name: 'عروض الأسعار' },
    { id: 'contracts', name: 'العقود والملحقات' },
    { id: 'invoices', name: 'الفواتير' },
    { id: 'company_files', name: 'الملفات الرسمية' },
  ];

  const subcategories = {
    company_files: [
      { id: 'tax_records', name: 'السجلات الضريبية' },
      { id: 'commercial_registry', name: 'السجل التجاري' },
      { id: 'licenses', name: 'التراخيص' },
    ]
  };

  const handleUpload = async (fileUrl: string) => {
    if (!fileUrl) return;

    try {
      setUploading(true);
      
      const { error } = await supabase
        .from('company_documents')
        .insert({
          company_id: companyId,
          name: fileUrl.split('/').pop(),
          file_url: fileUrl,
          category: selectedCategory,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success('تم رفع الملف بنجاح');
      setCurrentFile('');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('حدث خطأ أثناء رفع الملف');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="quotations" className="w-full">
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <FileUpload
                currentUrl={currentFile}
                onFileUploaded={(url) => handleUpload(url)}
              />
            </div>

            {category.id === 'company_files' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subcategories.company_files.map((subcat) => (
                  <Card key={subcat.id} className="p-4">
                    <h4 className="font-semibold mb-2">{subcat.name}</h4>
                    <div className="flex items-center gap-2">
                      <FileText className="text-muted-foreground" size={20} />
                      <span className="text-sm text-muted-foreground">
                        اضغط لعرض الملفات
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};
