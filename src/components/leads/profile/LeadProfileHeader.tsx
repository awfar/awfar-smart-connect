
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="bg-white shadow-sm">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size={isMobile ? "sm" : "default"}
              onClick={onBack}
              className="mr-auto"
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={onEdit}
              >
                <Edit className="h-4 w-4 ml-2" />
                {!isMobile && "تعديل"}
              </Button>
              <Button
                variant="destructive"
                size={isMobile ? "sm" : "default"}
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                {!isMobile && "حذف"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl font-bold">
                {lead.first_name} {lead.last_name}
              </h1>
              <Badge variant="outline" className="w-fit">
                {lead.stage || lead.status || "غير محدد"}
              </Badge>
            </div>
            
            {(lead.company || lead.position) && (
              <p className="text-muted-foreground">
                {lead.position}
                {lead.position && lead.company && " - "}
                {lead.company}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadProfileHeader;
