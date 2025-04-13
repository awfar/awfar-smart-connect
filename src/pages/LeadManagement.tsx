
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LeadFilters from "@/components/leads/LeadFilters";
import LeadDetails from "@/components/leads/LeadDetails";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadSearchBar from "@/components/leads/LeadSearchBar";
import LeadCardHeader from "@/components/leads/LeadCardHeader";
import LeadTable from "@/components/leads/LeadTable";
import { getLeads } from "@/services/leadsService";
import { Lead } from "@/types/leads";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from "@/components/leads/LeadForm";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import DashboardLayout from "@/components/layout/DashboardLayout";

// Define a conversion function to ensure type compatibility
const convertLeadTypes = (lead: Lead): any => {
  // Ensure required fields are present
  return {
    ...lead,
    stage: lead.stage || "جديد",
    name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
  };
};

const LeadManagement = () => {
  const [selectedView, setSelectedView] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState<boolean>(false);

  // Function to fetch leads
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const fetchedLeads = await getLeads();
      // Convert the leads to the expected format
      const convertedLeads = fetchedLeads.map(convertLeadTypes);
      setLeads(convertedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات العملاء المحتملين");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLeadClick = (leadId: string) => {
    setSelectedLead(leadId === selectedLead ? null : leadId);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRefresh = () => {
    fetchLeads();
    toast.success("تم تحديث البيانات بنجاح");
  };

  const handleAddLead = () => {
    setIsAddLeadOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search functionality here
  };

  const handleLeadSuccess = () => {
    setIsAddLeadOpen(false);
    fetchLeads();
    toast.success("تم إضافة العميل المحتمل بنجاح");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <LeadHeader 
          onToggleFilters={toggleFilters}
          onRefresh={handleRefresh}
          onAddLead={handleAddLead}
        />

        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1">
            <Card>
              <CardHeader className="pb-3">
                <LeadCardHeader />
                <div className="mt-4">
                  <LeadSearchBar 
                    selectedView={selectedView}
                    onViewChange={setSelectedView}
                    onSearch={handleSearch}
                  />
                </div>
              </CardHeader>
              
              {showFilters && <LeadFilters />}

              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <LeadTable 
                    leads={leads} 
                    selectedLead={selectedLead}
                    onLeadSelect={handleLeadClick}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {selectedLead && (
            <div className="w-full lg:w-[400px]">
              <LeadDetails 
                lead={leads.find(l => l.id === selectedLead)!} 
                onClose={() => setSelectedLead(null)} 
              />
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-lg">
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
    </DashboardLayout>
  );
};

export default LeadManagement;
