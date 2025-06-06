
import React from 'react';
import { Lead } from "@/services/leads";
import LeadDetails from "@/components/leads/LeadDetails";
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface LeadDetailSidebarProps {
  lead: Lead;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onRefresh: () => void;
  onViewFullProfile: () => void;
}

const LeadDetailSidebar: React.FC<LeadDetailSidebarProps> = ({
  lead,
  onClose,
  onEdit,
  onDelete,
  onRefresh,
  onViewFullProfile
}) => {
  return (
    <div className="w-full h-full lg:w-[400px] flex flex-col">
      <div className="mb-4 px-4 pt-4">
        <Button 
          onClick={onViewFullProfile}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          <ExternalLink className="h-4 w-4 ml-2" />
          عرض الصفحة الكاملة
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <LeadDetails 
          lead={lead} 
          onClose={onClose}
          onEdit={onEdit}
          onDelete={onDelete}
          onRefresh={onRefresh}
          onViewFullProfile={onViewFullProfile}
        />
      </div>
    </div>
  );
};

export default LeadDetailSidebar;
