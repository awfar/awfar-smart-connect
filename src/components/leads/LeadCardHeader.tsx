
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, UserPlus, Filter, RefreshCw } from "lucide-react";

interface LeadCardHeaderProps {
  onToggleFilters: () => void;
  onRefresh: () => void;
  onAddLead?: () => void;
  onSearch?: (term: string) => void;
}

const LeadCardHeader: React.FC<LeadCardHeaderProps> = ({
  onToggleFilters,
  onRefresh,
  onAddLead,
  onSearch
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>العملاء المحتملين</CardTitle>
        <CardDescription className="mt-1">
          إدارة العملاء المحتملين وتصنيفهم حسب المراحل
        </CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onToggleFilters}>
          <Filter className="h-4 w-4 ml-1" />
          تصفية
        </Button>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 ml-1" />
          تحديث
        </Button>
        <Button variant="ghost" size="sm" onClick={onAddLead}>
          <UserPlus className="h-4 w-4 ml-1" />
          إضافة عميل
        </Button>
        <Button variant="ghost" size="sm">
          <DownloadCloud className="h-4 w-4 ml-1" />
          تصدير
        </Button>
      </div>
    </div>
  );
};

export default LeadCardHeader;
