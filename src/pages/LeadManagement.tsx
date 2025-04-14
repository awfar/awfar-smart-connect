
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

import LeadFilters from "@/components/leads/LeadFilters";
import LeadDetails from "@/components/leads/LeadDetails";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadSearchBar from "@/components/leads/LeadSearchBar";
import LeadCardHeader from "@/components/leads/LeadCardHeader";
import LeadTable from "@/components/leads/LeadTable";
import { getLeads, Lead } from "@/services/leads";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from "@/components/leads/LeadForm";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import DashboardLayout from "@/components/layout/DashboardLayout";

const LeadManagement = () => {
  const [selectedView, setSelectedView] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Use react-query to fetch leads
  const { 
    data: leads = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['leads', selectedView, filters, searchTerm],
    queryFn: () => {
      // Combine view filter with other filters
      const combinedFilters = { ...filters };
      
      if (selectedView === "my") {
        // In a real app, this would be the current user's ID
        combinedFilters.assigned_to = "current-user-id";
      } else if (selectedView === "new") {
        combinedFilters.stage = "جديد";
      } else if (selectedView === "qualified") {
        combinedFilters.stage = "مؤهل";
      }
      
      if (searchTerm) {
        combinedFilters.search = searchTerm;
      }
      
      return getLeads(combinedFilters);
    },
  });

  const handleLeadClick = (leadId: string) => {
    setSelectedLead(leadId === selectedLead ? null : leadId);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("تم تحديث البيانات بنجاح");
  };

  const handleAddLead = () => {
    setIsAddLeadOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleLeadSuccess = () => {
    setIsAddLeadOpen(false);
    refetch();
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
              
              {showFilters && (
                <LeadFilters 
                  onFilterChange={handleFilterChange}
                />
              )}

              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : isError ? (
                  <div className="text-center py-8 text-red-500">
                    <p>حدث خطأ أثناء تحميل البيانات</p>
                    <button 
                      className="mt-2 text-primary hover:underline" 
                      onClick={handleRefresh}
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                ) : (
                  <LeadTable 
                    leads={leads as Lead[]} 
                    selectedLead={selectedLead}
                    onLeadSelect={handleLeadClick}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {selectedLead && Array.isArray(leads) && (
            <div className="w-full lg:w-[400px]">
              <LeadDetails 
                lead={leads.find(l => l.id === selectedLead) as Lead} 
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
