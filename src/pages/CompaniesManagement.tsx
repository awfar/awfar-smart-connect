
import React, { useState, useEffect } from 'react';
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
import CompanyForm from "@/components/companies/CompanyForm";
import { Company, CompanyFilters as CompanyFiltersType, fetchCompanies } from "@/services/companiesService";
import { toast } from "sonner";
import { useBreakpoints } from "@/hooks/use-mobile";

const CompaniesManagement = () => {
  const [selectedView, setSelectedView] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<CompanyFiltersType>({});
  const { isMobile } = useBreakpoints();

  useEffect(() => {
    loadCompanies();
  }, [selectedView, filters]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      // Apply view-based filter
      let viewFilter: CompanyFiltersType = { ...filters };
      if (selectedView !== "all") {
        switch (selectedView) {
          case "customers":
            viewFilter.status = "عميل";
            break;
          case "prospects":
            viewFilter.status = "محتمل";
            break;
          case "leads":
            viewFilter.status = "فرصة";
            break;
          default:
            break;
        }
      }
      
      const data = await fetchCompanies(viewFilter);
      setCompanies(data);
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("فشل تحميل بيانات الشركات");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompany(companyId === selectedCompany ? null : companyId);
  };

  const handleAddCompany = () => {
    setEditingCompany(undefined);
    setShowCompanyForm(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setShowCompanyForm(true);
    setSelectedCompany(null);
  };

  const handleFormSubmit = async (companyData: Partial<Company>) => {
    try {
      // In a real implementation, you would call an API to save the company
      // For now, we'll simulate a successful save and update the local state
      const newCompany: Company = {
        ...(editingCompany || {}),
        ...companyData,
        id: editingCompany?.id || `comp-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        created_at: editingCompany?.created_at || new Date().toISOString(),
        contacts: editingCompany?.contacts || 0,
        account_manager: editingCompany?.account_manager || {
          name: "مستخدم النظام",
          avatar: "/placeholder.svg",
          initials: "مس"
        }
      } as Company;

      if (editingCompany) {
        // Update existing company
        setCompanies(prev => prev.map(c => c.id === editingCompany.id ? newCompany : c));
        toast.success("تم تحديث الشركة بنجاح");
      } else {
        // Add new company
        setCompanies(prev => [newCompany, ...prev]);
        toast.success("تم إضافة الشركة بنجاح");
      }
      
      setShowCompanyForm(false);
      setEditingCompany(undefined);
      await loadCompanies(); // Reload companies from server
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error("فشل حفظ بيانات الشركة");
    }
  };

  const filteredCompanies = companies.filter(company => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(query) || 
      company.website.toLowerCase().includes(query) ||
      company.industry.toLowerCase().includes(query) ||
      company.country.toLowerCase().includes(query)
    );
  });

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

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">إدارة الشركات</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                  فلترة
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={loadCompanies}>
                  <RefreshCw className="h-4 w-4" />
                  تحديث
                </Button>
                <Button size="sm" className="gap-1" onClick={handleAddCompany}>
                  <PlusCircle className="h-4 w-4" />
                  إضافة شركة جديدة
                </Button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                {showCompanyForm ? (
                  <CompanyForm 
                    onClose={() => setShowCompanyForm(false)} 
                    onSubmit={handleFormSubmit}
                    initialData={editingCompany}
                    title={editingCompany ? "تحديث بيانات الشركة" : "إضافة شركة جديدة"}
                  />
                ) : (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>الشركات</CardTitle>
                      </div>
                      <CardDescription>
                        إدارة العملاء والشركات وفرص التعاون
                      </CardDescription>

                      <div className="mt-4">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                          <div className="relative flex-1 w-full">
                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                              placeholder="بحث عن شركة..." 
                              className="pl-10 pr-10" 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
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
                    
                    {showFilters && <CompanyFilters onApplyFilters={setFilters} />}

                    <CardContent>
                      {loading ? (
                        <div className="flex justify-center py-8 text-muted-foreground">جاري تحميل البيانات...</div>
                      ) : filteredCompanies.length === 0 ? (
                        <div className="flex justify-center py-8 text-muted-foreground">لا توجد شركات متطابقة مع البحث</div>
                      ) : isMobile ? (
                        <div className="space-y-4">
                          {filteredCompanies.map((company) => (
                            <Card 
                              key={company.id}
                              className={`cursor-pointer ${selectedCompany === company.id ? "bg-gray-100" : ""}`}
                              onClick={() => handleCompanyClick(company.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{company.name}</h3>
                                    <p className="text-xs text-muted-foreground">{company.website}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {getStatusBadge(company.status)}
                                      {getSubscriptionBadge(company.subscription)}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCompany(company);
                                  }}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={company.account_manager.avatar} />
                                    <AvatarFallback>{company.account_manager.initials}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{company.account_manager.name}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
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
                            {filteredCompanies.map((company) => (
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
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditCompany(company);
                                    }}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {selectedCompany && !showCompanyForm && (
                <div className="w-full lg:w-[400px]">
                  <CompanyDetails 
                    company={companies.find(c => c.id === selectedCompany)!} 
                    onClose={() => setSelectedCompany(null)} 
                    onEdit={(company) => handleEditCompany(company)}
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
