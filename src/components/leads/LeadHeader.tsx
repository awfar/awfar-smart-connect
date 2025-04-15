
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Filter, RefreshCw, PlusCircle, Search
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from './LeadForm';
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import { useBreakpoints } from '@/hooks/use-mobile';

interface LeadHeaderProps {
  onToggleFilters: () => void;
  onRefresh: () => void;
  onAddLead?: () => void;
}

const LeadHeader: React.FC<LeadHeaderProps> = ({ 
  onToggleFilters, 
  onRefresh, 
  onAddLead 
}) => {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const { isMobile } = useBreakpoints();

  const handleAddLeadClick = () => {
    if (onAddLead) {
      onAddLead();
    } else {
      setIsAddLeadOpen(true);
    }
  };

  const handleLeadSuccess = () => {
    setIsAddLeadOpen(false);
    // Refresh lead data after addition
    onRefresh();
  };

  return (
    <>
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
        <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isMobile ? 'text-center mb-2' : ''}`}>
          إدارة العملاء المحتملين
        </h1>
        
        <div className={`flex items-center ${isMobile ? 'justify-center w-full gap-1' : 'gap-2'}`}>
          <Button 
            variant="outline" 
            size={isMobile ? "icon" : "sm"} 
            className={isMobile ? "w-10 h-10" : "gap-1"} 
            onClick={onToggleFilters}
          >
            <Filter className="h-4 w-4" />
            {!isMobile && <span>فلترة</span>}
          </Button>
          
          <Button 
            variant="outline" 
            size={isMobile ? "icon" : "sm"} 
            className={isMobile ? "w-10 h-10" : "gap-1"} 
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            {!isMobile && <span>تحديث</span>}
          </Button>
          
          <Button 
            size={isMobile ? "icon" : "sm"} 
            className={isMobile ? "w-10 h-10" : "gap-1"} 
            onClick={handleAddLeadClick}
          >
            <PlusCircle className="h-4 w-4" />
            {!isMobile && <span>إضافة عميل محتمل</span>}
          </Button>
        </div>
      </div>

      {isMobile && (
        <div className="relative mt-2 mb-4">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث عن عميل محتمل..."
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background"
          />
        </div>
      )}

      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none p-3' : 'sm:max-w-lg'}`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">إضافة عميل محتمل جديد</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <MobileOptimizedContainer>
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
