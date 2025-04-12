
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  ArrowUpDown, Filter, MoreHorizontal, PlusCircle, 
  RefreshCw, Search, Tag, UserPlus, DownloadCloud
} from "lucide-react";
import { Input } from "@/components/ui/input";
import LeadDetails from "@/components/leads/LeadDetails";
import LeadFilters from "@/components/leads/LeadFilters";

const LeadManagement = () => {
  const [selectedView, setSelectedView] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const location = useLocation();

  // Mock data for leads
  const leads = [
    {
      id: "lead-001",
      name: "محمد سعيد",
      company: "شركة التقنية الحديثة",
      email: "m.saeed@tech-modern.com",
      phone: "+20 123 456 7890",
      country: "مصر",
      industry: "تكنولوجيا المعلومات",
      stage: "جديد",
      source: "نموذج موقع",
      owner: {
        name: "أحمد محمد",
        avatar: "/placeholder.svg",
        initials: "أم"
      },
      created_at: "2023-05-12"
    },
    {
      id: "lead-002",
      name: "ليلى حسن",
      company: "كافيه الأصدقاء",
      email: "laila@friends-cafe.com",
      phone: "+966 50 123 4567",
      country: "السعودية",
      industry: "مطاعم ومقاهي",
      stage: "مؤهل",
      source: "معرض",
      owner: {
        name: "سارة أحمد",
        avatar: "/placeholder.svg",
        initials: "سأ"
      },
      created_at: "2023-05-15"
    },
    {
      id: "lead-003",
      name: "خالد عبدالرحمن",
      company: "صيدليات الشفاء",
      email: "khalid@alshifa-pharm.com",
      phone: "+971 55 987 6543",
      country: "الإمارات",
      industry: "الرعاية الصحية",
      stage: "فرصة",
      source: "إحالة",
      owner: {
        name: "محمود عبد الله",
        avatar: "/placeholder.svg",
        initials: "مع"
      },
      created_at: "2023-05-18"
    },
    {
      id: "lead-004",
      name: "فاطمة علي",
      company: "متاجر الأناقة",
      email: "fatima@elegance-stores.com",
      phone: "+20 111 222 3333",
      country: "مصر",
      industry: "تجزئة",
      stage: "عرض سعر",
      source: "واتساب",
      owner: {
        name: "نورا سعيد",
        avatar: "/placeholder.svg",
        initials: "نس"
      },
      created_at: "2023-05-20"
    },
    {
      id: "lead-005",
      name: "عمر يوسف",
      company: "مطاعم الذواقة",
      email: "omar@gourmet-restaurants.com",
      phone: "+966 55 444 5555",
      country: "السعودية",
      industry: "مطاعم ومقاهي",
      stage: "تفاوض",
      source: "نموذج موقع",
      owner: {
        name: "خالد محمود",
        avatar: "/placeholder.svg",
        initials: "خم"
      },
      created_at: "2023-05-22"
    },
  ];

  const getStageBadge = (stage: string) => {
    switch(stage) {
      case "جديد":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">جديد</Badge>;
      case "مؤهل":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">مؤهل</Badge>;
      case "فرصة":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">فرصة</Badge>;
      case "عرض سعر":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">عرض سعر</Badge>;
      case "تفاوض":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">تفاوض</Badge>;
      case "مغلق ناجح":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">مغلق ناجح</Badge>;
      case "مغلق خاسر":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">مغلق خاسر</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  const handleLeadClick = (leadId: string) => {
    setSelectedLead(leadId === selectedLead ? null : leadId);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">إدارة العملاء المحتملين</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                  فلترة
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  تحديث
                </Button>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  إضافة عميل محتمل
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>العملاء المحتملين</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <DownloadCloud className="h-4 w-4 ml-1" />
                          تصدير
                        </Button>
                        <Button variant="ghost" size="sm">
                          <UserPlus className="h-4 w-4 ml-1" />
                          استيراد
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      إدارة العملاء المحتملين وتصنيفهم حسب المراحل
                    </CardDescription>

                    <div className="mt-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="بحث..." className="pl-10 pr-10" />
                        </div>
                        
                        <Tabs defaultValue="all" className="w-auto" value={selectedView} onValueChange={setSelectedView}>
                          <TabsList>
                            <TabsTrigger value="all">الجميع</TabsTrigger>
                            <TabsTrigger value="my">العملاء المكلف بهم</TabsTrigger>
                            <TabsTrigger value="new">الجدد</TabsTrigger>
                            <TabsTrigger value="qualified">المؤهلين</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {showFilters && <LeadFilters />}

                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              الاسم / الشركة
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              المرحلة
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              الدولة
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              المصدر
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              المسؤول
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              التاريخ
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow 
                            key={lead.id} 
                            className={`cursor-pointer ${selectedLead === lead.id ? "bg-gray-100" : ""}`}
                            onClick={() => handleLeadClick(lead.id)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{lead.name}</span>
                                <span className="text-sm text-muted-foreground">{lead.company}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStageBadge(lead.stage)}</TableCell>
                            <TableCell>{lead.country}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-gray-50">
                                {lead.source}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={lead.owner.avatar} />
                                  <AvatarFallback>{lead.owner.initials}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{lead.owner.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{lead.created_at}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {selectedLead && (
                <div className="w-[400px]">
                  <LeadDetails 
                    lead={leads.find(l => l.id === selectedLead)!} 
                    onClose={() => setSelectedLead(null)} 
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadManagement;
