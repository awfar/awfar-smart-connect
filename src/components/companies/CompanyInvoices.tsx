
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface CompanyInvoicesProps {
  companyId: string;
}

export const CompanyInvoices: React.FC<CompanyInvoicesProps> = ({ companyId }) => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['company-invoices', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('company_id', companyId)
        .order('issue_date', { ascending: false });
      
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
        <h3 className="text-lg font-semibold">الفواتير</h3>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة فاتورة
        </Button>
      </div>
      
      {invoices?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد فواتير بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices?.map((invoice) => (
            <div key={invoice.id} className="p-4 border rounded-lg">
              <div className="flex justify-between">
                <div className="font-medium">فاتورة #{invoice.id.slice(0, 8)}</div>
                <div className="text-sm">{invoice.total_amount} ريال</div>
              </div>
              <div className="text-sm text-muted-foreground">
                تاريخ الإصدار: {format(new Date(invoice.issue_date), 'dd/MM/yyyy')}
              </div>
              <div className="text-sm">الحالة: {invoice.status}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
