
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { Lead } from "@/services/leads";
import LeadCardHeader from "@/components/leads/LeadCardHeader";
import LeadSearchBar from "@/components/leads/LeadSearchBar";
import LeadFilters from "@/components/leads/LeadFilters";
import LeadTable from "@/components/leads/LeadTable";

interface LeadListSectionProps {
  leads: Lead[];
  selectedView: string;
  selectedLead: string | null;
  showFilters: boolean;
  isLoading: boolean;
  isError: boolean;
  onViewChange: (view: string) => void;
  onSearch: (term: string) => void;
  onLeadSelect: (leadId: string) => void;
  onFilterChange: (filters: Record<string, any>) => void;
  onRefresh: () => void;
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
  onRefresh
}) => {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <LeadCardHeader />
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

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LeadListSection;
