
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CompanyDealsProps {
  companyId: string;
}

export const CompanyDeals: React.FC<CompanyDealsProps> = ({ companyId }) => {
  const { data: deals, isLoading } = useQuery({
    queryKey: ['company-deals', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
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
        <h3 className="text-lg font-semibold">الفرص</h3>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة فرصة
        </Button>
      </div>
      
      {deals?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد فرص بعد</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {deals?.map((deal) => (
            <div key={deal.id} className="p-4 border rounded-lg">
              <div className="font-medium">{deal.name}</div>
              <div className="text-sm text-muted-foreground">{deal.stage}</div>
              <div className="text-sm">القيمة: {deal.value}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
