
import React from 'react';
import { Lead } from "@/services/leads";
import LeadDetails from "@/components/leads/LeadDetails";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
  const navigate = useNavigate();

  const handleViewFullProfile = () => {
    if (lead && lead.id) {
      navigate(`/dashboard/leads/${lead.id}`);
    }
  };

  return (
    <div className="w-full lg:w-[400px] relative">
      <div className="mb-4 px-4 pt-4">
        <Button 
          onClick={handleViewFullProfile}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          <ExternalLink className="h-4 w-4 ml-2" />
          عرض الصفحة الكاملة
        </Button>
      </div>
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
