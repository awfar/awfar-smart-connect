
import React from 'react';
import { Lead } from "@/services/leads";
import LeadDetails from "@/components/leads/LeadDetails";

interface LeadDetailSidebarProps {
  lead: Lead;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onRefresh: () => void;
}

const LeadDetailSidebar: React.FC<LeadDetailSidebarProps> = ({
  lead,
  onClose,
  onEdit,
  onDelete,
  onRefresh
}) => {
  return (
    <div className="w-full lg:w-[400px]">
      <LeadDetails 
        lead={lead} 
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default LeadDetailSidebar;
