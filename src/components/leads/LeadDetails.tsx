
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Mail, Phone, MapPin, Building, Calendar, MessageCircle } from "lucide-react";

interface LeadOwner {
  name: string;
  avatar: string;
  initials: string;
}

interface Lead {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  industry?: string;
  stage?: string;
  source?: string;
  owner?: LeadOwner;
  created_at: string;
}

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, onClose }) => {
  // التحقق من وجود البيانات قبل استخدامها
  const fullName = lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
  
  // Mock activities for this lead
  const activities = [
    {
      id: 1,
      type: "note",
      content: "تم التواصل هاتفيًا وطلب معلومات إضافية عن الباقة المتقدمة",
      date: "منذ 3 ساعات",
      user: lead.owner || { name: "مستخدم النظام", avatar: "/placeholder.svg", initials: "م" },
    },
    {
      id: 2,
      type: "email",
      content: "تم إرسال بريد إلكتروني بتفاصيل الباقات والأسعار",
      date: "منذ يومين",
      user: lead.owner || { name: "مستخدم النظام", avatar: "/placeholder.svg", initials: "م" },
    },
    {
      id: 3,
      type: "call",
      content: "مكالمة تعارف أولية - مهتم بحلول إدارة المحادثات عبر واتساب",
      date: "منذ 4 أيام",
      user: lead.owner || { name: "مستخدم النظام", avatar: "/placeholder.svg", initials: "م" },
    },
  ];

  // Mock tasks for this lead
  const tasks = [
    {
      id: 1,
      title: "إرسال عرض سعر",
      due: "غدًا",
      status: "pending",
      assigned_to: lead.owner?.name || "غير محدد",
    },
    {
      id: 2,
      title: "متابعة هاتفية",
      due: "بعد 3 أيام",
      status: "pending",
      assigned_to: lead.owner?.name || "غير محدد",
    }
  ];

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
              <AvatarFallback className="text-lg">{fullName.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{fullName}</h3>
              <p className="text-sm text-muted-foreground">{lead.company || "بدون شركة"}</p>
            </div>
            <Badge className={`
              ${lead.stage === "جديد" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
              ${lead.stage === "مؤهل" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
              ${lead.stage === "فرصة" ? "bg-green-50 text-green-700 border-green-200" : ""}
              ${lead.stage === "عرض سعر" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
              ${lead.stage === "تفاوض" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
              ${!lead.stage ? "bg-gray-50 text-gray-700 border-gray-200" : ""}
            `}>
              {lead.stage || "غير محدد"}
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
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{lead.country || "غير محدد"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{lead.industry || "غير محدد"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="text-sm text-muted-foreground">المالك</div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={lead.owner?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{lead.owner?.initials || "؟"}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{lead.owner?.name || "غير مخصص"}</span>
            </div>
          </div>

          <Tabs defaultValue="activities">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="activities">الأنشطة</TabsTrigger>
              <TabsTrigger value="tasks">المهام</TabsTrigger>
              <TabsTrigger value="notes">الملاحظات</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="border-b pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{activity.user?.initials || "؟"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{activity.user?.name || "غير معروف"}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.type === "note" && "ملاحظة"}
                      {activity.type === "email" && "بريد"}
                      {activity.type === "call" && "مكالمة"}
                    </Badge>
                  </div>
                  <p className="text-sm mb-1">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{task.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">المكلف: {task.assigned_to}</p>
                  </div>
                  <Badge variant={task.status === "done" ? "secondary" : "outline"}>
                    {task.due}
                  </Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <textarea 
                className="w-full min-h-[100px] p-3 border rounded-md" 
                placeholder="أضف ملاحظة جديدة..."
              ></textarea>
              <Button size="sm" className="mt-2">
                حفظ الملاحظة
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 mt-4">
        <Button variant="outline" size="sm" className="gap-1">
          <Phone className="h-4 w-4" />
          اتصال
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Mail className="h-4 w-4" />
          بريد
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <MessageCircle className="h-4 w-4" />
          واتساب
        </Button>
        <Button size="sm" className="gap-1">
          تحويل إلى صفقة
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeadDetails;
