
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadListSection from "@/components/leads/LeadListSection";
import LeadDetailSidebar from "@/components/leads/LeadDetailSidebar";
import AddLeadDialog from "@/components/leads/dialogs/AddLeadDialog";
import EditLeadDialog from "@/components/leads/dialogs/EditLeadDialog";
import DeleteLeadDialog from "@/components/leads/dialogs/DeleteLeadDialog";
import { useLeadManagement } from "@/hooks/useLeadManagement";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const LeadManagement = () => {
  const {
    // State
    selectedView,
    showFilters,
    selectedLead,
    leads,
    isLoading,
    isError,
    isAddLeadOpen,
    isEditLeadOpen,
    isDeleteDialogOpen,
    leadToEdit,
    leadToDelete,
    supabaseStatus,
    
    // Actions
    setSelectedView,
    toggleFilters,
    handleRefresh,
    handleAddLead,
    handleSearch,
    handleFilterChange,
    handleLeadSuccess,
    handleLeadClick,
    handleEditLead,
    handleDeleteLead,
    confirmDeleteLead,
    setIsAddLeadOpen,
    setIsEditLeadOpen,
    setIsDeleteDialogOpen,
    
    // Helpers
    getSelectedLeadObject,
    refetch
  } = useLeadManagement();

  const selectedLeadObject = getSelectedLeadObject();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <LeadHeader 
          onToggleFilters={toggleFilters}
          onRefresh={handleRefresh}
          onAddLead={handleAddLead}
        />

        {!supabaseStatus.isConnected && (
          <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
            <InfoIcon className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Supabase Connection Status</AlertTitle>
            <AlertDescription className="text-amber-700">
              {supabaseStatus.message} - Leads will be stored temporarily in memory only.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4 flex-col lg:flex-row">
          <LeadListSection
            leads={leads}
            selectedView={selectedView}
            selectedLead={selectedLead}
            showFilters={showFilters}
            isLoading={isLoading}
            isError={isError}
            onViewChange={setSelectedView}
            onSearch={handleSearch}
            onLeadSelect={handleLeadClick}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
          />

          {selectedLead && selectedLeadObject && (
            <LeadDetailSidebar 
              lead={selectedLeadObject}
              onClose={() => handleLeadClick(selectedLead)}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onRefresh={refetch}
            />
          )}
        </div>
      </div>

      {/* Dialog components */}
      <AddLeadDialog 
        isOpen={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onSuccess={handleLeadSuccess}
      />

      <EditLeadDialog 
        isOpen={isEditLeadOpen}
        onOpenChange={setIsEditLeadOpen}
        lead={leadToEdit}
        onSuccess={handleLeadSuccess}
      />

      <DeleteLeadDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteLead}
      />
    </DashboardLayout>
  );
};

export default LeadManagement;
