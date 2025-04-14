
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Mail, Phone, MapPin, Building, Calendar, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStageColorClass } from "@/services/leads/utils";
import { Lead } from "@/services/types/leadTypes";
import { useQuery } from "@tanstack/react-query";
import { getLeadActivities } from "@/services/leads";

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("activities");
  
  // Fetch activities for this lead
  const { data: activities = [], isLoading: loadingActivities } = useQuery({
    queryKey: ["leadActivities", lead.id],
    queryFn: () => getLeadActivities(lead.id),
    enabled: !!lead.id
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
  
  // Handle double click to navigate to lead details
  const handleViewDetails = () => {
    navigate(`/dashboard/leads/${lead.id}`);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold">تفاصيل العميل المحتمل</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
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
              {loadingActivities ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : activities.length > 0 ? (
                activities
                  .filter(act => act.type !== 'task' && act.type !== 'note')
                  .slice(0, 3)
                  .map(activity => (
                    <div key={activity.id} className="border-b pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {activity.created_by ? activity.created_by.substring(0, 2).toUpperCase() : '؟'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{owner?.name || "غير معروف"}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type === "call" && "مكالمة"}
                          {activity.type === "email" && "بريد"}
                          {activity.type === "meeting" && "اجتماع"}
                        </Badge>
                      </div>
                      <p className="text-sm mb-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.created_at ? new Date(activity.created_at).toLocaleString('ar-SA') : ''}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  لا توجد أنشطة مسجلة
                </p>
              )}
              {activities.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleViewDetails}>
                  عرض المزيد ({activities.length - 3})
                </Button>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {loadingActivities ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                activities
                  .filter(act => act.type === 'task')
                  .slice(0, 3)
                  .map(task => (
                    <div key={task.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">{task.description}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">المكلف: {owner?.name || "غير محدد"}</p>
                      </div>
                      <Badge variant={task.completed_at ? "secondary" : "outline"}>
                        {task.scheduled_at ? new Date(task.scheduled_at).toLocaleDateString('ar-SA') : "غير محدد"}
                      </Badge>
                    </div>
                  ))
              )}
              {activities.filter(act => act.type === 'task').length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  لا توجد مهام مسجلة
                </p>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              {loadingActivities ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                activities
                  .filter(act => act.type === 'note')
                  .slice(0, 3)
                  .map(note => (
                    <div key={note.id} className="border-b pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {note.created_by ? note.created_by.substring(0, 2).toUpperCase() : '؟'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{owner?.name || "غير معروف"}</span>
                        <span className="text-xs text-muted-foreground">
                          {note.created_at ? new Date(note.created_at).toLocaleString('ar-SA') : ''}
                        </span>
                      </div>
                      <p className="text-sm">{note.description}</p>
                    </div>
                  ))
              )}
              {activities.filter(act => act.type === 'note').length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  لا توجد ملاحظات مسجلة
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 mt-4">
        <Button variant="outline" size="sm" className="gap-1" onClick={handleViewDetails}>
          عرض التفاصيل
        </Button>
        
        <Button size="sm" className="gap-1" onClick={handleViewDetails}>
          تحرير
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeadDetails;
