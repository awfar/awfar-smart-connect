
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CompanyDataTable } from '@/components/companies/CompanyDataTable';
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import type { Company } from '@/types/company';
import AddCompanyDialog from '@/components/companies/AddCompanyDialog';
import { getCompanies } from '@/services/companiesService';
import { toast } from "sonner";

const CompaniesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('حدث خطأ في تحميل بيانات الشركات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCompanySelect = (companyId: string) => {
    navigate(`/dashboard/companies/${companyId}`);
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الشركات</h1>
          <p className="text-muted-foreground">عرض وإدارة جميع الشركات في النظام</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة شركة
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="البحث عن شركة..."
            className="pl-4 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="ml-2 h-4 w-4" />
          تصفية
        </Button>
      </div>

      <CompanyDataTable 
        companies={filteredCompanies}
        onCompanySelect={handleCompanySelect}
        isLoading={isLoading}
      />

      <AddCompanyDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={loadCompanies}
      />
    </div>
  );
};

export default CompaniesManagement;
