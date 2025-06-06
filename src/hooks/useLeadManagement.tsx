
import { useState, useEffect, useCallback } from 'react';
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

  // Fetch leads with filters
  const fetchFilteredLeads = async () => {
    console.log("Fetching leads with filters:", filters);
    try {
      // Create a query that applies all filters
      let query = supabase.from('leads').select(`
        *,
        profiles:assigned_to(first_name, last_name)
      `);
      
      // Apply status/stage filter
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      // Apply view-specific filters
      if (selectedView === "my") {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('assigned_to', user.id);
        }
      } else if (selectedView === "new") {
        query = query.eq('status', 'new');
      } else if (selectedView === "qualified") {
        query = query.eq('status', 'qualified');
      }
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching leads from Supabase:", error);
        throw error;
      }
      
      // Transform the data to match the expected Lead format
      const transformedLeads = data?.map(lead => {
        return {
          ...lead,
          owner: lead.profiles ? {
            id: lead.assigned_to || '',
            name: `${lead.profiles.first_name || ''} ${lead.profiles.last_name || ''}`.trim() || 'Unassigned',
            initials: `${(lead.profiles.first_name || '')[0] || ''}${(lead.profiles.last_name || '')[0] || ''}`,
          } : undefined
        };
      }) || [];
      
      return transformedLeads;
    } catch (error) {
      console.error("Error in fetchFilteredLeads:", error);
      return [];
    }
  };

  // Use react-query to fetch leads with a shorter staleTime for more frequent refreshes
  const { 
    data: leads = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['leads', selectedView, filters, searchTerm, forceRefresh],
    queryFn: fetchFilteredLeads,
    staleTime: 2000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
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

  const handleLeadClick = (leadId: string | null) => {
    setSelectedLead(leadId);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRefresh = useCallback(() => {
    console.log("Manually refreshing leads data");
    setForceRefresh(prev => prev + 1);
    refetch();
    toast.success("تم تحديث البيانات بنجاح");
  }, [refetch]);

  const handleAddLead = () => {
    setIsAddLeadOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const handleLeadSuccess = useCallback((lead?: Lead) => {
    console.log("Lead operation successful, lead:", lead);
    setIsAddLeadOpen(false);
    setIsEditLeadOpen(false);
    setLeadToEdit(null);
    
    // Force immediate refresh to ensure data is up-to-date
    setForceRefresh(prev => prev + 1);
    refetch();
    
    // If a lead was just added or edited, select it
    if (lead && lead.id) {
      setSelectedLead(lead.id);
    }
  }, [refetch]);
  
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
      toast.success("تم حذف العميل المحتمل بنجاح");
      
      if (selectedLead === leadToDelete) {
        setSelectedLead(null);
      }
      
      // Ensure data is refreshed after deletion
      setForceRefresh(prev => prev + 1);
      await refetch();
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
    filters,
    searchTerm,
    
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
