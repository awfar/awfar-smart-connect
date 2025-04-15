
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getLeads, Lead, deleteLead } from "@/services/leads";

export const useLeadManagement = () => {
  // State management
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
  const [forceRefresh, setForceRefresh] = useState<number>(0);

  // Use react-query to fetch leads with a shorter staleTime for more frequent refreshes
  const { 
    data: leads = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['leads', selectedView, filters, searchTerm, forceRefresh],
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
      
      console.log("Fetching leads with filters:", combinedFilters);
      try {
        const fetchedLeads = await getLeads(combinedFilters);
        console.log("Fetched leads:", fetchedLeads.length);
        return fetchedLeads;
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("فشل في تحميل العملاء المحتملين");
        throw error;
      }
    },
    // Shorter stale time to ensure frequent refreshes
    staleTime: 5000, // 5 seconds (reduced from 10 seconds)
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 10000, // Refresh every 10 seconds
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
    console.log("Manually refreshing leads data");
    setForceRefresh(prev => prev + 1);
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

  const handleLeadSuccess = (lead?: Lead) => {
    console.log("Lead operation successful, lead:", lead);
    setIsAddLeadOpen(false);
    setIsEditLeadOpen(false);
    setLeadToEdit(null);
    
    // Force immediate first refresh
    setTimeout(() => {
      console.log("Triggering first refresh after lead operation");
      setForceRefresh(prev => prev + 1);
      refetch();
    }, 100); // Reduced from 300ms
    
    // Double check refresh after a bit longer delay
    setTimeout(() => {
      console.log("Triggering second refresh after lead operation");
      setForceRefresh(prev => prev + 2);
      refetch();
    }, 500); // Reduced from 1000ms
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
      
      // Ensure data is refreshed after deletion
      setForceRefresh(prev => prev + 1);
      await refetch();
      
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

  return {
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
  };
};
