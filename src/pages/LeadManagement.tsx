
import React from 'react';
import { useLeadManagement } from '@/hooks/useLeadManagement';
import { LeadListSection } from '@/components/leads';
import LeadDetailSidebar from '@/components/leads/LeadDetailSidebar';
import AddLeadDialog from '@/components/leads/dialogs/AddLeadDialog';
import EditLeadDialog from '@/components/leads/dialogs/EditLeadDialog';
import DeleteLeadDialog from '@/components/leads/dialogs/DeleteLeadDialog';
import { useBreakpoints } from '@/hooks/use-mobile';

const LeadManagement = () => {
  const {
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
    getSelectedLeadObject,
  } = useLeadManagement();

  const { isMobile } = useBreakpoints();

  // Get the selected lead object
  const selectedLeadObject = getSelectedLeadObject();

  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="flex-1 overflow-hidden flex flex-col">
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
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          onAddLead={handleAddLead}
        />
      </div>

      {selectedLead && selectedLeadObject && !isMobile && (
        <div className="w-[400px] border-l overflow-hidden">
          <LeadDetailSidebar 
            lead={selectedLeadObject}
            onClose={() => handleLeadClick(selectedLead)}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            onRefresh={handleRefresh}
          />
        </div>
      )}

      {/* Add Lead Dialog */}
      {isAddLeadOpen && (
        <AddLeadDialog 
          isOpen={isAddLeadOpen} 
          onOpenChange={setIsAddLeadOpen} 
          onSuccess={handleLeadSuccess}
        />
      )}

      {/* Edit Lead Dialog */}
      {isEditLeadOpen && leadToEdit && (
        <EditLeadDialog 
          isOpen={isEditLeadOpen} 
          onOpenChange={setIsEditLeadOpen} 
          lead={leadToEdit}
          onSuccess={handleLeadSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && leadToDelete && (
        <DeleteLeadDialog 
          isOpen={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen} 
          onConfirm={confirmDeleteLead}
          leadName={leads.find(l => l.id === leadToDelete)?.first_name + ' ' + leads.find(l => l.id === leadToDelete)?.last_name}
        />
      )}
    </div>
  );
};

export default LeadManagement;
