
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBreakpoints } from '@/hooks/use-mobile';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { isMobile } = useBreakpoints();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  return (
    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row items-center justify-between gap-4'}`}>
      <div className="relative flex-1">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="بحث عن عميل محتمل..."
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </div>
      
      <div className={`${isMobile ? 'flex justify-center' : ''}`}>
        <ToggleGroup type="single" value={selectedView} onValueChange={(value) => value && onViewChange(value)}>
          <ToggleGroupItem value="all" aria-label="عرض الكل" className="text-xs sm:text-sm">
            الكل
          </ToggleGroupItem>
          <ToggleGroupItem value="my" aria-label="عرض العملاء الخاصة بي" className="text-xs sm:text-sm">
            الخاصة بي
          </ToggleGroupItem>
          <ToggleGroupItem value="new" aria-label="عرض العملاء الجدد" className="text-xs sm:text-sm">
            جديد
          </ToggleGroupItem>
          <ToggleGroupItem value="qualified" aria-label="عرض العملاء المؤهلين" className="text-xs sm:text-sm">
            مؤهل
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default LeadSearchBar;
