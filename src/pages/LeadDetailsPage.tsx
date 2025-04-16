import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLead, updateLead, deleteLead, Lead, getLeadActivities, LeadActivity, completeLeadActivity } from '@/services/leads';
import { getTasks, Task, updateTask, deleteTask } from '@/services/tasks';
import { getAppointments, Appointment, updateAppointment, deleteAppointment } from '@/services/appointments';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, Edit, Trash, Calendar, Mail, Phone, MapPin, Building } from 'lucide-react';
import { getStageColorClass } from '@/services/leads/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import LeadForm from '@/components/leads/LeadForm';
import ActivityForm from '@/components/leads/ActivityForm';
import TaskForm from '@/components/leads/TaskForm';
import AppointmentForm from '@/components/leads/AppointmentForm';
import LeadTimeline from '@/components/leads/LeadTimeline';
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';

const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [editType, setEditType] = useState<string | null>(null);

  const { 
    data: lead,
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id as string),
    enabled: !!id,
  });
  
  const {
    data: activities = [],
    isLoading: loadingActivities,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['leadActivities', id],
    queryFn: () => getLeadActivities(id as string),
    enabled: !!id
  });
  
  const {
    data: tasks = [],
    isLoading: loadingTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['leadTasks', id],
    queryFn: () => getTasks({ lead_id: id }),
    enabled: !!id
  });
  
  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ['leadAppointments', id],
    queryFn: () => getAppointments({ client_id: id }),
    enabled: !!id
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      toast.success('تم حذف العميل المحتمل بنجاح');
      navigate('/dashboard/leads');
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast.error('فشل في حذف العميل المحتمل');
    },
  });

  const completeActivityMutation = useMutation({
    mutationFn: completeLeadActivity,
    onSuccess: () => {
      refetchActivities();
      toast.success('تم إكمال النشاط بنجاح');
    },
    onError: (error) => {
      console.error('Error completing activity:', error);
      toast.error('فشل في إكمال النشاط');
    }
  });

  const taskCompletionMutation = useMutation({
    mutationFn: (taskId: string) => updateTask(taskId, { status: 'completed' }),
    onSuccess: () => {
      refetchTasks();
      toast.success('تم إكمال المهمة بنجاح');
    },
    onError: (error) => {
      console.error('Error completing task:', error);
      toast.error('فشل في إكمال المهمة');
    }
  });

  const appointmentCompletionMutation = useMutation({
    mutationFn: (appointmentId: string) => updateAppointment(appointmentId, { status: 'completed' }),
    onSuccess: () => {
      refetchAppointments();
      toast.success('تم إكمال الموعد بنجاح');
    },
    onError: (error) => {
      console.error('Error completing appointment:', error);
      toast.error('فشل في إكمال الموعد');
    }
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (activityId: string) => {
      return fetch(`https://fpbuirtdlxwwfghlmqmi.supabase.co/rest/v1/lead_activities?id=eq.${activityId}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwYnVpcnRkbHh3d2ZnaGxtcW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTc1MjAsImV4cCI6MjA2MDAzMzUyMH0.t15pPlefwCN9LhEzZOJXpPqXc5RE9oBhEVlZiyuNVgQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwYnVpcnRkbHh3d2ZnaGxtcW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTc1MjAsImV4cCI6MjA2MDAzMzUyMH0.t15pPlefwCN9LhEzZOJXpPqXc5RE9oBhEVlZiyuNVgQ'
        }
      });
    },
    onSuccess: () => {
      refetchActivities();
      toast.success('تم حذف النشاط بنجاح');
    },
    onError: (error) => {
      console.error('Error deleting activity:', error);
      toast.error('فشل في حذف النشاط');
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      refetchTasks();
      toast.success('تم حذف المهمة بنجاح');
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('فشل في حذف المهمة');
    }
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      refetchAppointments();
      toast.success('تم حذف الموعد بنجاح');
    },
    onError: (error) => {
      console.error('Error deleting appointment:', error);
      toast.error('فشل في حذف الموعد');
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mr-2">جاري تحميل البيانات...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (isError || !lead) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold text-red-500">حدث خطأ أثناء تحميل البيانات</h2>
          <p className="text-muted-foreground mb-4">لم يتم العثور على العميل المحتمل أو حدث خطأ أثناء تحميل بياناته</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/dashboard/leads')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة إلى قائمة العملاء المحتملين
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";

  const handleEditSuccess = (updatedLead?: Lead) => {
    setIsEditDialogOpen(false);
    setItemToEdit(null);
    setEditType(null);
    if (updatedLead) {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      toast.success('تم تحديث بيانات العميل المحتمل بنجاح');
    }
  };
  
  const handleActivitySuccess = () => {
    setIsActivityDialogOpen(false);
    setItemToEdit(null);
    setEditType(null);
    refetchActivities();
    toast.success('تم إضافة النشاط بنجاح');
  };
  
  const handleTaskSuccess = () => {
    setIsTaskDialogOpen(false);
    setItemToEdit(null);
    setEditType(null);
    refetchTasks();
    toast.success('تم إضافة المهمة بنجاح');
  };
  
  const handleAppointmentSuccess = () => {
    setIsAppointmentDialogOpen(false);
    setItemToEdit(null);
    setEditType(null);
    refetchAppointments();
    toast.success('تم إضافة الموعد بنجاح');
  };

  const handleDeleteLead = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  const handleTimelineEdit = (type: string, item: any) => {
    setItemToEdit(item);
    setEditType(type);
    
    if (type === 'activity' || type === 'note') {
      setIsActivityDialogOpen(true);
    } else if (type === 'task') {
      setIsTaskDialogOpen(true);
    } else if (type === 'appointment') {
      setIsAppointmentDialogOpen(true);
    }
  };

  const handleTimelineDelete = (type: string, itemId: string) => {
    if (type === 'activity' || type === 'note') {
      deleteActivityMutation.mutate(itemId);
    } else if (type === 'task') {
      deleteTaskMutation.mutate(itemId);
    } else if (type === 'appointment') {
      deleteAppointmentMutation.mutate(itemId);
    }
  };

  const handleTimelineComplete = (type: string, itemId: string) => {
    if (type === 'activity' || type === 'note') {
      completeActivityMutation.mutate(itemId);
    } else if (type === 'task') {
      taskCompletionMutation.mutate(itemId);
    } else if (type === 'appointment') {
      appointmentCompletionMutation.mutate(itemId);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy/MM/dd', { locale: ar });
    } catch (e) {
      return 'تاريخ غير صالح';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard/leads')}
            >
              <ArrowLeft className="h-4 w-4" />
              العودة
            </Button>
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <Badge className={getStageColorClass(lead.status || lead.stage || 'جديد')}>
              {lead.status || lead.stage || 'جديد'}
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={() => {
                setItemToEdit(null);
                setEditType(null);
                setIsActivityDialogOpen(true);
              }}
            >
              إضافة نشاط
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setItemToEdit(null);
                setEditType(null);
                setIsTaskDialogOpen(true);
              }}
            >
              إضافة مهمة
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setItemToEdit(null);
                setEditType(null);
                setIsAppointmentDialogOpen(true);
              }}
            >
              إضافة موعد
            </Button>
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              تعديل
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              حذف
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>معلومات العميل المحتمل</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="timeline">الخط الزمني</TabsTrigger>
                    <TabsTrigger value="details">التفاصيل الشخصية</TabsTrigger>
                    <TabsTrigger value="company">معلومات الشركة</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="timeline">
                    <LeadTimeline 
                      activities={activities}
                      tasks={tasks}
                      appointments={appointments}
                      isLoading={loadingActivities || loadingTasks || loadingAppointments}
                      onEdit={handleTimelineEdit}
                      onDelete={handleTimelineDelete}
                      onComplete={handleTimelineComplete}
                    />
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">الاسم الأول</p>
                        <p className="font-medium">{lead.first_name || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">اسم العائلة</p>
                        <p className="font-medium">{lead.last_name || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">البريد الإلكتروني</p>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{lead.email || '-'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">رقم الهاتف</p>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{lead.phone || '-'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">الدولة</p>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{lead.country || '-'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">المسؤول</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={lead.owner?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{lead.owner?.initials || "؟"}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{lead.owner?.name || 'غير مخصص'}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="company" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">اسم الشركة</p>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{lead.company || '-'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">المنصب</p>
                        <p className="font-medium">{lead.position || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">القطاع</p>
                        <p className="font-medium">{lead.industry || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">المصدر</p>
                        <p className="font-medium">{lead.source || '-'}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-muted-foreground text-sm">ملاحظات</p>
                        <p className="whitespace-pre-wrap">{lead.notes || 'لا توجد ملاحظات'}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>ملخص العميل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-2xl">
                        {lead.first_name?.[0] || ''}
                        {lead.last_name?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">الأنشطة</p>
                      <p className="text-xl font-bold">{activities.length || 0}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">المهام</p>
                      <p className="text-xl font-bold">{tasks.length || 0}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">المواعيد</p>
                      <p className="text-xl font-bold">{appointments.length || 0}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">معلومات التواصل</h4>
                    {lead.email && (
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${lead.email}`} className="text-sm hover:underline">{lead.email}</a>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${lead.phone}`} className="text-sm hover:underline">{lead.phone}</a>
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{lead.company}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">معلومات التواريخ</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                      <span>{formatDate(lead.created_at)}</span>
                      <span className="text-muted-foreground">آخر تحديث:</span>
                      <span>{formatDate(lead.updated_at)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">العمليات السريعة</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setItemToEdit(null);
                          setEditType(null);
                          setIsActivityDialogOpen(true);
                        }}
                      >
                        إضافة نشاط
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setItemToEdit(null);
                          setEditType(null);
                          setIsTaskDialogOpen(true);
                        }}
                      >
                        إضافة مهمة
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setItemToEdit(null);
                          setEditType(null);
                          setIsAppointmentDialogOpen(true);
                        }}
                      >
                        إضافة موعد
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsEditDialogOpen(true)}
                      >
                        تعديل البيانات
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>الأحداث القادمة</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAppointments ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="mr-2 text-sm">جاري التحميل...</span>
                  </div>
                ) : (
                  <div>
                    {appointments
                      .filter(app => new Date(app.start_time) > new Date() && app.status !== 'cancelled')
                      .slice(0, 3)
                      .map(appointment => (
                        <div key={appointment.id} className="border-b pb-3 mb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">{appointment.title}</h4>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{formatDate(appointment.start_time)}</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-7"
                              onClick={() => handleTimelineComplete('appointment', appointment.id)}
                            >
                              إكمال
                            </Button>
                          </div>
                        </div>
                      ))}
                    
                    {(!appointments.length || !appointments.filter(app => new Date(app.start_time) > new Date() && app.status !== 'cancelled').length) && (
                      <p className="text-center text-sm text-muted-foreground py-2">
                        لا توجد مواعيد قادمة
                      </p>
                    )}
                    
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => {
                      setItemToEdit(null);
                      setEditType(null);
                      setIsAppointmentDialogOpen(true);
                    }}>
                      إضافة موعد جديد
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">تعديل بيانات العميل المحتمل</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <MobileOptimizedContainer>
              <LeadForm 
                lead={lead}
                onClose={() => setIsEditDialogOpen(false)}
                onSuccess={handleEditSuccess}
              />
            </MobileOptimizedContainer>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={isActivityDialogOpen} 
        onOpenChange={(open) => {
          setIsActivityDialogOpen(open);
          if (!open) {
            setItemToEdit(null);
            setEditType(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{itemToEdit ? 'تعديل النشاط' : 'إضافة نشاط جديد'}</DialogTitle>
          </DialogHeader>
          <ActivityForm 
            leadId={lead.id} 
            activity={editType === 'activity' || editType === 'note' ? itemToEdit : undefined}
            onSuccess={handleActivitySuccess}
            onClose={() => {
              setIsActivityDialogOpen(false);
              setItemToEdit(null);
              setEditType(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={isTaskDialogOpen} 
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) {
            setItemToEdit(null);
            setEditType(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{itemToEdit ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}</DialogTitle>
          </DialogHeader>
          <TaskForm 
            leadId={lead.id} 
            task={editType === 'task' ? itemToEdit : undefined}
            onSuccess={handleTaskSuccess}
            onClose={() => {
              setIsTaskDialogOpen(false);
              setItemToEdit(null);
              setEditType(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={isAppointmentDialogOpen} 
        onOpenChange={(open) => {
          setIsAppointmentDialogOpen(open);
          if (!open) {
            setItemToEdit(null);
            setEditType(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{itemToEdit ? 'تعديل الموعد' : 'إضافة موعد جديد'}</DialogTitle>
          </DialogHeader>
          <AppointmentForm 
            leadId={lead.id} 
            appointment={editType === 'appointment' ? itemToEdit : undefined}
            onSuccess={handleAppointmentSuccess}
            onClose={() => {
              setIsAppointmentDialogOpen(false);
              setItemToEdit(null);
              setEditType(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف العميل المحتمل</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا العميل المحتمل؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteLead} 
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default LeadDetailsPage;
