
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/leads';
import { useBreakpoints } from '@/hooks/use-mobile';

interface LeadProfileHeaderProps {
  lead: Lead;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const LeadProfileHeader: React.FC<LeadProfileHeaderProps> = ({
  lead,
  onBack,
  onEdit,
  onDelete
}) => {
  const { isMobile } = useBreakpoints();

  return (
    <div className="bg-background shadow-sm rounded-lg">
      <div className="px-4 py-3 sm:p-6">
        {/* Back button and actions */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="p-0 h-8"
          >
            <ArrowLeft className="h-5 w-5 ml-1" />
            <span className="text-sm">العودة</span>
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-8"
            >
              <Edit className="h-4 w-4 ml-1.5" />
              {!isMobile && "تعديل"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="h-8"
            >
              <Trash2 className="h-4 w-4 ml-1.5" />
              {!isMobile && "حذف"}
            </Button>
          </div>
        </div>

        {/* Lead name and badge */}
        <div className="text-center sm:text-right">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-xl font-bold">
              {lead.first_name} {lead.last_name}
            </h1>
            <Badge variant="outline" className="w-fit mx-auto sm:mx-0">
              {lead.stage || lead.status || "غير محدد"}
            </Badge>
          </div>
          
          {(lead.company || lead.position) && (
            <p className="text-muted-foreground text-sm mt-1">
              {lead.position}
              {lead.position && lead.company && " - "}
              {lead.company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadProfileHeader;
