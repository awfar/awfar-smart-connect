import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar, Check, MessageCircle, Phone, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { addDealActivity, completeDealActivity } from "@/services/dealsService";
import { DealActivity } from "@/services/types/dealTypes";

interface DealActivityTimelineProps {
  dealId: string;
  activities: DealActivity[];
  isLoading?: boolean;
  onActivityAdded?: () => void;
}

const DealActivityTimeline = ({ 
  dealId, 
  activities, 
  isLoading = false,
  onActivityAdded 
}: DealActivityTimelineProps) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleAddActivity = async (type: string) => {
    if (!newNote.trim() && type === 'note') {
      toast.error("يرجى إدخال محتوى الملاحظة");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addDealActivity({
        deal_id: dealId,
        type,
        description: newNote || `تم إضافة نشاط من نوع ${type}`
      });
      
      toast.success("تمت إضافة النشاط بنجاح");
      setNewNote('');
      
      if (onActivityAdded) {
        onActivityAdded();
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast.error(`فشل في إضافة ${type}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleComplete = async (activityId: string) => {
    try {
      await completeDealActivity(activityId);
      toast.success("تم تحديث حالة النشاط بنجاح");
      
      if (onActivityAdded) {
        onActivityAdded();
      }
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("فشل في تحديث حالة النشاط");
    }
  };

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "d MMMM yyyy, h:mm a", { locale: ar });
    } catch (e) {
      return dateStr;
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'call':
        return <Phone className="h-5 w-5 text-green-500" />;
      case 'meeting':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };
  
  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle>الأنشطة والملاحظات</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="border rounded-lg p-4">
          <Textarea
            placeholder="أضف ملاحظة..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="mb-4 resize-none"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => handleAddActivity('note')} 
              disabled={isSubmitting || !newNote.trim()}
              size="sm"
            >
              <MessageCircle className="ml-2 h-4 w-4" />
              إضافة ملاحظة
            </Button>
            
            <Button 
              onClick={() => handleAddActivity('call')} 
              disabled={isSubmitting}
              variant="outline"
              size="sm"
            >
              <Phone className="ml-2 h-4 w-4" />
              تسجيل مكالمة
            </Button>
            
            <Button 
              onClick={() => handleAddActivity('meeting')} 
              disabled={isSubmitting}
              variant="outline"
              size="sm"
            >
              <Calendar className="ml-2 h-4 w-4" />
              إضافة اجتماع
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="note">الملاحظات</TabsTrigger>
            <TabsTrigger value="call">المكالمات</TabsTrigger>
            <TabsTrigger value="meeting">الاجتماعات</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredActivities.length === 0 ? (
              <Alert>
                <AlertDescription>
                  لا توجد أنشطة بعد. أضف نشاطًا جديدًا.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="border rounded-md p-4 relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{activity.creator?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(activity.created_at)}
                            </span>
                          </div>
                          {activity.type === 'call' || activity.type === 'meeting' ? (
                            activity.scheduled_at && !activity.completed_at && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 px-2"
                                onClick={() => handleComplete(activity.id)}
                              >
                                <Check className="h-4 w-4 ml-1" />
                                تم
                              </Button>
                            )
                          ) : null}
                        </div>
                        <p className="mt-1 whitespace-pre-wrap">{activity.description}</p>
                        {(activity.type === 'call' || activity.type === 'meeting') && activity.scheduled_at && (
                          <div className="mt-2 text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3.5 w-3.5 ml-1" />
                            {activity.completed_at ? 
                              `تم الإكمال في ${formatDate(activity.completed_at)}` : 
                              `مجدول في ${formatDate(activity.scheduled_at)}`
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DealActivityTimeline;
