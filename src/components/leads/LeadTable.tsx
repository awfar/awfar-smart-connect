
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

interface LeadOwner {
  name: string;
  avatar: string;
  initials: string;
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  stage: string;
  source: string;
  owner: LeadOwner;
  created_at: string;
}

interface LeadTableProps {
  leads: Lead[];
  selectedLead: string | null;
  onLeadSelect: (leadId: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, selectedLead, onLeadSelect }) => {
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

  return (
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
            onClick={() => onLeadSelect(lead.id)}
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
  );
};

export default LeadTable;
