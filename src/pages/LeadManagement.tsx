
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import LeadFilters from "@/components/leads/LeadFilters";
import LeadDetails from "@/components/leads/LeadDetails";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadSearchBar from "@/components/leads/LeadSearchBar";
import LeadCardHeader from "@/components/leads/LeadCardHeader";
import LeadTable from "@/components/leads/LeadTable";
import { getLeads, Lead, deleteLead } from "@/services/leads";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from "@/components/leads/LeadForm";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2 } from 'lucide-react';

const LeadManagement = () => {
  const [selectedView, setSelectedView] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState<boolean>(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Use react-query to fetch leads
  const { 
    data: leads = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['leads', selectedView, filters, searchTerm],
    queryFn: async () => {
      // Combine view filter with other filters
      const combinedFilters = { ...filters };
      
      if (selectedView === "my") {
        combinedFilters.assigned_to = "current-user-id"; // In a real app, this would be the current user's ID
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

  // When leads change, update selected lead if needed
  useEffect(() => {
    if (selectedLead) {
      const leadExists = leads.some(lead => lead.id === selectedLead);
      if (!leadExists) {
        setSelectedLead(null);
      }
    }
  }, [leads, selectedLead]);

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
    setFilters(newFilters);
  };

  const handleLeadSuccess = () => {
    setIsAddLeadOpen(false);
    setIsEditLeadOpen(false);
    setLeadToEdit(null);
    refetch();
  };
  
  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsEditLeadOpen(true);
  };
  
  const handleDeleteLead = (leadId: string) => {
    setLeadToDelete(leadId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    
    try {
      await deleteLead(leadToDelete);
      if (selectedLead === leadToDelete) {
        setSelectedLead(null);
      }
      refetch();
      toast.success("تم حذف العميل المحتمل بنجاح");
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("فشل في حذف العميل المحتمل");
    } finally {
      setLeadToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const getSelectedLeadObject = (): Lead | undefined => {
    return leads.find(l => l.id === selectedLead);
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
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <span className="mr-2 text-muted-foreground">جاري تحميل البيانات...</span>
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

          {selectedLead && getSelectedLeadObject() && (
            <div className="w-full lg:w-[400px]">
              <LeadDetails 
                lead={getSelectedLeadObject() as Lead} 
                onClose={() => setSelectedLead(null)}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
                onRefresh={refetch}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Dialog */}
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

      {/* Edit Lead Dialog */}
      <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">تعديل بيانات العميل المحتمل</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <MobileOptimizedContainer>
              {leadToEdit && (
                <LeadForm 
                  lead={leadToEdit}
                  onClose={() => {
                    setIsEditLeadOpen(false);
                    setLeadToEdit(null);
                  }}
                  onSuccess={handleLeadSuccess}
                />
              )}
            </MobileOptimizedContainer>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف العميل المحتمل</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا العميل المحتمل؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteLead} className="bg-red-500 hover:bg-red-600">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default LeadManagement;
