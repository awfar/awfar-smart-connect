
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DealsList from "@/components/deals/DealsList";
import DealForm from "@/components/deals/DealForm";
import DealFilters from "@/components/deals/DealFilters";
import { toast } from "sonner";

const DealsManagement = () => {
  const [view, setView] = useState<"all" | "active" | "won" | "lost">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("all");
  
  const handleCreateDeal = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveDeal = () => {
    toast.success("تم حفظ الصفقة بنجاح");
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
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة الصفقات</h1>
              
              {!isCreating && (
                <button 
                  onClick={handleCreateDeal}
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
                >
                  إضافة صفقة جديدة
                </button>
              )}
            </div>

            {isCreating ? (
              <Card>
                <CardHeader>
                  <CardTitle>صفقة جديدة</CardTitle>
                  <CardDescription>أدخل تفاصيل الصفقة الجديدة</CardDescription>
                </CardHeader>
                <CardContent>
                  <DealForm 
                    onCancel={handleCancelCreate}
                    onSave={handleSaveDeal}
                  />
                </CardContent>
              </Card>
            ) : (
              <>
                <Tabs defaultValue="all" value={view} onValueChange={(v) => setView(v as "all" | "active" | "won" | "lost")}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">جميع الصفقات</TabsTrigger>
                    <TabsTrigger value="active">الصفقات النشطة</TabsTrigger>
                    <TabsTrigger value="won">الصفقات المربوحة</TabsTrigger>
                    <TabsTrigger value="lost">الصفقات المفقودة</TabsTrigger>
                  </TabsList>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <CardTitle>قائمة الصفقات</CardTitle>
                          <CardDescription>إدارة ومتابعة صفقات المبيعات</CardDescription>
                        </div>
                        <DealFilters 
                          onStageChange={setFilterStage}
                          onValueChange={setFilterValue}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <DealsList 
                        view={view} 
                        filterStage={filterStage}
                        filterValue={filterValue}
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

export default DealsManagement;
