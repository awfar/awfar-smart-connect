
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DealsList from "@/components/deals/DealsList";
import DealForm from "@/components/deals/DealForm";
import DealFilters from "@/components/deals/DealFilters";
import { getDeals, Deal } from "@/services/dealsService";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const DealsManagement = () => {
  const [view, setView] = useState<"all" | "active" | "won" | "lost">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("all");
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  
  const { data: allDeals, isLoading, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: () => getDeals(),
  });

  useEffect(() => {
    if (allDeals) {
      // فلترة بناءً على العرض (الكل، النشطة، المربوحة، المفقودة)
      let dealsToShow = [...allDeals];
      
      if (view === "active") {
        dealsToShow = allDeals.filter(deal => deal.status === "active");
      } else if (view === "won") {
        dealsToShow = allDeals.filter(deal => deal.status === "won");
      } else if (view === "lost") {
        dealsToShow = allDeals.filter(deal => deal.status === "lost");
      }

      // تطبيق فلترة المرحلة والقيمة إن وجدت
      if (filterStage !== "all" || filterValue !== "all") {
        applyFilters(dealsToShow);
      } else {
        setFilteredDeals(dealsToShow);
      }
    }
  }, [allDeals, view, filterStage, filterValue]);

  const applyFilters = async (deals: Deal[]) => {
    let filtered = [...deals];
    
    // فلترة حسب المرحلة
    if (filterStage !== "all") {
      filtered = filtered.filter(deal => deal.stage === filterStage);
    }
    
    // فلترة حسب القيمة
    if (filterValue !== "all") {
      const value = filterValue === "low" 
        ? { maxValue: 10000 }
        : filterValue === "medium"
        ? { minValue: 10000, maxValue: 50000 }
        : { minValue: 50000 };
        
      if (filterValue === "low") {
        filtered = filtered.filter(deal => (deal.value || 0) < 10000);
      } else if (filterValue === "medium") {
        filtered = filtered.filter(deal => (deal.value || 0) >= 10000 && (deal.value || 0) <= 50000);
      } else if (filterValue === "high") {
        filtered = filtered.filter(deal => (deal.value || 0) > 50000);
      }
    }
    
    setFilteredDeals(filtered);
  };

  const handleCreateDeal = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveDeal = () => {
    refetch(); // إعادة تحميل البيانات بعد الحفظ
    setIsCreating(false);
  };

  const handleViewChange = (newView: "all" | "active" | "won" | "lost") => {
    setView(newView);
  };

  const handleStageChange = (value: string) => {
    setFilterStage(value);
  };

  const handleValueChange = (value: string) => {
    setFilterValue(value);
  };

  return (
    <DashboardLayout>
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
            <Tabs defaultValue="all" value={view} onValueChange={(v) => handleViewChange(v as any)}>
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
                      onStageChange={handleStageChange}
                      onValueChange={handleValueChange}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-10">جاري تحميل البيانات...</div>
                  ) : (
                    <DealsList 
                      view={view} 
                      filterStage={filterStage}
                      filterValue={filterValue}
                      deals={filteredDeals}
                      onRefresh={refetch}
                    />
                  )}
                </CardContent>
              </Card>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DealsManagement;
