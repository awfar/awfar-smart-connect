
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import CompanyForm from "@/components/companies/CompanyForm";
import CompanyDetails from "@/components/companies/CompanyDetails";
import CompanyFilters from "@/components/companies/CompanyFilters";

// Define the Company interface to match what's expected
interface Company {
  id: string;
  name: string;
  industry: string;
  country: string;
  website: string;
  phone: string;
  address: string;
  type: string;
  status: string;
  contacts: { name: string; position: string; email: string; }[];
  created_at: string;
  // Add the missing properties
  size: string;
  city: string;
  subscription: string;
}

const CompaniesManagement = () => {
  const [view, setView] = useState<"all" | "customers" | "vendors">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Mock data for companies with required fields
  const companies: Company[] = [
    {
      id: "comp-001",
      name: "شركة التقنية الحديثة",
      industry: "تكنولوجيا المعلومات",
      country: "مصر",
      website: "www.tech-modern.com",
      phone: "+20 123 456 7890",
      address: "القاهرة، مصر",
      type: "عميل",
      status: "نشط",
      size: "متوسطة",
      city: "القاهرة",
      subscription: "أساسية",
      contacts: [
        { name: "محمد سعيد", position: "مدير تقني", email: "m.saeed@tech-modern.com" }
      ],
      created_at: "2023-05-12"
    },
    {
      id: "comp-002",
      name: "مطاعم الذواقة",
      industry: "مطاعم ومقاهي",
      country: "السعودية",
      website: "www.gourmet-restaurants.com",
      phone: "+966 55 444 5555",
      address: "الرياض، السعودية",
      type: "مورد",
      status: "نشط",
      size: "كبيرة",
      city: "الرياض",
      subscription: "متقدمة",
      contacts: [
        { name: "عمر يوسف", position: "مدير عام", email: "omar@gourmet-restaurants.com" }
      ],
      created_at: "2023-05-22"
    },
    {
      id: "comp-003",
      name: "صيدليات الشفاء",
      industry: "الرعاية الصحية",
      country: "الإمارات",
      website: "www.alshifa-pharm.com",
      phone: "+971 55 987 6543",
      address: "دبي، الإمارات",
      type: "عميل",
      status: "نشط",
      size: "كبيرة",
      city: "دبي",
      subscription: "مجانية",
      contacts: [
        { name: "خالد عبدالرحمن", position: "مدير تنفيذي", email: "khalid@alshifa-pharm.com" }
      ],
      created_at: "2023-05-18"
    }
  ];

  const handleCreateCompany = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveCompany = () => {
    toast.success("تم حفظ بيانات الشركة بنجاح");
    setIsCreating(false);
  };

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompany(companyId === selectedCompany ? null : companyId);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApplyFilters = (filters: any) => {
    console.log("Applied filters:", filters);
    toast.success("تم تطبيق الفلتر بنجاح");
  };

  // Filter companies based on search term and view
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesView = 
      view === "all" || 
      (view === "customers" && company.type === "عميل") || 
      (view === "vendors" && company.type === "مورد");
    
    return matchesSearch && matchesView;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة الشركات</h1>
              
              {!isCreating && (
                <Button 
                  onClick={handleCreateCompany}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة شركة جديدة
                </Button>
              )}
            </div>

            {isCreating ? (
              <Card>
                <CardHeader>
                  <CardTitle>شركة جديدة</CardTitle>
                  <CardDescription>أدخل بيانات الشركة الجديدة</CardDescription>
                </CardHeader>
                <CardContent>
                  <CompanyForm 
                    onCancel={handleCancelCreate}
                    onSave={handleSaveCompany}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <div>
                        <CardTitle>الشركات</CardTitle>
                        <CardDescription className="mt-1">
                          إدارة الشركات والعملاء والموردين
                        </CardDescription>
                      </div>
                      
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="بحث في الشركات..."
                              className="pl-8"
                              value={searchTerm}
                              onChange={handleSearch}
                            />
                          </div>
                          
                          <Tabs defaultValue="all" value={view} onValueChange={(v) => setView(v as "all" | "customers" | "vendors")}>
                            <TabsList>
                              <TabsTrigger value="all">الكل</TabsTrigger>
                              <TabsTrigger value="customers">العملاء</TabsTrigger>
                              <TabsTrigger value="vendors">الموردين</TabsTrigger>
                            </TabsList>
                          </Tabs>
                          
                          <Button 
                            variant="outline" 
                            onClick={toggleFilters}
                            className="w-full md:w-auto"
                          >
                            <Filter className="h-4 w-4 ml-2" />
                            فلترة
                          </Button>
                        </div>
                        
                        {showFilters && <CompanyFilters onApplyFilters={handleApplyFilters} />}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="rounded-md border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="h-10 px-4 text-right font-medium">الشركة</th>
                              <th className="h-10 px-4 text-right font-medium">القطاع</th>
                              <th className="h-10 px-4 text-right font-medium">الدولة</th>
                              <th className="h-10 px-4 text-right font-medium">النوع</th>
                              <th className="h-10 px-4 text-right font-medium">الحالة</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCompanies.map((company) => (
                              <tr 
                                key={company.id} 
                                className={`border-b hover:bg-muted/50 cursor-pointer ${company.id === selectedCompany ? 'bg-muted/50' : ''}`}
                                onClick={() => handleCompanyClick(company.id)}
                              >
                                <td className="p-4">{company.name}</td>
                                <td className="p-4">{company.industry}</td>
                                <td className="p-4">{company.country}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs ${company.type === 'عميل' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                    {company.type}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                                    {company.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            
                            {filteredCompanies.length === 0 && (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                  لا توجد شركات متطابقة مع معايير البحث
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompaniesManagement;
