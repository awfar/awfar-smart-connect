
import React, { useEffect, useState } from 'react';
import LeadHeader from "@/components/leads/LeadHeader";
import LeadListSection from "@/components/leads/LeadListSection";
import LeadDetailSidebar from "@/components/leads/LeadDetailSidebar";
import AddLeadDialog from "@/components/leads/dialogs/AddLeadDialog";
import EditLeadDialog from "@/components/leads/dialogs/EditLeadDialog";
import DeleteLeadDialog from "@/components/leads/dialogs/DeleteLeadDialog";
import { useLeadManagement } from "@/hooks/useLeadManagement";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LeadPermissionAlert from "@/components/leads/LeadPermissionAlert";
import { useAuth } from '@/contexts/AuthContext';
import { useBreakpoints } from '@/hooks/use-mobile';
import { Lead } from "@/types/leads"; // Using the centralized Lead type
import { useNavigate } from 'react-router-dom';

const LeadManagement = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();
  const { isMobile } = useBreakpoints();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      const fetchCurrentUser = async () => {
        const { data } = await supabase.auth.getUser();
        if (data && data.user) {
          setCurrentUserEmail(data.user.email);
        }
      };
      
      fetchCurrentUser();
    } else if (user) {
      setCurrentUserEmail(user.email);
    }
  }, [isLoggedIn, user]);

  const {
    selectedView,
    showFilters,
    selectedLead,
    leads: serviceLeads,
    isLoading,
    isError,
    isAddLeadOpen,
    isEditLeadOpen,
    isDeleteDialogOpen,
    leadToEdit,
    leadToDelete,
    supabaseStatus,
    
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
    refetch
  } = useLeadManagement();

  // Transform leads to ensure consistent structure with proper owner fields
  const leads: Lead[] = serviceLeads.map(lead => ({
    id: lead.id,
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    position: lead.position,
    country: lead.country,
    industry: lead.industry,
    stage: lead.stage || lead.status,
    status: lead.status || lead.stage,
    source: lead.source,
    notes: lead.notes,
    created_at: lead.created_at,
    updated_at: lead.updated_at,
    assignedTo: lead.assigned_to,
    assigned_to: lead.assigned_to,
    avatar_url: lead.avatar_url,
    owner: lead.owner ? {
      id: lead.owner.id || '',  // Ensure id is never undefined
      name: lead.owner.name || (lead.owner.first_name && lead.owner.last_name ? `${lead.owner.first_name} ${lead.owner.last_name}`.trim() : ''),
      avatar: lead.owner.avatar || '',
      initials: lead.owner.initials || (lead.owner.first_name?.charAt(0) || '') + (lead.owner.last_name?.charAt(0) || ''),
      first_name: lead.owner.first_name,
      last_name: lead.owner.last_name
    } : undefined
  }));

  // Enhanced lead click handler for mobile view
  const handleMobileLeadClick = (leadId: string) => {
    if (isMobile) {
      navigate(`/dashboard/leads/${leadId}`);
    } else {
      handleLeadClick(leadId);
    }
  };

  const selectedLeadObject = getSelectedLeadObject();
  // Get the name of the lead to be deleted
  const leadToDeleteName = serviceLeads.find(lead => lead.id === leadToDelete)?.first_name + ' ' + 
                           serviceLeads.find(lead => lead.id === leadToDelete)?.last_name || 'العميل المحتمل';

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <LeadHeader 
        onToggleFilters={toggleFilters}
        onRefresh={handleRefresh}
        onAddLead={handleAddLead}
        onSearch={handleSearch}
      />

      <LeadPermissionAlert email={currentUserEmail} isAuthenticated={isLoggedIn} />

      {!supabaseStatus.isConnected && (
        <Alert variant="warning" className="mb-2 md:mb-4 bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">حالة الاتصال بقاعدة البيانات</AlertTitle>
          <AlertDescription className="text-amber-700">
            {supabaseStatus.message} - سيتم تخزين البيانات مؤقتًا في الذاكرة فقط.
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
          onLeadSelect={handleMobileLeadClick}
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
        />

        {selectedLead && selectedLeadObject && !isMobile && (
          <LeadDetailSidebar 
            lead={selectedLeadObject}
            onClose={() => handleLeadClick(selectedLead)}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            onRefresh={refetch}
          />
        )}
      </div>

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
        leadName={leadToDeleteName}
      />
    </div>
  );
};

export default LeadManagement;
