
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Mail, Phone, Building, MapPin, Briefcase, FileEdit,
  Calendar, Trash, Bell, MessageSquare, Plus, Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { getLead, deleteLead, getStageColorClass } from '@/services/leads';
import { useLeadTimeline, useLeadRelatedEntities } from '@/hooks/leads/useLeadTimeline';
import LeadComprehensiveTimeline from '@/components/leads/LeadComprehensiveTimeline';
import LeadRelatedEntities from '@/components/leads/LeadRelatedEntities';
import LeadForm from '@/components/leads/LeadForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Lead } from '@/services/leads/types';

const LeadProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Fetch lead details
  const { 
    data: lead, 
    isLoading: leadLoading,
    isError,
    refetch: refetchLead
  } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id!),
    enabled: !!id
  });
  
  // Use our custom hooks for timeline and related entities
  const { 
    activities, 
    tasks, 
    appointments, 
    isLoading: timelineLoading,
    handleAddActivity,
    handleCompleteActivity,
    handleCompleteTask,
    handleDeleteActivity,
    refreshData: refreshTimeline
  } = useLeadTimeline(id || '');
  
  const {
    companies,
    deals,
    invoices,
    tickets,
    subscriptions,
    isLoading: entitiesLoading
  } = useLeadRelatedEntities(id || '');
  
  // Handle lead deletion
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const result = await deleteLead(id);
      if (result) {
        toast.success('تم حذف العميل المحتمل بنجاح');
        setIsDeleteDialogOpen(false);
        navigate('/dashboard/leads');
      } else {
        toast.error('حدث خطأ أثناء حذف العميل المحتمل');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('حدث خطأ أثناء حذف العميل المحتمل');
    }
  };
  
  // Handle lead update
  const handleLeadUpdate = (updatedLead: Lead) => {
    setIsEditDialogOpen(false);
    refetchLead();
    toast.success('تم تحديث بيانات العميل المحتمل بنجاح');
  };
  
  if (isError) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-10">
          <Alert variant="destructive">
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>
              حدث خطأ أثناء تحميل بيانات العميل المحتمل. يرجى المحاولة مرة أخرى لاحقًا.
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/dashboard/leads')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة إلى قائمة العملاء المحتملين
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  if (leadLoading || !lead) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-10">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>جاري تحميل البيانات...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
  const owner = lead.owner || { name: "غير مخصص", initials: "؟" };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/dashboard/leads')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <Badge className={`mr-2 ${getStageColorClass(lead.status || 'جديد')}`}>
                {lead.status || 'جديد'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => {}}
              >
                <Bell className="h-4 w-4 mr-2" />
                متابعة
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <FileEdit className="h-4 w-4 mr-2" />
                تحرير
              </Button>
              <Button 
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                حذف
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lead info card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-lg">
                          {lead.first_name?.charAt(0) || '؟'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      جدولة موعد
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{lead.email || 'غير محدد'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{lead.phone || 'غير محدد'}</p>
                      </div>
                      {lead.company && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{lead.company}</p>
                        </div>
                      )}
                      {lead.position && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{lead.position}</p>
                        </div>
                      )}
                      {lead.country && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{lead.country}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-muted-foreground">المسؤول</span>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{owner.initials}</AvatarFallback>
                          </Avatar>
                          <span>{owner.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-muted-foreground">المصدر</span>
                        <span>{lead.source || 'غير محدد'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-muted-foreground">تاريخ الإنشاء</span>
                        <span>
                          {lead.created_at ? new Date(lead.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">آخر تحديث</span>
                        <span>
                          {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </span>
                      </div>
                    </div>
                    
                    {lead.notes && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-muted-foreground mb-1">ملاحظات</p>
                        <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-auto py-6 flex flex-col">
                      <MessageSquare className="h-5 w-5 mb-1" />
                      <span>إضافة ملاحظة</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-6 flex flex-col">
                      <Calendar className="h-5 w-5 mb-1" />
                      <span>جدولة مهمة</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-6 flex flex-col">
                      <Plus className="h-5 w-5 mb-1" />
                      <span>إنشاء صفقة</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-6 flex flex-col">
                      <FileEdit className="h-5 w-5 mb-1" />
                      <span>إنشاء فاتورة</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Related Entities */}
              <LeadRelatedEntities
                companies={companies}
                deals={deals}
                invoices={invoices}
                tickets={tickets}
                subscriptions={subscriptions}
                isLoading={entitiesLoading}
                onAddCompany={() => {}}
                onAddDeal={() => {}}
                onAddInvoice={() => {}}
                onAddTicket={() => {}}
                onAddSubscription={() => {}}
              />
            </div>
            
            {/* Main Content Area */}
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="timeline">الأنشطة والمتابعات</TabsTrigger>
                      <TabsTrigger value="emails">البريد الإلكتروني</TabsTrigger>
                      <TabsTrigger value="conversations">المحادثات</TabsTrigger>
                      <TabsTrigger value="history">سجل التغييرات</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                
                <CardContent>
                  <TabsContent value="timeline" className="mt-0 pt-0">
                    <LeadComprehensiveTimeline
                      leadId={id || ''}
                      activities={activities}
                      tasks={tasks}
                      appointments={appointments}
                      isLoading={timelineLoading}
                      onAddActivity={handleAddActivity}
                      onCompleteActivity={handleCompleteActivity}
                      onCompleteTask={handleCompleteTask}
                      onDeleteActivity={handleDeleteActivity}
                      onRefresh={refreshTimeline}
                    />
                  </TabsContent>
                  
                  <TabsContent value="emails" className="mt-0">
                    <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                      <div className="text-center">
                        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">لا توجد رسائل بريد إلكتروني</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          لم يتم تسجيل أي رسائل بريد إلكتروني مع هذا العميل المحتمل.
                        </p>
                        <Button>
                          <Mail className="h-4 w-4 mr-2" />
                          إرسال بريد إلكتروني
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="conversations" className="mt-0">
                    <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">لا توجد محادثات</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          لم يتم تسجيل أي محادثات مع هذا العميل المحتمل.
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          بدء محادثة
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-0">
                    <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                      <div className="text-center">
                        <FileEdit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">سجل التغييرات</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          هذه الميزة قيد التطوير حاليًا.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف العميل المحتمل</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>هل أنت متأكد من رغبتك في حذف العميل المحتمل "{fullName}"؟</p>
            <p className="text-sm text-muted-foreground mt-2">
              سيؤدي هذا إلى حذف جميع البيانات المرتبطة بهذا العميل المحتمل. هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تحرير بيانات العميل المحتمل</DialogTitle>
          </DialogHeader>
          <LeadForm
            lead={lead}
            onSubmit={handleLeadUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LeadProfilePage;
