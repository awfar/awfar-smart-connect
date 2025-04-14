
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  X, Mail, Phone, MapPin, Building, Calendar, Briefcase, 
  MoreVertical, Edit, Trash, Clock, AlertCircle, CheckCircle, 
  CircleCheck, FileEdit, Loader2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStageColorClass } from "@/services/leads/utils";
import { Lead, LeadActivity } from "@/services/types/leadTypes";
import { useQuery } from "@tanstack/react-query";
import { getLeadActivities, completeLeadActivity } from "@/services/leads";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import ActivityForm from "./ActivityForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onRefresh?: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ 
  lead, 
  onClose, 
  onEdit, 
  onDelete,
  onRefresh 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("activities");
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [processingActivity, setProcessingActivity] = useState<string | null>(null);
  
  // Fetch activities for this lead
  const { 
    data: activities = [], 
    isLoading: loadingActivities,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ["leadActivities", lead?.id],
    queryFn: () => getLeadActivities(lead.id),
    enabled: !!lead?.id
  });
  
  // If no lead is provided, show empty state
  if (!lead) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-semibold">تفاصيل العميل المحتمل</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48">
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get full name from first and last name
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
  
  // Use owner from lead or create default owner object
  const owner = lead.owner || { 
    name: "غير مخصص", 
    avatar: "/placeholder.svg", 
    initials: "؟" 
  };
  
  // Handle activity actions
  const handleAddActivity = (activity?: LeadActivity) => {
    setShowActivityForm(false);
    if (activity) {
      refetchActivities();
      onRefresh?.();
    }
  };
  
  const handleCompleteActivity = async (activityId: string) => {
    try {
      setProcessingActivity(activityId);
      await completeLeadActivity(activityId);
      refetchActivities();
      onRefresh?.();
    } catch (error) {
      console.error("Error completing activity:", error);
    } finally {
      setProcessingActivity(null);
    }
  };
  
  // Handle navigation to full lead details
  const handleViewDetails = () => {
    navigate(`/dashboard/leads/${lead.id}`);
  };
  
  // Handle lead edit
  const handleEdit = () => {
    if (onEdit) {
      onEdit(lead);
    } else {
      navigate(`/dashboard/leads/${lead.id}/edit`);
    }
  };
  
  // Handle lead deletion
  const handleDelete = () => {
    if (onDelete) {
      onDelete(lead.id);
    } else {
      toast.error("عملية الحذف غير متاحة");
    }
  };
  
  // Filter activities by tab
  const filteredActivities = {
    activities: activities.filter(act => act.type !== 'task' && act.type !== 'note'),
    tasks: activities.filter(act => act.type === 'task'),
    notes: activities.filter(act => act.type === 'note'),
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold">تفاصيل العميل المحتمل</CardTitle>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>خيارات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewDetails}>
                <FileEdit className="mr-2 h-4 w-4" />
                عرض التفاصيل الكاملة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                تحرير البيانات
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowActivityForm(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                إضافة نشاط
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                حذف العميل المحتمل
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center text-center gap-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-lg">{fullName.charAt(0) || "؟"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{fullName}</h3>
              <p className="text-sm text-muted-foreground">{lead.company || "بدون شركة"}</p>
            </div>
            <Badge className={getStageColorClass(lead.status || lead.stage || "جديد")}>
              {lead.status || lead.stage || "جديد"}
            </Badge>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{lead.email || "غير محدد"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{lead.phone || "غير محدد"}</p>
            </div>
            {lead.position && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{lead.position}</p>
              </div>
            )}
            {lead.country && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{lead.country}</p>
              </div>
            )}
            {lead.industry && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{lead.industry}</p>
              </div>
            )}
            {lead.source && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">المصدر: {lead.source}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="text-sm text-muted-foreground">المسؤول</div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={owner?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{owner?.initials || "؟"}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{owner?.name || "غير مخصص"}</span>
            </div>
          </div>

          <Tabs defaultValue="activities" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="activities">الأنشطة</TabsTrigger>
              <TabsTrigger value="tasks">المهام</TabsTrigger>
              <TabsTrigger value="notes">الملاحظات</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs" 
                onClick={() => setShowActivityForm(true)}
              >
                + إضافة نشاط جديد
              </Button>
              
              {loadingActivities ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2">جاري تحميل البيانات...</span>
                </div>
              ) : filteredActivities.activities.length > 0 ? (
                filteredActivities.activities.map(activity => (
                  <div key={activity.id} className="border-b pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {activity.created_by ? typeof activity.created_by === 'string' ? activity.created_by.substring(0, 2).toUpperCase() : activity.created_by.first_name?.charAt(0) || '؟' : '؟'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{owner?.name || "غير معروف"}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type === "call" && "مكالمة"}
                          {activity.type === "email" && "بريد"}
                          {activity.type === "meeting" && "اجتماع"}
                          {activity.type === "whatsapp" && "واتساب"}
                        </Badge>
                      </div>
                      {activity.scheduled_at && !activity.completed_at && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          disabled={processingActivity === activity.id}
                          onClick={() => handleCompleteActivity(activity.id)}
                        >
                          {processingActivity === activity.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-sm mb-1">{activity.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        {activity.created_at && format(new Date(activity.created_at), "yyyy/MM/dd HH:mm", { locale: ar })}
                      </p>
                      {activity.scheduled_at && (
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span className={activity.completed_at ? "line-through text-muted-foreground" : ""}>
                            {format(new Date(activity.scheduled_at), "yyyy/MM/dd", { locale: ar })}
                          </span>
                          {activity.completed_at && (
                            <CircleCheck className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  لا توجد أنشطة مسجلة
                </p>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs" 
                onClick={() => {
                  setActiveTab("activities");
                  setShowActivityForm(true);
                }}
              >
                + إضافة مهمة جديدة
              </Button>
              
              {loadingActivities ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2">جاري تحميل البيانات...</span>
                </div>
              ) : filteredActivities.tasks.length > 0 ? (
                filteredActivities.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className={`text-sm font-medium ${task.completed_at ? 'line-through text-muted-foreground' : ''}`}>
                          {task.description}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {task.created_at && format(new Date(task.created_at), "yyyy/MM/dd", { locale: ar })}
                      </p>
                    </div>
                    {!task.completed_at ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7"
                        disabled={processingActivity === task.id}
                        onClick={() => handleCompleteActivity(task.id)}
                      >
                        {processingActivity === task.id ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        )}
                        إكمال
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        مكتمل
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  لا توجد مهام مسجلة
                </p>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs" 
                onClick={() => {
                  setActiveTab("activities");
                  setShowActivityForm(true);
                }}
              >
                + إضافة ملاحظة جديدة
              </Button>
              
              {loadingActivities ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2">جاري تحميل البيانات...</span>
                </div>
              ) : filteredActivities.notes.length > 0 ? (
                filteredActivities.notes.map(note => (
                  <div key={note.id} className="border-b pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {note.created_by ? typeof note.created_by === 'string' ? note.created_by.substring(0, 2).toUpperCase() : note.created_by.first_name?.charAt(0) || '؟' : '؟'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{owner?.name || "غير معروف"}</span>
                      <span className="text-xs text-muted-foreground">
                        {note.created_at && format(new Date(note.created_at), "yyyy/MM/dd HH:mm", { locale: ar })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  لا توجد ملاحظات مسجلة
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={handleViewDetails}
        >
          عرض التفاصيل الكاملة
        </Button>
        
        <Button size="sm" className="gap-1" onClick={handleEdit}>
          <Edit className="mr-1 h-4 w-4" />
          تحرير
        </Button>
      </CardFooter>
      
      <Dialog open={showActivityForm} onOpenChange={setShowActivityForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة نشاط جديد</DialogTitle>
          </DialogHeader>
          <ActivityForm 
            leadId={lead.id} 
            onSuccess={handleAddActivity}
            onClose={() => setShowActivityForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LeadDetails;
