
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AppointmentsManagement = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateAppointment = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveAppointment = () => {
    toast.success("تم حفظ الموعد بنجاح");
    setIsCreating(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المواعيد</h1>
          
          {!isCreating && (
            <button 
              onClick={handleCreateAppointment}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
            >
              إضافة موعد جديد
            </button>
          )}
        </div>

        {isCreating ? (
          <Card>
            <CardHeader>
              <CardTitle>موعد جديد</CardTitle>
              <CardDescription>أدخل تفاصيل الموعد الجديد</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentForm 
                onClose={handleCancelCreate}
                onSubmit={handleSaveAppointment}
                title="موعد جديد"
              />
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="calendar" value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
              <TabsList className="mb-4">
                <TabsTrigger value="calendar">التقويم</TabsTrigger>
                <TabsTrigger value="list">قائمة المواعيد</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>تقويم المواعيد</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AppointmentCalendar />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="list">
                <Card>
                  <CardHeader>
                    <CardTitle>قائمة المواعيد</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AppointmentsList />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsManagement;
