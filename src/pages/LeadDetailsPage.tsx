
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLead, updateLead, deleteLead, Lead, getLeadActivities, LeadActivity, completeLeadActivity, deleteLeadActivity } from '@/services/leads';
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
import { 
  Loader2, ArrowLeft, Edit, Trash, Calendar, Mail, Phone, 
  MapPin, Building, Clock, Check, MessageSquare, FileText, 
  TicketIcon, Users, ChevronRight, Globe, Briefcase
} from 'lucide-react';
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
import { Link } from 'react-router-dom';

const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [editType, setEditType] = useState<string | null>(null);

  // Log view activity when the component mounts
  useEffect(() => {
    if (id) {
      // Log that the lead was viewed
      const logViewActivity = async () => {
        try {
          await addLeadActivity({
            lead_id: id,
            type: 'note',
            description: 'تم عرض صفحة العميل المحتمل'
          });
        } catch (error) {
          console.error("Error logging view activity:", error);
        }
      };
      
      logViewActivity();
    }
  }, [id]);

  // Fetch lead data
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
  
  // Fetch related activities
  const {
    data: activities = [],
    isLoading: loadingActivities,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['leadActivities', id],
    queryFn: () => getLeadActivities(id as string),
    enabled: !!id
  });
  
  // Fetch related tasks
  const {
    data: tasks = [],
    isLoading: loadingTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['leadTasks', id],
    queryFn: () => getTasks({ lead_id: id }),
    enabled: !!id
  });
  
  // Fetch related appointments
  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ['leadAppointments', id],
    queryFn: () => getAppointments({ client_id: id }),
    enabled: !!id
  });

  // Delete lead mutation
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

  // Complete activity mutation
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

  // Update task status mutation
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

  // Update appointment status mutation
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

  // Delete activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: deleteLeadActivity,
    onSuccess: () => {
      refetchActivities();
      toast.success('تم حذف النشاط بنجاح');
    },
    onError: (error) => {
      console.error('Error deleting activity:', error);
      toast.error('فشل في حذف النشاط');
    }
  });

  // Delete task mutation
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

  // Delete appointment mutation
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

  // Update lead status mutation
  const updateLeadStatusMutation = useMutation({
    mutationFn: (newStatus: string) => {
      if (!lead) throw new Error("Lead not found");
      return updateLead({ ...lead, status: newStatus });
    },
    onSuccess: () => {
      refetch();
      toast.success('تم تحديث حالة العميل المحتمل بنجاح');
    },
    onError: (error) => {
      console.error('Error updating lead status:', error);
      toast.error('فشل في تحديث حالة العميل المحتمل');
    }
  });

  // Function to add lead activity
  const addLeadActivity = async (activityData: Partial<LeadActivity>) => {
    try {
      // Import dynamically to avoid circular dependencies
      const { addLeadActivity } = await import('@/services/leads/leadActivities');
      const result = await addLeadActivity(activityData);
      refetchActivities();
      return result;
    } catch (error) {
      console.error("Error adding activity:", error);
      throw error;
    }
  };

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

  const handleStatusChange = (newStatus: string) => {
    updateLeadStatusMutation.mutate(newStatus);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy/MM/dd', { locale: ar });
    } catch (e) {
      return 'تاريخ غير صالح';
    }
  };

  // Combine all timeline items
  const allTimelineItems = [
    ...activities.map(activity => ({
      ...activity,
      itemType: 'activity',
      timestamp: activity.created_at
    })),
    ...tasks.map(task => ({
      ...task,
      itemType: 'task',
      timestamp: task.created_at || ''
    })),
    ...appointments.map(appointment => ({
      ...appointment,
      itemType: 'appointment',
      timestamp: appointment.created_at || ''
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return (
    <DashboardLayout>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b pb-2 mb-4">
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
            <div className="flex items-center">
              <Select 
                defaultValue={lead.status || lead.stage || 'جديد'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="تغيير الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="جديد">جديد</SelectItem>
                  <SelectItem value="مؤهل">مؤهل</SelectItem>
                  <SelectItem value="اتصال">اتصال</SelectItem>
                  <SelectItem value="مهتم">مهتم</SelectItem>
                  <SelectItem value="تفاوض">تفاوض</SelectItem>
                  <SelectItem value="مغلق">مغلق</SelectItem>
                  <SelectItem value="خسارة">خسارة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setItemToEdit(null);
                setEditType(null);
                setIsActivityDialogOpen(true);
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> إضافة نشاط
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setItemToEdit(null);
                setEditType(null);
                setIsTaskDialogOpen(true);
              }}
            >
              <Check className="mr-2 h-4 w-4" /> إضافة مهمة
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setItemToEdit(null);
                setEditType(null);
                setIsAppointmentDialogOpen(true);
              }}
            >
              <Calendar className="mr-2 h-4 w-4" /> إضافة موعد
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
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="timeline">الخط الزمني</TabsTrigger>
          <TabsTrigger value="tasks">المهام</TabsTrigger>
          <TabsTrigger value="appointments">المواعيد</TabsTrigger>
          <TabsTrigger value="notes">الملاحظات</TabsTrigger>
          <TabsTrigger value="related">العلاقات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات العميل المحتمل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">معلومات شخصية</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">الاسم الكامل</span>
                            <span className="font-medium">{fullName}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">البريد الإلكتروني</span>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{lead.email || '-'}</span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">رقم الهاتف</span>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{lead.phone || '-'}</span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">الدولة</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{lead.country || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">معلومات المبيعات</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">المرحلة</span>
                            <Badge className={`w-fit ${getStageColorClass(lead.status || lead.stage || 'جديد')}`}>
                              {lead.status || lead.stage || 'جديد'}
                            </Badge>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">المصدر</span>
                            <span className="font-medium">{lead.source || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">المسؤول</span>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={lead.owner?.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{lead.owner?.initials || "؟"}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{lead.owner?.name || 'غير مخصص'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">معلومات الشركة</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">اسم الشركة</span>
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              {lead.company ? (
                                <Link 
                                  to={`/dashboard/companies/${lead.company}`}
                                  className="font-medium text-primary hover:underline flex items-center"
                                >
                                  {lead.company}
                                  <ChevronRight className="h-4 w-4 mr-1" />
                                </Link>
                              ) : (
                                <span className="font-medium">-</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">المنصب</span>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{lead.position || '-'}</span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">القطاع</span>
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{lead.industry || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">معلومات التواريخ</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">تاريخ الإنشاء</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{formatDate(lead.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">آخر تحديث</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{formatDate(lead.updated_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">ملاحظات</h3>
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="whitespace-pre-wrap">{lead.notes || 'لا توجد ملاحظات'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الأنشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/50 p-3 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">الأنشطة</p>
                      <p className="text-xl font-bold">{activities.length || 0}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">المهام</p>
                      <p className="text-xl font-bold">{tasks.length || 0}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">المواعيد</p>
                      <p className="text-xl font-bold">{appointments.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>المواعيد القادمة</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingAppointments ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="mr-2 text-sm">جاري التحميل...</span>
                    </div>
                  ) : (
                    <>
                      {appointments
                        .filter(app => new Date(app.start_time) > new Date() && app.status !== 'cancelled')
                        .slice(0, 3)
                        .map(appointment => (
                          <div key={appointment.id} className="border-b pb-3 mb-3 last:mb-0 last:border-0">
                            <h4 className="font-medium">{appointment.title}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{format(new Date(appointment.start_time), 'yyyy/MM/dd HH:mm', { locale: ar })}</span>
                            </div>
                          </div>
                        ))}
                      
                      {(!appointments.length || !appointments.filter(app => new Date(app.start_time) > new Date() && app.status !== 'cancelled').length) && (
                        <p className="text-center text-muted-foreground py-2">لا توجد مواعيد قادمة</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>المهام المعلقة</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingTasks ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="mr-2 text-sm">جاري التحميل...</span>
                    </div>
                  ) : (
                    <>
                      {tasks
                        .filter(task => task.status !== 'completed' && task.status !== 'cancelled')
                        .slice(0, 3)
                        .map(task => (
                          <div key={task.id} className="border-b pb-3 mb-3 last:mb-0 last:border-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  {task.priority === 'high' && <Badge variant="destructive">عالية</Badge>}
                                  {task.priority === 'medium' && <Badge variant="secondary">متوسطة</Badge>}
                                  {task.priority === 'low' && <Badge variant="outline">منخفضة</Badge>}
                                  {task.due_date && (
                                    <span className="text-xs flex items-center text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDate(task.due_date)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0" 
                                onClick={() => handleTimelineComplete('task', task.id as string)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {(!tasks.length || !tasks.filter(task => task.status !== 'completed' && task.status !== 'cancelled').length) && (
                        <p className="text-center text-muted-foreground py-2">لا توجد مهام معلقة</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الخط الزمني</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadTimeline 
                activities={activities}
                tasks={tasks}
                appointments={appointments}
                isLoading={loadingActivities || loadingTasks || loadingAppointments}
                onEdit={handleTimelineEdit}
                onDelete={handleTimelineDelete}
                onComplete={handleTimelineComplete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>المهام</CardTitle>
              <Button 
                onClick={() => {
                  setItemToEdit(null);
                  setEditType(null);
                  setIsTaskDialogOpen(true);
                }}
                size="sm"
              >
                <Plus className="mr-1 h-4 w-4" />
                مهمة جديدة
              </Button>
            </CardHeader>
            <CardContent>
              {loadingTasks ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2">جاري التحميل...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-3 border-b pb-2">معلقة</h3>
                      <div className="space-y-2">
                        {tasks
                          .filter(task => task.status === 'pending')
                          .map(task => (
                            <div 
                              key={task.id} 
                              className="bg-muted/50 p-3 rounded-md"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{task.title}</h4>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                                  )}
                                  <div className="flex items-center gap-1 mt-1">
                                    {task.priority === 'high' && <Badge variant="destructive">عالية</Badge>}
                                    {task.priority === 'medium' && <Badge variant="secondary">متوسطة</Badge>}
                                    {task.priority === 'low' && <Badge variant="outline">منخفضة</Badge>}
                                    {task.due_date && (
                                      <span className="text-xs flex items-center text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {formatDate(task.due_date)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleTimelineEdit('task', task)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleTimelineComplete('task', task.id as string)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0 text-destructive"
                                    onClick={() => handleTimelineDelete('task', task.id as string)}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        {!tasks.filter(task => task.status === 'pending').length && (
                          <p className="text-center text-muted-foreground py-2">لا توجد مهام معلقة</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3 border-b pb-2">قيد التنفيذ</h3>
                      <div className="space-y-2">
                        {tasks
                          .filter(task => task.status === 'in_progress')
                          .map(task => (
                            <div 
                              key={task.id} 
                              className="bg-muted/50 p-3 rounded-md"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{task.title}</h4>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                                  )}
                                  <div className="flex items-center gap-1 mt-1">
                                    {task.priority === 'high' && <Badge variant="destructive">عالية</Badge>}
                                    {task.priority === 'medium' && <Badge variant="secondary">متوسطة</Badge>}
                                    {task.priority === 'low' && <Badge variant="outline">منخفضة</Badge>}
                                    {task.due_date && (
                                      <span className="text-xs flex items-center text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {formatDate(task.due_date)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleTimelineEdit('task', task)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleTimelineComplete('task', task.id as string)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0 text-destructive"
                                    onClick={() => handleTimelineDelete('task', task.id as string)}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        {!tasks.filter(task => task.status === 'in_progress').length && (
                          <p className="text-center text-muted-foreground py-2">لا توجد مهام قيد التنفيذ</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3 border-b pb-2">مكتملة</h3>
                      <div className="space-y-2">
                        {tasks
                          .filter(task => task.status === 'completed')
                          .map(task => (
                            <div 
                              key={task.id} 
                              className="bg-muted/50 p-3 rounded-md opacity-70"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium line-through">{task.title}</h4>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                                  )}
                                  <div className="flex items-center gap-1 mt-1">
                                    {task.priority === 'high' && <Badge variant="destructive">عالية</Badge>}
                                    {task.priority === 'medium' && <Badge variant="secondary">متوسطة</Badge>}
                                    {task.priority === 'low' && <Badge variant="outline">منخفضة</Badge>}
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0 text-destructive"
                                  onClick={() => handleTimelineDelete('task', task.id as string)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        {!tasks.filter(task => task.status === 'completed').length && (
                          <p className="text-center text-muted-foreground py-2">لا توجد مهام مكتملة</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>المواعيد</CardTitle>
              <Button 
                onClick={() => {
                  setItemToEdit(null);
                  setEditType(null);
                  setIsAppointmentDialogOpen(true);
                }}
                size="sm"
              >
                <Plus className="mr-1 h-4 w-4" />
                موعد جديد
              </Button>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2">جاري التحميل...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-3 border-b pb-2">المواعيد القادمة</h3>
                      <div className="space-y-3">
                        {appointments
                          .filter(app => new Date(app.start_time) > new Date() && app.status === 'scheduled')
                          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                          .map(appointment => (
                            <div 
                              key={appointment.id} 
                              className="bg-muted/50 p-3 rounded-md"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{appointment.title}</h4>
                                  {appointment.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{appointment.description}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span className="text-xs">{format(new Date(appointment.start_time), 'yyyy/MM/dd', { locale: ar })}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span className="text-xs">
                                        {format(new Date(appointment.start_time), 'HH:mm', { locale: ar })} - 
                                        {format(new Date(appointment.end_time), 'HH:mm', { locale: ar })}
                                      </span>
                                    </div>
                                    {appointment.location && (
                                      <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="text-xs">{appointment.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleTimelineEdit('appointment', appointment)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleTimelineComplete('appointment', appointment.id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0 text-destructive"
                                    onClick={() => handleTimelineDelete('appointment', appointment.id)}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        {!appointments.filter(app => new Date(app.start_time) > new Date() && app.status === 'scheduled').length && (
                          <p className="text-center text-muted-foreground py-2">لا توجد مواعيد قادمة</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3 border-b pb-2">المواعيد السابقة</h3>
                      <div className="space-y-3">
                        {appointments
                          .filter(app => new Date(app.start_time) < new Date() || app.status === 'completed')
                          .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
                          .map(appointment => (
                            <div 
                              key={appointment.id} 
                              className="bg-muted/50 p-3 rounded-md opacity-70"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{appointment.title}</h4>
                                  {appointment.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{appointment.description}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span className="text-xs">{format(new Date(appointment.start_time), 'yyyy/MM/dd', { locale: ar })}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span className="text-xs">
                                        {format(new Date(appointment.start_time), 'HH:mm', { locale: ar })} - 
                                        {format(new Date(appointment.end_time), 'HH:mm', { locale: ar })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0 text-destructive"
                                  onClick={() => handleTimelineDelete('appointment', appointment.id)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        {!appointments.filter(app => new Date(app.start_time) < new Date() || app.status === 'completed').length && (
                          <p className="text-center text-muted-foreground py-2">لا توجد مواعيد سابقة</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>الملاحظات</CardTitle>
              <Button 
                onClick={() => {
                  setItemToEdit(null);
                  setEditType(null);
                  setIsActivityDialogOpen(true);
                }}
                size="sm"
              >
                <Plus className="mr-1 h-4 w-4" />
                ملاحظة جديدة
              </Button>
            </CardHeader>
            <CardContent>
              {loadingActivities ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2">جاري التحميل...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities
                    .filter(activity => activity.type === 'note')
                    .map(activity => {
                      const creatorName = typeof activity.created_by === 'string' 
                        ? activity.profiles?.first_name ? `${activity.profiles.first_name} ${activity.profiles.last_name || ''}` : 'مستخدم'
                        : activity.created_by ? `${activity.created_by.first_name || ''} ${activity.created_by.last_name || ''}` : 'مستخدم';
                      
                      return (
                        <div 
                          key={activity.id} 
                          className="bg-muted/50 p-4 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 w-full">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{creatorName?.[0] || '؟'}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{creatorName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(activity.created_at), 'yyyy/MM/dd HH:mm', { locale: ar })}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{activity.description}</p>
                            </div>
                            <div className="flex">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => handleTimelineDelete('activity', activity.id)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {!activities.filter(activity => activity.type === 'note').length && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">لا توجد ملاحظات حتى الآن</p>
                      <Button 
                        onClick={() => {
                          setItemToEdit(null);
                          setEditType(null);
                          setIsActivityDialogOpen(true);
                        }}
                        variant="outline"
                        className="mt-4"
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        إضافة ملاحظة
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Related Tab */}
        <TabsContent value="related" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>العلاقات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">الشركة</h3>
                  {lead.company ? (
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        <Link 
                          to={`/dashboard/companies/${lead.company}`} 
                          className="font-medium text-primary hover:underline"
                        >
                          {lead.company}
                        </Link>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{lead.position || 'بدون منصب'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-4 rounded-md flex justify-center items-center flex-col">
                      <Building className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground mb-2">لا توجد شركة مرتبطة</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">المسؤول</h3>
                  {lead.assigned_to ? (
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={lead.owner?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{lead.owner?.initials || "؟"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{lead.owner?.name || 'مستخدم'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-4 rounded-md flex justify-center items-center flex-col">
                      <Users className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground mb-2">غير مخصص لأي مسؤول</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">التذاكر</h3>
                  <div className="bg-muted/50 p-4 rounded-md flex justify-center items-center flex-col">
                    <TicketIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-2">لا توجد تذاكر مرتبطة</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">الدردشات</h3>
                  <div className="bg-muted/50 p-4 rounded-md flex justify-center items-center flex-col">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-2">لا توجد دردشات مرتبطة</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
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
