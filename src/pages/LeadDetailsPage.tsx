import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLead, updateLead, deleteLead, Lead, getLeadActivities, LeadActivity } from '@/services/leads';
import { getTasks, Task } from '@/services/tasks';
import { getAppointments, Appointment } from '@/services/appointments';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Loader2, ArrowLeft, Edit, Trash, Calendar, Mail, Phone, MapPin, Building, Clock, CheckCircle, FileText, Paperclip } from 'lucide-react';
import { getStageColorClass } from '@/services/leads/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import LeadForm from '@/components/leads/LeadForm';
import ActivityForm from '@/components/leads/ActivityForm';
import TaskForm from '@/components/leads/TaskForm';
import AppointmentForm from '@/components/leads/AppointmentForm';
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import { useAuth } from '@/contexts/AuthContext';

const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoggedIn, user } = useAuth();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
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
    if (updatedLead) {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      toast.success('تم تحديث بيانات العميل المحتمل بنجاح');
    }
  };
  
  const handleActivitySuccess = () => {
    setIsActivityDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['leadActivities', id] });
    toast.success('تم إضافة النشاط بنجاح');
  };
  
  const handleTaskSuccess = () => {
    setIsTaskDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['leadTasks', id] });
    toast.success('تم إضافة المهمة بنجاح');
  };
  
  const handleAppointmentSuccess = () => {
    setIsAppointmentDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['leadAppointments', id] });
    toast.success('تم إضافة الموعد بنجاح');
  };
  
  const handleDeleteLead = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };
  
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getTaskStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getAppointmentStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rescheduled':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm', { locale: ar });
    } catch (e) {
      return 'تاريخ غير صالح';
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
              onClick={() => setIsActivityDialogOpen(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              إضافة نشاط
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsTaskDialogOpen(true)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              إضافة مهمة
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAppointmentDialogOpen(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
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
                    <TabsTrigger value="details">التفاصيل الشخصية</TabsTrigger>
                    <TabsTrigger value="company">معلومات الشركة</TabsTrigger>
                    <TabsTrigger value="additional">معلومات إضافية</TabsTrigger>
                  </TabsList>
                  
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
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="additional" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">مصدر العميل</p>
                        <p className="font-medium">{lead.source || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">المرحلة الحالية</p>
                        <Badge className={getStageColorClass(lead.status || lead.stage || 'جديد')}>
                          {lead.status || lead.stage || 'جديد'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">تاريخ الإنشاء</p>
                        <p className="font-medium">
                          {lead.created_at ? formatDateTime(lead.created_at) : '-'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">آخر تحديث</p>
                        <p className="font-medium">
                          {lead.updated_at ? formatDateTime(lead.updated_at) : '-'}
                        </p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-muted-foreground text-sm">المسؤول</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={lead.owner?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{lead.owner?.initials || "؟"}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{lead.owner?.name || 'غير مخصص'}</p>
                        </div>
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
            
            <Tabs defaultValue="activities" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="activities">الأنشطة</TabsTrigger>
                <TabsTrigger value="tasks">المهام</TabsTrigger>
                <TabsTrigger value="appointments">المواعيد</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activities">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle>أنشطة العميل</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsActivityDialogOpen(true)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      إضافة نشاط
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loadingActivities ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="mr-2">جاري تحميل الأنشطة...</span>
                      </div>
                    ) : activities.length > 0 ? (
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.id} className="border-b pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">
                                    {activity.type === "call" && "مكالمة"}
                                    {activity.type === "email" && "بريد"}
                                    {activity.type === "meeting" && "اجتماع"}
                                    {activity.type === "whatsapp" && "واتساب"}
                                    {activity.type === "note" && "ملاحظة"}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {formatDateTime(activity.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{activity.description}</p>
                              </div>
                              <div>
                                {activity.completed_at ? (
                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    مكتمل
                                  </Badge>
                                ) : activity.scheduled_at ? (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {formatDate(activity.scheduled_at)}
                                  </Badge>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">لا توجد أنشطة مسجلة لهذا العميل</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsActivityDialogOpen(true)}
                          className="mt-2"
                        >
                          إضافة نشاط
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tasks">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle>مهام العميل</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsTaskDialogOpen(true)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      إضافة مهمة
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loadingTasks ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="mr-2">جاري تحميل المهام...</span>
                      </div>
                    ) : tasks.length > 0 ? (
                      <div className="space-y-4">
                        {tasks.map((task) => (
                          <div key={task.id} className="border-b pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getPriorityBadgeColor(task.priority)}>
                                    {task.priority === 'high' && 'عالية'}
                                    {task.priority === 'medium' && 'متوسطة'}
                                    {task.priority === 'low' && 'منخفضة'}
                                  </Badge>
                                  <Badge className={getTaskStatusBadgeColor(task.status)}>
                                    {task.status === 'pending' && 'معلقة'}
                                    {task.status === 'in-progress' && 'قيد التنفيذ'}
                                    {task.status === 'completed' && 'مكتملة'}
                                    {task.status === 'cancelled' && 'ملغاة'}
                                  </Badge>
                                </div>
                                <h4 className="text-sm font-medium">{task.title}</h4>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                )}
                              </div>
                              <div>
                                {task.due_date && (
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {formatDate(task.due_date)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">لا توجد مهام مسجلة لهذا العميل</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsTaskDialogOpen(true)}
                          className="mt-2"
                        >
                          إضافة مهمة
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appointments">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle>مواعيد العميل</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsAppointmentDialogOpen(true)}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      إضافة موعد
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loadingAppointments ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="mr-2">جاري تحميل المواعيد...</span>
                      </div>
                    ) : appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <div key={appointment.id} className="border-b pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getAppointmentStatusBadgeColor(appointment.status)}>
                                    {appointment.status === 'scheduled' && 'مجدول'}
                                    {appointment.status === 'completed' && 'مكتمل'}
                                    {appointment.status === 'cancelled' && 'ملغي'}
                                    {appointment.status === 'rescheduled' && 'معاد جدولته'}
                                  </Badge>
                                </div>
                                <h4 className="text-sm font-medium">{appointment.title}</h4>
                                {appointment.description && (
                                  <p className="text-sm text-muted-foreground">{appointment.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs">
                                      {formatDateTime(appointment.start_time)}
                                    </span>
                                  </div>
                                  {appointment.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs">{appointment.location}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">لا توجد مواعيد مسجلة لهذا العميل</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAppointmentDialogOpen(true)}
                          className="mt-2"
                        >
                          إضافة موعد
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">الأنشطة</p>
                      <p className="text-xl font-bold">{activities.length || 0}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">المهام</p>
                      <p className="text-xl font-bold">{tasks.length || 0}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center col-span-2">
                      <p className="text-xs text-muted-foreground">المواعيد</p>
                      <p className="text-xl font-bold">{appointments.length || 0}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">العمليات السريعة</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="w-full" onClick={() => setIsActivityDialogOpen(true)}>
                        <FileText className="h-4 w-4 mr-2" /> نشاط
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setIsTaskDialogOpen(true)}>
                        <CheckCircle className="h-4 w-4 mr-2" /> مهمة
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setIsAppointmentDialogOpen(true)}>
                        <Calendar className="h-4 w-4 mr-2" /> موعد
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="h-4 w-4 mr-2" /> تعديل
                      </Button>
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
                            <Badge className={getAppointmentStatusBadgeColor(appointment.status)}>
                              {appointment.status === 'scheduled' && 'مجدول'}
                              {appointment.status === 'completed' && 'مكتمل'}
                              {appointment.status === 'cancelled' && 'ملغي'}
                              {appointment.status === 'rescheduled' && 'معاد جدولته'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    
                    {(!appointments.length || !appointments.filter(app => new Date(app.start_time) > new Date() && app.status !== 'cancelled').length) && (
                      <p className="text-center text-sm text-muted-foreground py-2">
                        لا توجد مواعيد قادمة
                      </p>
                    )}
                    
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setIsAppointmentDialogOpen(true)}>
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
      
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة نشاط جديد</DialogTitle>
          </DialogHeader>
          <ActivityForm 
            leadId={lead.id} 
            onSuccess={handleActivitySuccess}
            onClose={() => setIsActivityDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مهمة جديدة</DialogTitle>
          </DialogHeader>
          <TaskForm 
            leadId={lead.id} 
            onSuccess={handleTaskSuccess}
            onClose={() => setIsTaskDialogOpen(
