
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DealsList from "@/components/deals/DealsList";
import DealForm from "@/components/deals/DealForm";
import DealFilters from "@/components/deals/DealFilters";
import { getDeals } from "@/services/dealsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DealsManagement = () => {
  const [view, setView] = useState<"all" | "active" | "won" | "lost">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterOwner, setFilterOwner] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<{fromDate?: string; toDate?: string}>({});
  const [sortConfig, setSortConfig] = useState<{column: string; direction: 'asc' | 'desc'} | null>(null);
  
  const queryClient = useQueryClient();
  
  // Build filters object based on all filter settings
  const buildFilters = () => {
    const filters: Record<string, any> = {};
    
    if (filterStage !== "all") filters.stage = filterStage;
    if (filterStatus !== "all") filters.status = filterStatus;
    if (filterOwner !== "all") filters.owner_id = filterOwner;
    
    if (filterValue !== "all") {
      switch (filterValue) {
        case "low":
          filters.maxValue = 10000;
          break;
        case "medium":
          filters.minValue = 10000;
          filters.maxValue = 50000;
          break;
        case "high":
          filters.minValue = 50000;
          break;
      }
    }
    
    if (searchTerm) filters.search = searchTerm;
    if (dateRange.fromDate || dateRange.toDate) filters.closeDate = dateRange;
    if (sortConfig) filters.sortBy = sortConfig;
    
    return filters;
  };
  
  const { data: deals, isLoading, refetch } = useQuery({
    queryKey: ['deals', view, filterStage, filterStatus, filterOwner, filterValue, searchTerm, dateRange, sortConfig],
    queryFn: () => getDeals(buildFilters()),
  });

  const handleCreateDeal = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveDeal = () => {
    setIsCreating(false);
    // Invalidate and refetch deals after save
    queryClient.invalidateQueries({ queryKey: ['deals'] });
    toast.success("تم حفظ الصفقة بنجاح");
  };

  const handleViewChange = (newView: "all" | "active" | "won" | "lost") => {
    setView(newView);
    if (newView !== "all") {
      setFilterStatus(newView);
    } else {
      setFilterStatus("all");
    }
  };

  const handleStageChange = (value: string) => {
    setFilterStage(value);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
  };

  const handleOwnerChange = (value: string) => {
    setFilterOwner(value);
  };

  const handleValueChange = (value: string) => {
    setFilterValue(value);
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleDateRangeChange = (range: {fromDate?: string; toDate?: string}) => {
    setDateRange(range);
  };
  
  const handleResetFilters = () => {
    setFilterStage("all");
    setFilterStatus(view !== "all" ? view : "all");
    setFilterOwner("all");
    setFilterValue("all");
    setSearchTerm("");
    setDateRange({});
    setSortConfig(null);
  };
  
  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortConfig({ column, direction });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة الصفقات</h1>
          <p className="text-muted-foreground mt-1">إدارة ومتابعة صفقات المبيعات والفرص</p>
        </div>
        
        <Button onClick={handleCreateDeal}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة صفقة جديدة
        </Button>
      </div>

      <Tabs defaultValue="all" value={view} onValueChange={(v) => handleViewChange(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">جميع الصفقات</TabsTrigger>
          <TabsTrigger value="active">الصفقات النشطة</TabsTrigger>
          <TabsTrigger value="won">الصفقات المربوحة</TabsTrigger>
          <TabsTrigger value="lost">الصفقات المفقودة</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader className="pb-3">
            <DealFilters 
              onStageChange={handleStageChange}
              onStatusChange={handleStatusChange}
              onOwnerChange={handleOwnerChange}
              onValueChange={handleValueChange}
              onSearchChange={handleSearchChange}
              onDateRangeChange={handleDateRangeChange}
              onResetFilters={handleResetFilters}
            />
          </CardHeader>
          <CardContent>
            <DealsList 
              deals={deals || []}
              onRefresh={refetch}
              onSort={handleSort}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </Tabs>

      {/* Deal Creation Modal */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>صفقة جديدة</DialogTitle>
          </DialogHeader>
          <DealForm 
            onCancel={handleCancelCreate}
            onSave={handleSaveDeal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealsManagement;
