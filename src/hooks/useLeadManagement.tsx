
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getLeads, Lead, deleteLead } from "@/services/leads";
import { supabase } from "@/integrations/supabase/client";

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
  const [supabaseStatus, setSupabaseStatus] = useState<{isConnected: boolean, message: string}>({
    isConnected: false, 
    message: "Checking connection..."
  });

  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('leads').select('count').limit(1);
        
        if (error) {
          console.error("Supabase connection error:", error);
          setSupabaseStatus({
            isConnected: false,
            message: `Connection issue: ${error.message}`
          });
        } else {
          console.log("Supabase connection successful:", data);
          setSupabaseStatus({
            isConnected: true,
            message: "Connected to Supabase"
          });
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setSupabaseStatus({
          isConnected: false,
          message: `Connection error: ${err instanceof Error ? err.message : String(err)}`
        });
      }
    };
    
    checkConnection();
  }, []);

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
        
        // Log if we got data from Supabase or mock
        if (fetchedLeads.length > 0 && !fetchedLeads[0].id.startsWith('lead-')) {
          console.log("✅ Retrieved leads from Supabase DB");
        } else if (fetchedLeads.length > 0) {
          console.warn("⚠️ Retrieved mock leads (not from Supabase)");
        }
        
        return fetchedLeads;
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("فشل في تحميل العملاء المحتملين");
        throw error;
      }
    },
    // Shorter stale time to ensure frequent refreshes
    staleTime: 3000, // 3 seconds (reduced from 5 seconds)
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refresh every 5 seconds (reduced from 10 seconds)
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
    
    // Force multiple refreshes to ensure data is up-to-date
    // First immediate refresh
    setForceRefresh(prev => prev + 1);
    refetch();
    
    // Second refresh after a short delay
    setTimeout(() => {
      console.log("Triggering second refresh after lead operation");
      setForceRefresh(prev => prev + 1);
      refetch();
    }, 300);
    
    // Third refresh to ensure data is properly loaded
    setTimeout(() => {
      console.log("Triggering final refresh after lead operation");
      setForceRefresh(prev => prev + 1);
      refetch();
    }, 1000);
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
  };
};
