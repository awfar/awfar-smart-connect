
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lead } from "@/types/leads";
import LeadCardHeader from "@/components/leads/LeadCardHeader";
import LeadSearchBar from "@/components/leads/LeadSearchBar";
import LeadFilters from "@/components/leads/LeadFilters";
import LeadTable from "@/components/leads/LeadTable";
import { useBreakpoints } from '@/hooks/use-mobile';
import { Spinner } from '@/components/ui/spinner';

interface LeadListSectionProps {
  leads: Lead[];
  selectedView: string;
  selectedLead: string | null;
  showFilters: boolean;
  isLoading: boolean;
  isError: boolean;
  onViewChange: (view: string) => void;
  onSearch: (term: string) => void;
  onLeadSelect: (leadId: string | null) => void;
  onFilterChange: (filters: Record<string, any>) => void;
  onRefresh: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onAddLead: () => void;
  onViewProfile: (leadId: string) => void;
}

const LeadListSection: React.FC<LeadListSectionProps> = ({
  leads,
  selectedView,
  selectedLead,
  showFilters,
  isLoading,
  isError,
  onViewChange,
  onSearch,
  onLeadSelect,
  onFilterChange,
  onRefresh,
  onEdit,
  onDelete,
  onAddLead,
  onViewProfile
}) => {
  const { isMobile } = useBreakpoints();

  return (
    <Card className="flex-1 overflow-hidden border rounded-lg shadow-sm">
      <CardHeader className={`pb-3 ${isMobile ? 'px-3' : ''}`}>
        <LeadCardHeader 
          onToggleFilters={toggleFilters} 
          onRefresh={onRefresh}
          onAddLead={onAddLead}
          onSearch={onSearch}
        />
        <div className="mt-4">
          <LeadSearchBar 
            selectedView={selectedView}
            onViewChange={onViewChange}
            onSearch={onSearch}
          />
        </div>
      </CardHeader>
      
      {showFilters && (
        <LeadFilters 
          onFilterChange={onFilterChange}
        />
      )}

      <CardContent className={isMobile ? 'px-2 py-3' : ''}>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner size="lg" className="text-primary" />
            <span className="mr-2 text-muted-foreground">جاري تحميل البيانات...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            <p>حدث خطأ أثناء تحميل البيانات</p>
            <button 
              className="mt-2 text-primary hover:underline" 
              onClick={onRefresh}
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <LeadTable 
            leads={leads} 
            selectedLead={selectedLead}
            onLeadSelect={onLeadSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewProfile={onViewProfile}
          />
        )}
      </CardContent>
    </Card>
  );

  function toggleFilters() {
    onFilterChange({});
  }
};

export default LeadListSection;
