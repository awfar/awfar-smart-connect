
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import TasksList from "@/components/tasks/TasksList";
import TaskForm from "@/components/tasks/TaskForm";
import TaskFilters from "@/components/tasks/TaskFilters";
import { toast } from "sonner";

const TasksManagement = () => {
  const [view, setView] = useState<"all" | "myTasks" | "team">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  
  const handleCreateTask = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveTask = () => {
    toast.success("تم حفظ المهمة بنجاح");
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
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المهام</h1>
              
              {!isCreating && (
                <button 
                  onClick={handleCreateTask}
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
                >
                  إضافة مهمة جديدة
                </button>
              )}
            </div>

            {isCreating ? (
              <Card>
                <CardHeader>
                  <CardTitle>مهمة جديدة</CardTitle>
                  <CardDescription>أدخل تفاصيل المهمة الجديدة</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskForm 
                    onCancel={handleCancelCreate}
                    onSave={handleSaveTask}
                  />
                </CardContent>
              </Card>
            ) : (
              <>
                <Tabs defaultValue="all" value={view} onValueChange={(v) => setView(v as "all" | "myTasks" | "team")}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">جميع المهام</TabsTrigger>
                    <TabsTrigger value="myTasks">مهامي</TabsTrigger>
                    <TabsTrigger value="team">مهام الفريق</TabsTrigger>
                  </TabsList>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <CardTitle>قائمة المهام</CardTitle>
                          <CardDescription>إدارة وتتبع المهام والمواعيد النهائية</CardDescription>
                        </div>
                        <TaskFilters 
                          onStatusChange={setFilterStatus}
                          onPriorityChange={setFilterPriority}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TasksList 
                        view={view} 
                        filterStatus={filterStatus}
                        filterPriority={filterPriority}
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

export default TasksManagement;
