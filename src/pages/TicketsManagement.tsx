
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import TicketsList from "@/components/tickets/TicketsList";
import TicketForm from "@/components/tickets/TicketForm";
import TicketFilters from "@/components/tickets/TicketFilters";
import { toast } from "sonner";

const TicketsManagement = () => {
  const [view, setView] = useState<"all" | "open" | "closed">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const handleCreateTicket = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveTicket = () => {
    toast.success("تم حفظ التذكرة بنجاح");
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
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
                      />
                    </CardContent>
                  </Card>
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TicketsManagement;
