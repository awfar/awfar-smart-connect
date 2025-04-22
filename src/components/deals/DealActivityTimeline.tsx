
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  FileText, 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Loader2 
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DealActivity } from "@/services/types/dealTypes";
import { addDealActivity } from "@/services/dealsService";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface DealActivityTimelineProps {
  dealId: string;
  activities: DealActivity[];
  isLoading?: boolean;
  onActivityAdded: () => void;
}

const DealActivityTimeline = ({ dealId, activities, isLoading = false, onActivityAdded }: DealActivityTimelineProps) => {
  const [newActivity, setNewActivity] = useState("");
  const [activityType, setActivityType] = useState<string>("note");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "note":
        return <MessageCircle className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      case "task":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getActivityTypeText = (type: string): string => {
    const typeMap: {[key: string]: string} = {
      'note': 'ملاحظة',
      'call': 'مكالمة',
      'email': 'بريد إلكتروني',
      'meeting': 'اجتماع',
      'task': 'مهمة',
      'update': 'تحديث',
      'create': 'إنشاء',
      'whatsapp': 'واتساب'
    };
    
    return typeMap[type] || type;
  };
  
  const formatActivityDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "d MMM yyyy HH:mm", { locale: ar });
    } catch (e) {
      return dateStr;
    }
  };
  
  const handleAddActivity = async () => {
    if (!newActivity.trim()) {
      toast.error("يرجى إدخال تفاصيل النشاط");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addDealActivity({
        deal_id: dealId,
        type: activityType,
        description: newActivity.trim()
      });
      
      toast.success("تمت إضافة النشاط بنجاح");
      setNewActivity("");
      onActivityAdded();
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("فشل في إضافة النشاط");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>التسلسل الزمني</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new activity form */}
          <div className="space-y-3 mb-6 p-4 border rounded-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">ملاحظة</SelectItem>
                  <SelectItem value="call">مكالمة</SelectItem>
                  <SelectItem value="email">بريد إلكتروني</SelectItem>
                  <SelectItem value="meeting">اجتماع</SelectItem>
                  <SelectItem value="task">مهمة</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1">
                <Textarea 
                  placeholder="أضف نشاطاً جديداً..." 
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleAddActivity} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة نشاط
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">لا توجد أنشطة بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="relative pr-6 pb-8 border-r">
                  {/* Timeline dot */}
                  <div className="absolute right-[-8px] w-4 h-4 rounded-full border-2 border-background bg-primary"></div>
                  
                  <div className="mb-1 flex items-center">
                    <div className={cn(
                      "ml-2 flex h-6 w-6 items-center justify-center rounded-full",
                      activity.type === 'note' ? "bg-blue-100 text-blue-700" :
                      activity.type === 'call' ? "bg-green-100 text-green-700" :
                      activity.type === 'email' ? "bg-amber-100 text-amber-700" :
                      activity.type === 'meeting' ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <span className="font-medium">{getActivityTypeText(activity.type)}</span>
                  </div>
                  
                  <div className="pr-2">
                    <p className="text-sm whitespace-pre-wrap mb-2">{activity.description}</p>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center">
                        {activity.creator ? (
                          <div className="flex items-center">
                            <Avatar className="h-5 w-5 text-[10px] ml-1.5">
                              {activity.creator.name.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <span>{activity.creator.name}</span>
                          </div>
                        ) : (
                          <span>مستخدم النظام</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 ml-1" />
                        <span dir="ltr">{formatActivityDate(activity.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealActivityTimeline;
