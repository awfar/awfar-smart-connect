
import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface CompanyTimelineProps {
  companyId: string;
}

export const CompanyTimeline: React.FC<CompanyTimelineProps> = ({ companyId }) => {
  const { data: timeline, isLoading } = useQuery({
    queryKey: ['company-timeline', companyId],
    queryFn: async () => {
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'company')
        .eq('entity_id', companyId)
        .order('created_at', { ascending: false });
      
      return activities || [];
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
      <h3 className="text-lg font-semibold mb-6">التسلسل الزمني</h3>
      
      {timeline?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد أحداث في التسلسل الزمني</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timeline?.map((event) => (
            <div key={event.id} className="p-4 border rounded-lg">
              <div className="font-medium">{event.action}</div>
              {event.details && <div className="text-sm">{event.details}</div>}
              <div className="text-sm text-muted-foreground">
                {format(new Date(event.created_at), 'dd/MM/yyyy HH:mm')}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
