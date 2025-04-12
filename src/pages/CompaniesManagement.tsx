
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, Search, Filter, Building2, Trash2, Edit, Users2, Globe, Phone, MapPin } from "lucide-react";
import CompanyFilters from "@/components/companies/CompanyFilters";
import CompanyForm from "@/components/companies/CompanyForm";
import { Company, getCompanies, filterCompanies, createCompany, deleteCompany } from '@/services/companiesService';
import { toast } from "sonner";

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب بيانات الشركات");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterCompaniesByTab(value);
  };

  const filterCompaniesByTab = async (tab: string) => {
    setLoading(true);
    try {
      if (tab === "all") {
        await fetchCompanies();
      } else {
        const data = await filterCompanies({ type: tab });
        setCompanies(data);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تصفية الشركات");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (filters: { industry?: string; country?: string; type?: string }) => {
    setLoading(true);
    try {
      const data = await filterCompanies(filters);
      setCompanies(data);
      setShowFilters(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء تطبيق الفلترة");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = async (companyData: Omit<Company, "id" | "createdAt" | "status" | "contacts">) => {
    try {
      const newCompany = await createCompany({
        ...companyData,
        status: "نشط",
        contacts: []
      });
      setCompanies([...companies, newCompany]);
      setShowAddForm(false);
      toast.success("تم إضافة الشركة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الشركة");
    }
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompany) return;
    
    try {
      await deleteCompany(selectedCompany.id);
      setCompanies(companies.filter(company => company.id !== selectedCompany.id));
      setSelectedCompany(null);
      setShowDeleteDialog(false);
      toast.success("تم حذف الشركة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الشركة");
    }
  };

  const confirmDelete = (company: Company) => {
    setSelectedCompany(company);
    setShowDeleteDialog(true);
  };

  return (
    <div className="p-6 rtl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">إدارة الشركات</h1>
          <p className="text-gray-600">قم بإدارة الشركات والعملاء والموردين</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>إضافة شركة</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="all">جميع الشركات</TabsTrigger>
            <TabsTrigger value="customer">العملاء</TabsTrigger>
            <TabsTrigger value="vendor">الموردين</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="بحث عن شركة..."
                className="w-full md:w-80 pr-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span>فلترة</span>
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <CompanyFilters onApplyFilters={handleApplyFilters} />
            </CardContent>
          </Card>
        )}
        
        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium">لا توجد شركات</h3>
              <p className="text-gray-600 mt-1">لم يتم العثور على أي شركات مطابقة للفلتر الحالي</p>
              <Button onClick={() => setShowAddForm(true)} variant="outline" className="mt-4">
                إضافة شركة جديدة
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            company.type === "customer" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {company.type === "customer" ? "عميل" : "مورد"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {company.industry === "tech" && "تقنية المعلومات"}
                          {company.industry === "healthcare" && "الرعاية الصحية"}
                          {company.industry === "retail" && "التجزئة"}
                          {company.industry === "education" && "التعليم"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => confirmDelete(company)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Globe className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <div className="text-sm font-medium">الموقع الإلكتروني</div>
                          <div className="text-sm text-gray-600">{company.website || "غير متوفر"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <div className="text-sm font-medium">البلد</div>
                          <div className="text-sm text-gray-600">
                            {company.country === "sa" && "السعودية"}
                            {company.country === "ae" && "الإمارات"}
                            {company.country === "kw" && "الكويت"}
                            {company.country === "bh" && "البحرين"}
                            {company.country === "qa" && "قطر"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <div className="text-sm font-medium">رقم الهاتف</div>
                          <div className="text-sm text-gray-600">{company.phone || "غير متوفر"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Users2 className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <div className="text-sm font-medium">جهات الاتصال</div>
                          <div className="text-sm text-gray-600">
                            {company.contacts && company.contacts.length > 0 
                              ? company.contacts.map((contact, index) => (
                                <div key={index} className="mt-1">
                                  <div>{contact.name} - {contact.position}</div>
                                  <div className="text-xs text-gray-500">{contact.email}</div>
                                </div>
                              ))
                              : "لا توجد جهات اتصال"
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="customer" className="mt-0">
          {/* Same content structure as "all" tab but filtered for customers */}
        </TabsContent>
        
        <TabsContent value="vendor" className="mt-0">
          {/* Same content structure as "all" tab but filtered for vendors */}
        </TabsContent>
      </Tabs>
      
      {/* Add Company Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl rtl">
          <DialogTitle>إضافة شركة جديدة</DialogTitle>
          <CompanyForm 
            onCancel={() => setShowAddForm(false)} 
            onSave={handleAddCompany}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rtl">
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <div className="py-4">
            <p>هل أنت متأكد من رغبتك في حذف شركة "{selectedCompany?.name}"؟</p>
            <p className="text-gray-500 text-sm mt-2">هذا الإجراء لا يمكن التراجع عنه.</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteCompany}>
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesManagement;
