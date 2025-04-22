
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CompanyContactsProps {
  companyId: string;
}

export const CompanyContacts: React.FC<CompanyContactsProps> = ({ companyId }) => {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['company-contacts', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_contacts')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-24 flex items-center justify-center">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">جهات الاتصال</h3>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة جهة اتصال
        </Button>
      </div>
      
      {contacts?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد جهات اتصال بعد</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {contacts?.map((contact) => (
            <div key={contact.id} className="p-4 border rounded-lg">
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-muted-foreground">{contact.position}</div>
              <div className="text-sm">{contact.email}</div>
              {contact.phone && <div className="text-sm">{contact.phone}</div>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
