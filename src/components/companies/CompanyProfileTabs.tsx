
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Company } from '@/types/company';
import { CompanyDocuments } from './CompanyDocuments';
import { CompanyTimeline } from './CompanyTimeline';
import { CompanyLeads } from './CompanyLeads';
import { CompanyDeals } from './CompanyDeals';
import { CompanyInvoices } from './CompanyInvoices';
import { CompanyActivities } from './CompanyActivities';
import { CompanyContacts } from './CompanyContacts';

interface CompanyProfileTabsProps {
  company: Company;
}

export const CompanyProfileTabs: React.FC<CompanyProfileTabsProps> = ({
  company,
}) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
        <TabsTrigger value="contacts">جهات الاتصال</TabsTrigger>
        <TabsTrigger value="deals">الفرص</TabsTrigger>
        <TabsTrigger value="invoices">الفواتير</TabsTrigger>
        <TabsTrigger value="activities">الأنشطة</TabsTrigger>
        <TabsTrigger value="documents">المستندات</TabsTrigger>
        <TabsTrigger value="timeline">التسلسل الزمني</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">معلومات الشركة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">الموقع الإلكتروني</p>
              <p>{company.website || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">رقم الهاتف</p>
              <p>{company.phone || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">العنوان</p>
              <p>{company.address || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">القطاع</p>
              <p>{company.industry || '—'}</p>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="contacts">
        <CompanyContacts companyId={company.id} />
      </TabsContent>

      <TabsContent value="deals">
        <CompanyDeals companyId={company.id} />
      </TabsContent>

      <TabsContent value="invoices">
        <CompanyInvoices companyId={company.id} />
      </TabsContent>

      <TabsContent value="activities">
        <CompanyActivities companyId={company.id} />
      </TabsContent>

      <TabsContent value="documents">
        <CompanyDocuments companyId={company.id} />
      </TabsContent>

      <TabsContent value="timeline">
        <CompanyTimeline companyId={company.id} />
      </TabsContent>
    </Tabs>
  );
};
