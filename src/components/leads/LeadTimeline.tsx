
import React from 'react';
import { Card } from "@/components/ui/card";
import { Loader2, FileText, Phone, Mail, Calendar, MessageSquare } from "lucide-react";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface LeadTimelineProps {
  activities: any[];
  tasks: any[];
  appointments: any[];
  isLoading: boolean;
  onEdit: (type: string, item: any) => void;
  onDelete: (type: string, itemId: string) => void;
  onComplete: (type: string, itemId: string) => void;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({ 
  activities, 
  tasks, 
  appointments, 
  isLoading,
  onEdit,
  onDelete,
  onComplete
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">جاري تحميل البيانات...</span>
      </div>
    );
  }

  // Combine and sort all timeline items by date
  const allItems = [
    ...(activities || []).map(item => ({ ...item, itemType: 'activity' })),
    ...(tasks || []).map(item => ({ ...item, itemType: 'task' })),
    ...(appointments || []).map(item => ({ ...item, itemType: 'appointment' }))
  ].sort((a, b) => {
    const dateA = new Date(a.created_at || a.scheduled_at || a.due_date || 0);
    const dateB = new Date(b.created_at || b.scheduled_at || b.due_date || 0);
    return dateB.getTime() - dateA.getTime();
  });

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    try {
      return format(new Date(date), 'yyyy/MM/dd', { locale: ar });
    } catch (e) {
      return 'تاريخ غير صالح';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note': return <FileText className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (allItems.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        لا توجد أنشطة أو مهام مسجلة بعد.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {allItems.map(item => (
        <Card key={`${item.itemType}-${item.id}`} className="p-4">
          <div className="flex gap-4">
            <div className="rounded-full bg-primary/10 p-2 h-10 w-10 flex items-center justify-center">
              {item.itemType === 'activity' && getActivityIcon(item.type)}
              {item.itemType === 'task' && <FileText className="h-4 w-4" />}
              {item.itemType === 'appointment' && <Calendar className="h-4 w-4" />}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {item.itemType === 'activity' && (
                        item.type === 'note' ? 'ملاحظة' : 
                        item.type === 'call' ? 'مكالمة' : 
                        item.type === 'email' ? 'بريد إلكتروني' : 
                        item.type === 'meeting' ? 'اجتماع' : 
                        item.type === 'whatsapp' ? 'واتساب' : 'نشاط'
                      )}
                      {item.itemType === 'task' && item.title}
                      {item.itemType === 'appointment' && item.title}
                    </h3>
                    {item.itemType === 'task' && item.status && (
                      <Badge variant={item.status === 'completed' ? 'success' : 'secondary'}>
                        {item.status === 'pending' ? 'قيد الانتظار' : 
                         item.status === 'in_progress' ? 'قيد التنفيذ' :
                         item.status === 'completed' ? 'مكتملة' : 'ملغاة'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mt-1">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                    {item.created_at && (
                      <span>تاريخ الإنشاء: {formatDate(item.created_at)}</span>
                    )}
                    {item.scheduled_at && (
                      <span>موعد: {formatDate(item.scheduled_at)}</span>
                    )}
                    {item.due_date && (
                      <span>تاريخ الاستحقاق: {formatDate(item.due_date)}</span>
                    )}
                    {item.created_by && (
                      <span>بواسطة: {typeof item.created_by === 'object' ? 
                        `${item.created_by.first_name || ''} ${item.created_by.last_name || ''}`.trim() : 
                        item.created_by}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {item.itemType !== 'activity' && item.status !== 'completed' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onComplete(item.itemType, item.id)}
                    >
                      إكمال
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onEdit(item.itemType, item)}
                  >
                    تعديل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onDelete(item.itemType, item.id)}
                  >
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LeadTimeline;
