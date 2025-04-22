import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, FileText, MessageCircle, Phone, Plus } from 'lucide-react';
import { useLeadProfile } from '@/hooks/useLeadProfile';
import LeadProfileHeader from '@/components/leads/profile/LeadProfileHeader';
import LeadProfileInfo from '@/components/leads/profile/LeadProfileInfo';
import LeadProfileSidebar from '@/components/leads/profile/LeadProfileSidebar';
import LeadActivityTimeline from '@/components/leads/profile/LeadActivityTimeline';
import LeadRelatedRecords from '@/components/leads/profile/LeadRelatedRecords';
import DeleteLeadDialog from '@/components/leads/dialogs/DeleteLeadDialog';
import EditLeadDialog from '@/components/leads/dialogs/EditLeadDialog';
import ActivityFormDialog from '@/components/leads/dialogs/ActivityFormDialog';
import TaskFormDialog from '@/components/leads/dialogs/TaskFormDialog';
import AppointmentFormDialog from '@/components/leads/dialogs/AppointmentFormDialog';
import { useToast } from '@/components/ui/use-toast';
import { Lead as ServiceLead } from '@/services/leads/types';
import { useBreakpoints } from '@/hooks/use-mobile';

const LeadProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  
  const { isMobile } = useBreakpoints();

  const {
    lead,
    isLoading,
    error,
    activities,
    tasks,
    appointments,
    deals,
    isActivitiesLoading,
    fetchLead,
    fetchActivities,
    fetchTasks,
    fetchAppointments,
    deleteLead,
    updateLead,
  } = useLeadProfile(id);

  useEffect(() => {
    if (id) {
      fetchLead();
      fetchActivities();
      fetchTasks();
      fetchAppointments();
    }
  }, [id, fetchLead, fetchActivities, fetchTasks, fetchAppointments]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded w-full"></div>
          <div className="h-64 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">خطأ في تحميل بيانات العميل المحتمل</h2>
        <p className="mb-4">{error || 'لم يتم العثور على العميل المحتمل'}</p>
        <Button onClick={() => navigate('/dashboard/leads')}>
          <ArrowLeft className="ml-2 h-4 w-4" /> العودة إلى قائمة العملاء المحتملين
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteLead(lead.id);
      toast({
        title: "تم حذف العميل المحتمل بنجاح",
        variant: "default",
      });
      navigate('/dashboard/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "حدث خطأ أثناء حذف العميل المحتمل",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = (updatedLead: ServiceLead) => {
    updateLead(updatedLead as ServiceLead);
  };

  const handleAddActivitySuccess = () => {
    fetchActivities();
  };

  const handleAddTaskSuccess = () => {
    fetchTasks();
  };

  const handleAddAppointmentSuccess = () => {
    fetchAppointments();
  };

  const handleActivityClick = (type: 'note' | 'call' | 'email' | 'meeting' | 'whatsapp') => {
    setActivityType(type);
    setShowAddActivityDialog(true);
  };

  const leadWithSafeOwner = {
    ...lead,
    owner: lead.owner ? {
      ...lead.owner,
      id: lead.owner.id || ''
    } : undefined
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <LeadProfileHeader 
          lead={leadWithSafeOwner}
          onBack={() => navigate('/dashboard/leads')}
          onEdit={() => setShowEditDialog(true)}
          onDelete={() => setShowDeleteDialog(true)}
        />

        <div className={`mt-6 space-y-6 ${isMobile ? 'block' : 'grid grid-cols-3 gap-6'}`}>
          <Card className={isMobile ? 'mb-6' : 'col-span-2'}>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full sm:w-auto justify-center"
                  onClick={() => handleActivityClick('note')}
                >
                  <MessageCircle className="ml-1.5 h-4 w-4" />
                  إضافة ملاحظة
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full sm:w-auto justify-center"
                  onClick={() => handleActivityClick('call')}
                >
                  <Phone className="ml-1.5 h-4 w-4" />
                  تسجيل مكالمة
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full sm:w-auto justify-center"
                  onClick={() => setShowAddTaskDialog(true)}
                >
                  <FileText className="ml-1.5 h-4 w-4" />
                  إضافة مهمة
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full sm:w-auto justify-center"
                  onClick={() => setShowAddAppointmentDialog(true)}
                >
                  <Calendar className="ml-1.5 h-4 w-4" />
                  جدولة موعد
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className={isMobile ? 'space-y-6' : 'col-span-2 space-y-6'}>
            <Tabs defaultValue="details" dir="rtl" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="details">التفاصيل</TabsTrigger>
                <TabsTrigger value="activity">النشاطات</TabsTrigger>
                <TabsTrigger value="related">السجلات المرتبطة</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <LeadProfileInfo lead={leadWithSafeOwner} />
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <LeadActivityTimeline 
                  activities={activities}
                  isLoading={isActivitiesLoading}
                  onAddActivity={() => setShowAddActivityDialog(true)}
                />
              </TabsContent>

              <TabsContent value="related" className="mt-4">
                <LeadRelatedRecords
                  leadId={lead.id}
                  tasks={tasks}
                  appointments={appointments}
                  deals={deals || []}
                />
              </TabsContent>
            </Tabs>
          </div>

          {!isMobile && (
            <div className="col-span-1">
              <LeadProfileSidebar lead={leadWithSafeOwner} />
            </div>
          )}

          {isMobile && (
            <Card>
              <CardContent className="p-4">
                <LeadProfileSidebar lead={leadWithSafeOwner} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DeleteLeadDialog 
        isOpen={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        leadName={`${lead.first_name} ${lead.last_name}`}
      />

      <EditLeadDialog
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        lead={leadWithSafeOwner as ServiceLead}
        onSuccess={handleUpdate}
      />

      <ActivityFormDialog
        open={showAddActivityDialog}
        onClose={() => setShowAddActivityDialog(false)}
        leadId={lead.id}
        activityType={activityType}
        onSuccess={handleAddActivitySuccess}
      />

      <TaskFormDialog
        open={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
        leadId={lead.id}
        onSuccess={handleAddTaskSuccess}
      />

      <AppointmentFormDialog
        open={showAddAppointmentDialog}
        onClose={() => setShowAddAppointmentDialog(false)}
        leadId={lead.id}
        onSuccess={handleAddAppointmentSuccess}
      />
    </div>
  );
};

export default LeadProfilePage;
