
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Filter, RefreshCw, PlusCircle 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from './LeadForm';
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';

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
          <Button size="sm" className="gap-1" onClick={handleAddLeadClick}>
            <PlusCircle className="h-4 w-4" />
            إضافة عميل محتمل
          </Button>
        </div>
      </div>

      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">إضافة عميل محتمل جديد</DialogTitle>
          </DialogHeader>
          <MobileOptimizedContainer className="mt-4">
            <LeadForm 
              onClose={() => setIsAddLeadOpen(false)}
              onSuccess={handleLeadSuccess}
            />
          </MobileOptimizedContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadHeader;
