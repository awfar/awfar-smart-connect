
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  X, Mail, Phone, Globe, MapPin, Building, Users, 
  Calendar, MessageCircle, FileText, PieChart, PlusCircle, Edit
} from "lucide-react";
import type { Company } from "@/services/companiesService";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Define a more complete Company type that includes all needed properties
interface EnhancedCompany extends Company {
  account_manager: {
    name: string;
    avatar: string;
    initials: string;
  };
  subscription?: string;
  city?: string;
  size?: string;
}

interface CompanyDetailsProps {
  company: EnhancedCompany;
  onClose: () => void;
  onEdit: (company: EnhancedCompany) => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, onClose, onEdit }) => {
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  
  // Mock contacts for this company
  const contacts = [
    {
      id: 1,
      name: "أحمد علي",
      position: "المدير التنفيذي",
      email: "ahmed@company.com",
      phone: "+20 123 456 7890",
      is_decision_maker: true,
    },
    {
      id: 2,
      name: "مريم خالد",
      position: "مدير تكنولوجيا المعلومات",
      email: "mariam@company.com",
      phone: "+20 123 456 7891",
      is_decision_maker: false,
    },
    {
      id: 3,
      name: "عمر يوسف",
      position: "مدير التسويق",
      email: "omar@company.com",
      phone: "+20 123 456 7892",
      is_decision_maker: false,
    },
  ];

  // Mock deals for this company
  const deals = [
    {
      id: 1,
      name: "باقة متقدمة سنوية",
      value: "120,000 ريال",
      stage: "تفاوض",
      expected_close: "15/06/2023",
    },
    {
      id: 2,
      name: "دعم إضافي",
      value: "30,000 ريال",
      stage: "عرض سعر",
      expected_close: "30/06/2023",
    },
  ];

  // Mock activities for this company
  const activities = [
    {
      id: 1,
      type: "meeting",
      content: "اجتماع متابعة مع فريق تكنولوجيا المعلومات",
      date: "غدًا - 10:00 صباحًا",
      user: company.account_manager,
    },
    {
      id: 2,
      type: "email",
      content: "تم إرسال عرض السعر المعدل بناءً على المتطلبات الجديدة",
      date: "منذ 3 أيام",
      user: company.account_manager,
    },
  ];

  const handleAddContact = () => {
    toast.info("ستتمكن قريبا من إضافة جهات اتصال للشركات");
  };

  const handleAddDeal = () => {
    toast.info("ستتمكن قريبا من إضافة صفقات للشركات");
  };

  const handleAddActivity = () => {
    toast.info("ستتمكن قريبا من إضافة أنشطة للشركات");
  };

  const handleEditCompany = () => {
    onEdit(company);
  };

  const handleContactAction = (contactId: number, action: 'email' | 'call') => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      if (action === 'email') {
        toast.info(`سيتم فتح نافذة إرسال بريد إلكتروني إلى ${contact.name}`);
      } else {
        toast.info(`سيتم الاتصال بـ ${contact.name}`);
      }
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold">تفاصيل الشركة</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={handleEditCompany}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center text-center gap-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary/10 text-lg">{company.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{company.name}</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-3 w-3" />
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-primary">{company.website}</a>
              </div>
            </div>
            <div className="flex gap-2">
              {company.status && (
                <Badge className={`
                  ${company.status === "عميل" ? "bg-green-50 text-green-700 border-green-200" : ""}
                  ${company.status === "محتمل" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                  ${company.status === "فرصة" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                  ${company.status === "سابق" ? "bg-gray-50 text-gray-700 border-gray-200" : ""}
                `}>
                  {company.status}
                </Badge>
              )}
              {company.subscription && (
                <Badge className={`
                  ${company.subscription === "أساسية" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                  ${company.subscription === "متقدمة" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                  ${company.subscription === "احترافية" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : ""}
                  ${company.subscription === "تجريبية" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                `}>
                  باقة {company.subscription}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{company.industry}</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{company.size}</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{company.city}، {company.country}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="text-sm text-muted-foreground">مدير الحساب</div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={company.account_manager.avatar} />
                <AvatarFallback>{company.account_manager.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{company.account_manager.name}</span>
            </div>
          </div>

          <Tabs defaultValue="contacts">
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="contacts">جهات الاتصال</TabsTrigger>
              <TabsTrigger value="deals">الصفقات</TabsTrigger>
              <TabsTrigger value="activities">الأنشطة</TabsTrigger>
              <TabsTrigger value="documents">المستندات</TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="space-y-4">
              {contacts.map(contact => (
                <div key={contact.id} className="border-b pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{contact.name}</span>
                        {contact.is_decision_maker && (
                          <Badge variant="secondary" className="text-xs">صانع قرار</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{contact.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleContactAction(contact.id, 'email')}
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleContactAction(contact.id, 'call')}
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{contact.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full" onClick={handleAddContact}>
                <PlusCircle className="h-4 w-4 ml-2" />
                إضافة جهة اتصال
              </Button>
            </TabsContent>

            <TabsContent value="deals" className="space-y-4">
              {deals.map(deal => (
                <div key={deal.id} className="border-b pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{deal.name}</span>
                    <Badge variant="outline" className={
                      deal.stage === "تفاوض" ? "bg-orange-50 text-orange-700 border-orange-200" :
                      deal.stage === "عرض سعر" ? "bg-amber-50 text-amber-700 border-amber-200" : ""
                    }>
                      {deal.stage}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">القيمة: {deal.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">تاريخ الإغلاق المتوقع: {deal.expected_close}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full" onClick={handleAddDeal}>
                <PlusCircle className="h-4 w-4 ml-2" />
                إضافة صفقة جديدة
              </Button>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="border-b pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback>{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{activity.user.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.type === "meeting" && "اجتماع"}
                      {activity.type === "email" && "بريد"}
                    </Badge>
                  </div>
                  <p className="text-sm mb-1">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full" onClick={handleAddActivity}>
                <PlusCircle className="h-4 w-4 ml-2" />
                إضافة نشاط جديد
              </Button>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">لا توجد مستندات حاليًا</p>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 ml-2" />
                  إضافة مستند
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 mt-4">
        <Button variant="outline" size="sm" className="gap-1">
          <MessageCircle className="h-4 w-4" />
          محادثة
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Mail className="h-4 w-4" />
          بريد
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Calendar className="h-4 w-4" />
          موعد
        </Button>
        <Button size="sm" className="gap-1" onClick={handleEditCompany}>
          <Edit className="h-4 w-4 ml-1" />
          تحديث
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyDetails;
