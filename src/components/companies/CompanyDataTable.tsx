
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import type { Company } from '@/types/company';

interface CompanyDataTableProps {
  companies: Company[];
  onCompanySelect: (companyId: string) => void;
}

export const CompanyDataTable: React.FC<CompanyDataTableProps> = ({
  companies,
  onCompanySelect,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم الشركة</TableHead>
            <TableHead>القطاع</TableHead>
            <TableHead>البلد</TableHead>
            <TableHead>تاريخ الإنشاء</TableHead>
            <TableHead>العملاء المحتملين</TableHead>
            <TableHead>الفرص</TableHead>
            <TableHead>الفواتير</TableHead>
            <TableHead>المسؤول</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow 
              key={company.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onCompanySelect(company.id)}
            >
              <TableCell className="font-medium">
                <Link to={`/dashboard/companies/${company.id}`} className="hover:underline">
                  {company.name}
                </Link>
                {company.type === 'customer' && (
                  <Badge variant="secondary" className="mr-2">عميل</Badge>
                )}
                {company.type === 'vendor' && (
                  <Badge variant="outline" className="mr-2">مورّد</Badge>
                )}
              </TableCell>
              <TableCell>{company.industry || '—'}</TableCell>
              <TableCell>{company.country || '—'}</TableCell>
              <TableCell>
                {company.created_at 
                  ? format(new Date(company.created_at), 'dd/MM/yyyy')
                  : '—'
                }
              </TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
