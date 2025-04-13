
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TicketsList from "@/components/tickets/TicketsList";
import TicketForm from "@/components/tickets/TicketForm";
import TicketFilters from "@/components/tickets/TicketFilters";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

const TicketsManagement = () => {
  const [view, setView] = useState<"all" | "open" | "closed">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're navigating to create a new ticket
    if (location.state?.createNew) {
      setIsCreating(true);
      // Clear the state to avoid persistent creation mode
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const handleCreateTicket = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveTicket = () => {
    toast.success("تم حفظ التذكرة بنجاح");
    setIsCreating(false);
    // Trigger refresh of the tickets list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة التذاكر</h1>
            
            {!isCreating && (
              <button 
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
              >
                إضافة تذكرة جديدة
              </button>
            )}
          </div>

          {isCreating ? (
            <Card>
              <CardHeader>
                <CardTitle>تذكرة جديدة</CardTitle>
                <CardDescription>أدخل تفاصيل التذكرة الجديدة</CardDescription>
              </CardHeader>
              <CardContent>
                <TicketForm 
                  onCancel={handleCancelCreate}
                  onSave={handleSaveTicket}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <Tabs defaultValue="all" value={view} onValueChange={(v) => setView(v as "all" | "open" | "closed")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">جميع التذاكر</TabsTrigger>
                  <TabsTrigger value="open">التذاكر المفتوحة</TabsTrigger>
                  <TabsTrigger value="closed">التذاكر المغلقة</TabsTrigger>
                </TabsList>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle>قائمة التذاكر</CardTitle>
                        <CardDescription>إدارة وحل مشاكل العملاء</CardDescription>
                      </div>
                      <TicketFilters 
                        onPriorityChange={setFilterPriority}
                        onCategoryChange={setFilterCategory}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TicketsList 
                      view={view} 
                      filterPriority={filterPriority}
                      filterCategory={filterCategory}
                      triggerRefresh={refreshTrigger}
                    />
                  </CardContent>
                </Card>
              </Tabs>
            </>
          )}
        </div>
      </DashboardLayout>
    </QueryClientProvider>
  );
};

export default TicketsManagement;
