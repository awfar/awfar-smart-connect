
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CompanyLeadsProps {
  companyId: string;
}

export const CompanyLeads: React.FC<CompanyLeadsProps> = ({ companyId }) => {
  const { data: leads, isLoading } = useQuery({
    queryKey: ['company-leads', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
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
        <h3 className="text-lg font-semibold">العملاء المحتملين</h3>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة عميل محتمل
        </Button>
      </div>
      
      {leads?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا يوجد عملاء محتملين بعد</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads?.map((lead) => (
            <div key={lead.id} className="p-4 border rounded-lg">
              <div className="font-medium">{`${lead.first_name} ${lead.last_name}`}</div>
              <div className="text-sm text-muted-foreground">{lead.email}</div>
              <div className="text-sm">{lead.position}</div>
              {lead.phone && (
                <div className="text-sm text-muted-foreground mt-1">{lead.phone}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
