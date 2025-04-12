
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Filter, RefreshCw, PlusCircle 
} from "lucide-react";

interface LeadHeaderProps {
  onToggleFilters: () => void;
  onRefresh: () => void;
  onAddLead: () => void;
}

const LeadHeader: React.FC<LeadHeaderProps> = ({ 
  onToggleFilters, 
  onRefresh, 
  onAddLead 
}) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">إدارة العملاء المحتملين</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={onToggleFilters}>
          <Filter className="h-4 w-4" />
          فلترة
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          تحديث
        </Button>
        <Button size="sm" className="gap-1" onClick={onAddLead}>
          <PlusCircle className="h-4 w-4" />
          إضافة عميل محتمل
        </Button>
      </div>
    </div>
  );
};

export default LeadHeader;
