
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
import { getLeads } from "@/services/leads";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from "@/components/leads/LeadForm";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import DashboardLayout from "@/components/layout/DashboardLayout";

// Create compatibility interface to handle the type mismatch
interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  source?: string;
  status: string;
  notes?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
  landing_page_id?: string;
}

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
    queryKey: ['leads', filters],
    queryFn: () => getLeads(filters),
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
    setFilters(prev => ({ ...prev, search: term }));
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
                    leads={leads as any[]} 
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
                lead={leads.find(l => l.id === selectedLead) as any} 
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
