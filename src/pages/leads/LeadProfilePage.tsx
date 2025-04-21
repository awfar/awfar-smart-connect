
import React from 'react';
import { useLeadProfile } from '@/hooks/useLeadProfile';
import LeadProfileHeader from '@/components/leads/profile/LeadProfileHeader';
import LeadProfileInfo from '@/components/leads/profile/LeadProfileInfo';
import LeadActivityTimeline from '@/components/leads/profile/LeadActivityTimeline';
import LeadRelatedRecords from '@/components/leads/profile/LeadRelatedRecords';
import LeadProfileSidebar from '@/components/leads/profile/LeadProfileSidebar';
import { Loader2Icon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EditLeadDialog from '@/components/leads/dialogs/EditLeadDialog';
import ActivityFormDialog from '@/components/leads/dialogs/ActivityFormDialog';
import TaskFormDialog from '@/components/leads/dialogs/TaskFormDialog';
import AppointmentFormDialog from '@/components/leads/dialogs/AppointmentFormDialog';

const LeadProfilePage: React.FC = () => {
  const {
    lead,
    activities,
    appointments,
    tasks,
    isLoadingLead,
    isLoadingActivities,
    isLoadingAppointments,
    isLoadingTasks,
    leadError,
    isEditDialogOpen,
    isActivityDialogOpen,
    isTaskDialogOpen,
    isAppointmentDialogOpen,
    activityType,
    setIsEditDialogOpen,
    setIsActivityDialogOpen,
    setIsTaskDialogOpen,
    setIsAppointmentDialogOpen,
    setActivityType,
    handleEditLead,
    handleAddActivity,
    handleCompleteActivity,
    handleDeleteActivity,
    handleBackToLeads,
    refetchAllData
  } = useLeadProfile();

  if (isLoadingLead) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2Icon className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل بيانات العميل...</p>
      </div>
    );
  }

  if (leadError || !lead) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">حدث خطأ أثناء تحميل البيانات</h1>
        <p className="text-muted-foreground mb-4">لم نتمكن من العثور على بيانات العميل المطلوب</p>
        <Button onClick={handleBackToLeads}>الرجوع إلى قائمة العملاء</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <LeadProfileHeader 
        lead={lead} 
        onEdit={() => setIsEditDialogOpen(true)}
        onBackToLeads={handleBackToLeads}
        onAddActivity={() => {
          setActivityType('note');
          setIsActivityDialogOpen(true);
        }}
        onAddTask={() => setIsTaskDialogOpen(true)}
        onAddAppointment={() => setIsAppointmentDialogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="timeline">سجل الأنشطة</TabsTrigger>
              <TabsTrigger value="related">السجلات المرتبطة</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <Card className="p-6">
                <LeadProfileInfo lead={lead} />
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline">
              <LeadActivityTimeline 
                activities={activities} 
                isLoading={isLoadingActivities} 
                onComplete={handleCompleteActivity}
                onDelete={handleDeleteActivity}
                onAddActivity={() => setIsActivityDialogOpen(true)}
              />
            </TabsContent>
            
            <TabsContent value="related">
              <LeadRelatedRecords 
                lead={lead}
                tasks={tasks}
                appointments={appointments}
                isLoadingTasks={isLoadingTasks}
                isLoadingAppointments={isLoadingAppointments}
                onAddTask={() => setIsTaskDialogOpen(true)}
                onAddAppointment={() => setIsAppointmentDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <LeadProfileSidebar 
            lead={lead} 
            onAddActivity={(type) => {
              setActivityType(type);
              setIsActivityDialogOpen(true);
            }}
            onAddTask={() => setIsTaskDialogOpen(true)}
            onAddAppointment={() => setIsAppointmentDialogOpen(true)}
          />
        </div>
      </div>

      {/* Dialogs */}
      <EditLeadDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        lead={lead}
        onSuccess={handleEditLead}
      />

      <ActivityFormDialog 
        isOpen={isActivityDialogOpen}
        onOpenChange={setIsActivityDialogOpen}
        leadId={lead.id}
        activityType={activityType}
        onSuccess={(activity) => {
          handleAddActivity(activity as any);
          refetchAllData();
        }}
      />

      <TaskFormDialog 
        isOpen={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        leadId={lead.id}
        onSuccess={refetchAllData}
      />

      <AppointmentFormDialog 
        isOpen={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        leadId={lead.id}
        onSuccess={refetchAllData}
      />
    </div>
  );
};

export default LeadProfilePage;
