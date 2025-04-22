
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface CompanyActivitiesProps {
  companyId: string;
}

export const CompanyActivities: React.FC<CompanyActivitiesProps> = ({ companyId }) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['company-activities', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_activities')
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
        <h3 className="text-lg font-semibold">الأنشطة</h3>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة نشاط
        </Button>
      </div>
      
      {activities?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد أنشطة بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity.id} className="p-4 border rounded-lg">
              <div className="font-medium">{activity.type}</div>
              <div className="text-sm">{activity.description}</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm')}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
