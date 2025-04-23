
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Phone, FileText, Calendar } from 'lucide-react';
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
import { ArrowLeft } from 'lucide-react';

const LeadProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State variables
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddAppointmentDialog, setShowAddAppointmentDialog] = useState(false);
  const [activityType, setActivityType] = useState<'note' | 'call' | 'email' | 'meeting' | 'whatsapp'>('note');
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
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">خطأ في تحميل بيانات العميل المحتمل</h2>
        <p className="mb-4">{error || 'لم يتم العثور على العميل المحتمل'}</p>
        <Button onClick={() => navigate('/dashboard/leads')}>
          <ArrowLeft className="ml-2 h-4 w-4" /> العودة
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-4 max-w-7xl mx-auto">
        <LeadProfileHeader 
          lead={leadWithSafeOwner}
          onBack={() => navigate('/dashboard/leads')}
          onEdit={() => setShowEditDialog(true)}
          onDelete={() => setShowDeleteDialog(true)}
        />

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full sm:w-auto justify-center h-9"
            onClick={() => {
              setActivityType('note');
              setShowAddActivityDialog(true);
            }}
          >
            <MessageCircle className="h-4 w-4 ml-1.5" />
            <span className="text-sm">إضافة ملاحظة</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm" 
            className="w-full sm:w-auto justify-center h-9"
            onClick={() => setShowAddTaskDialog(true)}
          >
            <FileText className="h-4 w-4 ml-1.5" />
            <span className="text-sm">مهمة جديدة</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="w-full sm:w-auto justify-center h-9"
            onClick={() => {
              setActivityType('call');
              setShowAddActivityDialog(true);
            }}
          >
            <Phone className="h-4 w-4 ml-1.5" />
            <span className="text-sm">تسجيل مكالمة</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="w-full sm:w-auto justify-center h-9"
            onClick={() => setShowAddAppointmentDialog(true)}
          >
            <Calendar className="h-4 w-4 ml-1.5" />
            <span className="text-sm">جدولة موعد</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3 h-12">
              <TabsTrigger value="details" className="text-sm">التفاصيل</TabsTrigger>
              <TabsTrigger value="activity" className="text-sm">الأنشطة</TabsTrigger>
              <TabsTrigger value="related" className="text-sm">السجلات</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="details" className="m-0">
                <LeadProfileInfo lead={leadWithSafeOwner} />
              </TabsContent>

              <TabsContent value="activity" className="m-0">
                <LeadActivityTimeline 
                  activities={activities}
                  isLoading={isActivitiesLoading}
                  onAddActivity={() => setShowAddActivityDialog(true)}
                />
              </TabsContent>

              <TabsContent value="related" className="m-0">
                <LeadRelatedRecords
                  leadId={lead.id}
                  tasks={tasks}
                  appointments={appointments}
                  deals={deals || []}
                />
              </TabsContent>
            </div>
          </Tabs>

          {isMobile && (
            <LeadProfileSidebar lead={leadWithSafeOwner} />
          )}
        </div>
      </div>

      {/* Dialogs */}
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
