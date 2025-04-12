
import React from 'react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface LeadSearchBarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
  onSearch: (term: string) => void;
}

const LeadSearchBar: React.FC<LeadSearchBarProps> = ({ 
  selectedView, 
  onViewChange,
  onSearch 
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="بحث..." 
          className="pl-10 pr-10" 
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <Tabs 
        defaultValue="all" 
        className="w-auto" 
        value={selectedView} 
        onValueChange={onViewChange}
      >
        <TabsList>
          <TabsTrigger value="all">الجميع</TabsTrigger>
          <TabsTrigger value="my">العملاء المكلف بهم</TabsTrigger>
          <TabsTrigger value="new">الجدد</TabsTrigger>
          <TabsTrigger value="qualified">المؤهلين</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default LeadSearchBar;
