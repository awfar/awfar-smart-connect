
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { toast } from "sonner";
import { CalendarDays, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreakpoints } from "@/hooks/use-mobile";
import { createAppointment } from "@/services/appointments/appointmentsCrud";

const AppointmentsManagement = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isMobile } = useBreakpoints();
  
  const handleCreateAppointment = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveAppointment = async (appointmentData: any) => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!appointmentData.title) {
        toast.error("عنوان الموعد مطلوب");
        setIsSubmitting(false);
        return Promise.reject(new Error("Title is required"));
      }
      
      if (!appointmentData.start_time || !appointmentData.end_time) {
        toast.error("تاريخ البداية والنهاية مطلوبان");
        setIsSubmitting(false);
        return Promise.reject(new Error("Start and end times are required"));
      }
      
      console.log("Creating appointment with data:", appointmentData);
      
      const result = await createAppointment(appointmentData);
      
      if (result) {
        toast.success("تم حفظ الموعد بنجاح");
        setIsCreating(false);
        setRefreshKey(prev => prev + 1);
        return Promise.resolve();
      } else {
        throw new Error("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("فشل في حفظ الموعد");
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المواعيد</h1>
        
        {!isCreating && (
          <Button 
            onClick={handleCreateAppointment}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة موعد جديد
          </Button>
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
              onCancel={handleCancelCreate}
              onSubmit={handleSaveAppointment}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">كل المواعيد</TabsTrigger>
                <TabsTrigger value="my">مواعيدي</TabsTrigger>
                <TabsTrigger value="team">مواعيد الفريق</TabsTrigger>
                <TabsTrigger value="upcoming">القادمة والسابقة</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={view === "calendar" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setView("calendar")}
                  className="gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  {!isMobile && "التقويم"}
                </Button>
                <Button 
                  variant={view === "list" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setView("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  {!isMobile && "القائمة"}
                </Button>
              </div>
            </div>
            
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {view === "calendar" ? "تقويم المواعيد" : "قائمة المواعيد"}
                  </CardTitle>
                  <CardDescription>
                    جميع المواعيد في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {view === "calendar" ? (
                    <AppointmentCalendar filter="all" key={refreshKey} />
                  ) : (
                    <AppointmentsList filter="all" key={refreshKey} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="my">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {view === "calendar" ? "تقويم المواعيد" : "قائمة المواعيد"}
                  </CardTitle>
                  <CardDescription>
                    المواعيد المخصصة لك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {view === "calendar" ? (
                    <AppointmentCalendar filter="my" key={refreshKey} />
                  ) : (
                    <AppointmentsList filter="my" key={refreshKey} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {view === "calendar" ? "تقويم المواعيد" : "قائمة المواعيد"}
                  </CardTitle>
                  <CardDescription>
                    مواعيد فريق العمل
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {view === "calendar" ? (
                    <AppointmentCalendar filter="team" key={refreshKey} />
                  ) : (
                    <AppointmentsList filter="team" key={refreshKey} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {view === "calendar" ? "تقويم المواعيد" : "قائمة المواعيد"}
                  </CardTitle>
                  <CardDescription>
                    المواعيد القادمة والسابقة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {view === "calendar" ? (
                    <AppointmentCalendar filter="upcoming" key={refreshKey} />
                  ) : (
                    <AppointmentsList filter="upcoming" key={refreshKey} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AppointmentsManagement;
