
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Filter, RefreshCw, PlusCircle, Search
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from './LeadForm';
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import { useBreakpoints } from '@/hooks/use-mobile';
import { Input } from "@/components/ui/input";

interface LeadHeaderProps {
  onToggleFilters: () => void;
  onRefresh: () => void;
  onAddLead?: () => void;
  onSearch?: (term: string) => void;
}

const LeadHeader: React.FC<LeadHeaderProps> = ({ 
  onToggleFilters, 
  onRefresh, 
  onAddLead,
  onSearch
}) => {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isMobile, isSmallMobile } = useBreakpoints();

  const handleAddLeadClick = () => {
    if (onAddLead) {
      onAddLead();
    } else {
      setIsAddLeadOpen(true);
    }
  };

  const handleLeadSuccess = () => {
    setIsAddLeadOpen(false);
    // تحديث بيانات العملاء بعد الإضافة
    onRefresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <>
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
        <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isMobile ? 'text-center mb-2' : ''}`}>
          إدارة العملاء المحتملين
        </h1>
        
        <div className={`flex items-center ${isMobile ? 'justify-center w-full gap-2' : 'gap-2'}`}>
          <Button 
            variant="outline" 
            size={isSmallMobile ? "icon" : isMobile ? "sm" : "default"} 
            className={isSmallMobile ? "w-10 h-10" : isMobile ? "text-sm px-3" : "gap-1"} 
            onClick={onToggleFilters}
          >
            <Filter className={isSmallMobile ? "h-4 w-4" : "h-4 w-4 ml-1"} />
            {!isSmallMobile && <span>فلترة</span>}
          </Button>
          
          <Button 
            variant="outline" 
            size={isSmallMobile ? "icon" : isMobile ? "sm" : "default"} 
            className={isSmallMobile ? "w-10 h-10" : isMobile ? "text-sm px-3" : "gap-1"}
            onClick={onRefresh}
          >
            <RefreshCw className={isSmallMobile ? "h-4 w-4" : "h-4 w-4 ml-1"} />
            {!isSmallMobile && <span>تحديث</span>}
          </Button>
          
          <Button 
            size={isSmallMobile ? "icon" : isMobile ? "sm" : "default"}
            className={isSmallMobile ? "w-10 h-10" : isMobile ? "text-sm px-3" : "gap-1"}
            onClick={handleAddLeadClick}
          >
            <PlusCircle className={isSmallMobile ? "h-4 w-4" : "h-4 w-4 ml-1"} />
            {!isSmallMobile && <span>إضافة عميل محتمل</span>}
          </Button>
        </div>
      </div>

      {isMobile && (
        <form onSubmit={handleSearchSubmit} className="relative mt-2 mb-4">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="بحث عن عميل محتمل..."
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}

      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none p-3 h-[90vh] overflow-y-auto' : 'sm:max-w-lg'}`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">إضافة عميل محتمل جديد</DialogTitle>
          </DialogHeader>
          <div className={`${isMobile ? 'overflow-y-auto flex-1' : 'mt-4'}`}>
            <MobileOptimizedContainer noPadding={isMobile}>
              <LeadForm 
                onClose={() => setIsAddLeadOpen(false)}
                onSuccess={handleLeadSuccess}
              />
            </MobileOptimizedContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadHeader;
