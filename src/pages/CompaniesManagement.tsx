
import React, { useState } from 'react';
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
  RefreshCw, Search, Building, Globe, Phone, Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import CompanyDetails from "@/components/companies/CompanyDetails";
import CompanyFilters from "@/components/companies/CompanyFilters";

const CompaniesManagement = () => {
  const [selectedView, setSelectedView] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // Mock data for companies
  const companies = [
    {
      id: "comp-001",
      name: "شركة التقنية الحديثة",
      industry: "تكنولوجيا المعلومات",
      size: "متوسطة (50-200 موظف)",
      country: "مصر",
      city: "القاهرة",
      website: "tech-modern.com",
      status: "عميل",
      subscription: "متقدمة",
      contacts: 4,
      account_manager: {
        name: "أحمد محمد",
        avatar: "/placeholder.svg",
        initials: "أم"
      },
      created_at: "2023-01-15"
    },
    {
      id: "comp-002",
      name: "كافيه الأصدقاء",
      industry: "مطاعم ومقاهي",
      size: "صغيرة (>50 موظف)",
      country: "السعودية",
      city: "الرياض",
      website: "friends-cafe.com",
      status: "فرصة",
      subscription: "أساسية",
      contacts: 2,
      account_manager: {
        name: "سارة أحمد",
        avatar: "/placeholder.svg",
        initials: "سأ"
      },
      created_at: "2023-02-03"
    },
    {
      id: "comp-003",
      name: "صيدليات الشفاء",
      industry: "الرعاية الصحية",
      size: "كبيرة (>200 موظف)",
      country: "الإمارات",
      city: "دبي",
      website: "alshifa-pharm.com",
      status: "عميل",
      subscription: "احترافية",
      contacts: 5,
      account_manager: {
        name: "محمود عبد الله",
        avatar: "/placeholder.svg",
        initials: "مع"
      },
      created_at: "2023-03-20"
    },
    {
      id: "comp-004",
      name: "متاجر الأناقة",
      industry: "تجزئة",
      size: "متوسطة (50-200 موظف)",
      country: "مصر",
      city: "الإسكندرية",
      website: "elegance-stores.com",
      status: "محتمل",
      subscription: "تجريبية",
      contacts: 3,
      account_manager: {
        name: "نورا سعيد",
        avatar: "/placeholder.svg",
        initials: "نس"
      },
      created_at: "2023-04-12"
    },
    {
      id: "comp-005",
      name: "مطاعم الذواقة",
      industry: "مطاعم ومقاهي",
      size: "كبيرة (>200 موظف)",
      country: "السعودية",
      city: "جدة",
      website: "gourmet-restaurants.com",
      status: "عميل",
      subscription: "متقدمة",
      contacts: 6,
      account_manager: {
        name: "خالد محمود",
        avatar: "/placeholder.svg",
        initials: "خم"
      },
      created_at: "2023-05-07"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "عميل":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">عميل</Badge>;
      case "محتمل":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">محتمل</Badge>;
      case "فرصة":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">فرصة</Badge>;
      case "سابق":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">سابق</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch(subscription) {
      case "أساسية":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">أساسية</Badge>;
      case "متقدمة":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">متقدمة</Badge>;
      case "احترافية":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">احترافية</Badge>;
      case "تجريبية":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">تجريبية</Badge>;
      default:
        return <Badge variant="outline">{subscription}</Badge>;
    }
  };

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompany(companyId === selectedCompany ? null : companyId);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">إدارة الشركات</h1>
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
                  إضافة شركة جديدة
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>الشركات</CardTitle>
                    </div>
                    <CardDescription>
                      إدارة العملاء والشركات وفرص التعاون
                    </CardDescription>

                    <div className="mt-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="بحث عن شركة..." className="pl-10 pr-10" />
                        </div>
                        
                        <Tabs defaultValue="all" className="w-auto" value={selectedView} onValueChange={setSelectedView}>
                          <TabsList>
                            <TabsTrigger value="all">الجميع</TabsTrigger>
                            <TabsTrigger value="customers">العملاء</TabsTrigger>
                            <TabsTrigger value="prospects">المحتملين</TabsTrigger>
                            <TabsTrigger value="leads">الفرص</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {showFilters && <CompanyFilters />}

                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              اسم الشركة
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              الحالة
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              الباقة
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              الدولة
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              القطاع
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" className="flex items-center gap-1 p-0">
                              مدير الحساب
                            </Button>
                          </TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {companies.map((company) => (
                          <TableRow 
                            key={company.id} 
                            className={`cursor-pointer ${selectedCompany === company.id ? "bg-gray-100" : ""}`}
                            onClick={() => handleCompanyClick(company.id)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{company.name}</span>
                                <span className="text-xs text-muted-foreground">{company.website}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(company.status)}</TableCell>
                            <TableCell>{getSubscriptionBadge(company.subscription)}</TableCell>
                            <TableCell>{company.country}</TableCell>
                            <TableCell>{company.industry}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={company.account_manager.avatar} />
                                  <AvatarFallback>{company.account_manager.initials}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{company.account_manager.name}</span>
                              </div>
                            </TableCell>
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

              {selectedCompany && (
                <div className="w-[400px]">
                  <CompanyDetails 
                    company={companies.find(c => c.id === selectedCompany)!} 
                    onClose={() => setSelectedCompany(null)} 
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

export default CompaniesManagement;
