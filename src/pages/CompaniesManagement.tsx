
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CompanyDataTable } from '@/components/companies/CompanyDataTable';
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import type { Company } from '@/types/company';

const CompaniesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with real data fetch
  const companies: Company[] = [
    {
      id: '1',
      name: 'شركة التقنية المتقدمة',
      type: 'customer',
      industry: 'تقنية المعلومات',
      country: 'السعودية',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'مجموعة الخليج للتجارة',
      type: 'vendor',
      industry: 'التجارة',
      country: 'الإمارات',
      created_at: new Date().toISOString(),
    }
  ];

  const handleCompanySelect = (companyId: string) => {
    navigate(`/dashboard/companies/${companyId}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الشركات</h1>
          <p className="text-muted-foreground">عرض وإدارة جميع الشركات في النظام</p>
        </div>
        
        <Button onClick={() => {}}>
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
        companies={companies}
        onCompanySelect={handleCompanySelect}
      />
    </div>
  );
};

export default CompaniesManagement;
