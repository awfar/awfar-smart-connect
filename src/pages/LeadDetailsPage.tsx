import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Check, Clock, List, Mail, Phone, User, 
  Building, MapPin, Briefcase, Edit, Trash2, Plus,
  MessageSquare, Calendar, ChevronRight, Globe, FileText,
  Users, FileEdit, Loader2, Link as LinkIcon, TicketIcon
} from "lucide-react";
import { toast } from "sonner";
import { 
  getLead, 
  getLeadActivities, 
  addLeadActivity,
  updateLead,
  completeLeadActivity,
  deleteLeadActivity,
  Lead,
  LeadActivity,
} from "@/services/leads";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ActivityForm from "@/components/leads/ActivityForm";
import LeadForm from "@/components/leads/LeadForm";
import LeadTimeline from "@/components/leads/LeadTimeline";
import { getStageColorClass } from "@/services/leads/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileOptimizedContainer from "@/components/ui/MobileOptimizedContainer";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { Task } from "@/services/tasks/types";
import { Appointment } from "@/services/appointments/types";
import { 
  getTasksByLeadId as fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  completeTask 
} from "@/services/tasks/api";
import { 
  getAppointmentsByLeadId as fetchAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} from "@/services/appointments/api";
import TaskForm from "@/components/tasks/TaskForm";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showActivityForm, setShowActivityForm] = useState<boolean>(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [editField, setEditField] = useState<{field: string, value: string} | null>(null);
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{type: string, id: string} | null>(null);
  const [newNote, setNewNote] = useState<string>("");
  
  const { 
    data: lead,
    isLoading: isLoadingLead,
    isError: isErrorLead,
    error: leadError
  } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => id ? getLead(id) : null,
    enabled: !!id
  });
  
  const { 
    data: activities = [],
    isLoading: isLoadingActivities,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['leadActivities', id],
    queryFn: () => id ? getLeadActivities(id) : [],
    enabled: !!id
  });
  
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => id ? fetchTasks(id) : [],
    enabled: !!id
  });
  
  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ['appointments', id],
    queryFn: () => id ? fetchAppointments(id) : [],
    enabled: !!id
  });

  const completeMutation = useMutation({
    mutationFn: completeLeadActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadActivities', id] });
      toast.success("تم إكمال النشاط بنجاح");
    }
  });
  
  const updateFieldMutation = useMutation({
    mutationFn: (data: {id: string, updates: Partial<Lead>}) => 
      updateLead({ ...lead, ...data.updates, id: data.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      setEditField(null);
      toast.success("تم تحديث البيانات بنجاح");
    }
  });
  
  const taskMutation = useMutation({
    mutationFn: async (data: any) => {
      if (taskToEdit?.id) {
        await updateTask(taskToEdit.id, data);
      } else {
        await createTask({
          ...data,
          lead_id: id
        });
      }
      setShowTaskForm(false);
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      toast.success("تم حفظ المهمة بنجاح");
    }
  });
  
  const appointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      if (appointmentToEdit?.id) {
        await updateAppointment(appointmentToEdit.id, data);
      } else {
        await createAppointment({
          ...data,
          lead_id: id
        });
      }
      setShowAppointmentForm(false);
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
      toast.success("تم حفظ الموعد بنجاح");
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string, id: string }) => {
      if (type === 'activity') {
        return deleteLeadActivity(id);
      } else if (type === 'task') {
        return deleteTask(id);
      } else if (type === 'appointment') {
        return deleteAppointment(id);
      }
      return false;
    },
    onSuccess: (_, variables) => {
      const { type } = variables;
      if (type === 'activity') {
        queryClient.invalidateQueries({ queryKey: ['leadActivities', id] });
      } else if (type === 'task') {
        queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      } else if (type === 'appointment') {
        queryClient.invalidateQueries({ queryKey: ['appointments', id] });
      }
      toast.success("تم الحذف بنجاح");
      setItemToDelete(null);
    }
  });
  
  const addNoteMutation = useMutation({
    mutationFn: (note: string) => addLeadActivity({
      lead_id: id!,
      type: "note",
      description: note
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadActivities', id] });
      setNewNote("");
      toast.success("تمت إضافة الملاحظة بنجاح");
    }
  });
  
  const handleAddActivity = () => {
    setShowActivityForm(true);
  };

  const handleActivitySuccess = () => {
    setShowActivityForm(false);
    refetchActivities();
  };

  const handleCompleteActivity = (activityId: string) => {
    completeMutation.mutate(activityId);
  };

  const handleEditLead = () => {
    setIsEditLeadOpen(true);
  };

  const handleLeadUpdate = () => {
    setIsEditLeadOpen(false);
    queryClient.invalidateQueries({ queryKey: ['lead', id] });
    toast.success("تم تحديث بيانات العميل المحتمل بنجاح");
  };
  
  const handleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteItem = (type: string, itemId: string) => {
    setItemToDelete({ type, id: itemId });
  };
  
  const handleItemEdit = (type: string, item: any) => {
    if (type === 'task') {
      setTaskToEdit(item);
      setShowTaskForm(true);
    } else if (type === 'appointment') {
      setAppointmentToEdit(item);
      setShowAppointmentForm(true);
    }
  };

  const startEditingField = (field: string, value: string) => {
    setEditField({ field, value });
  };
  
  const saveField = () => {
    if (editField && id) {
      updateFieldMutation.mutate({
        id,
        updates: { [editField.field]: editField.value }
      });
    }
  };
  
  const cancelEditing = () => {
    setEditField(null);
  };
  
  const handleAddNote = () => {
    if (newNote.trim() && id) {
      addNoteMutation.mutate(newNote);
    }
  };
  
  const handleCompleteItem = (type: string, itemId: string) => {
    if (type === 'task') {
      completeTask(itemId).then(() => {
        queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      });
    }
  };

  const getLeadName = () => {
    if (!lead) return "جاري التحميل...";
    return `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
  };
  
  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm', { locale: ar });
    } catch (e) {
      return 'تاريخ غير صالح';
    }
  };
  
  if (isLoadingLead) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-2">جاري تحميل البيانات...</span>
        </div>
      </DashboardLayout>
    );
  }
  
  if (isErrorLead || !lead) {
    return (
      <DashboardLayout>
        <MobileOptimizedContainer>
          <div className="py-8">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-red-500">حدث خطأ أثناء تحميل بيانات العميل المحتمل</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {(leadError as Error)?.message || "لم يتم العثور على البيانات المطلوبة"}
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate("/dashboard/leads")}
                >
                  عودة إلى قائمة العملاء المحتملين
                </Button>
              </CardContent>
            </Card>
          </div>
        </MobileOptimizedContainer>
      </DashboardLayout>
    );
  }

  const handleTaskSubmit = async (data: any): Promise<void> => {
    try {
      if (taskToEdit?.id) {
        await updateTask(taskToEdit.id, data);
      } else {
        await createTask({
          ...data,
          lead_id: id
        });
      }
      setShowTaskForm(false);
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      toast.success("تم حفظ المهمة بنجاح");
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("حدث خطأ في حفظ المهمة");
    }
  };

  const handleAppointmentSubmit = async (data: any): Promise<void> => {
    try {
      if (appointmentToEdit?.id) {
        await updateAppointment(appointmentToEdit.id, data);
      } else {
        await createAppointment({
          ...data,
          lead_id: id
        });
      }
      setShowAppointmentForm(false);
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
      toast.success("تم حفظ الموعد بنجاح");
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("حدث خطأ في حفظ الموعد");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white border-b">
        <MobileOptimizedContainer>
          <div className="py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link 
                to="/dashboard/leads" 
                className="text-muted-foreground hover:text-primary"
              >
                العملاء المحتملين
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>{getLeadName()}</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border">
                  <AvatarFallback className="text-lg bg-primary/10">
                    {lead.first_name?.charAt(0) || "؟"}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h1 className="text-2xl font-bold">{getLeadName()}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    {lead.company && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building className="h-3.5 w-3.5" />
                        <span>{lead.company}</span>
                      </div>
                    )}
                    {lead.position && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{lead.position}</span>
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{lead.email}</span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getStageColorClass(lead.status || 'جديد')}>
                  {lead.status || "جديد"}
                </Badge>
                
                <Button variant="outline" size="sm" onClick={handleEditLead}>
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                
                <Button variant="default" size="sm" onClick={handleAddActivity}>
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة نشاط
                </Button>
              </div>
            </div>
          </div>
        </MobileOptimizedContainer>
      </div>
      
      <MobileOptimizedContainer className="py-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 sm:w-[500px]">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="timeline">الخط الزمني</TabsTrigger>
            <TabsTrigger value="tasks">المهام</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="notes">الملاحظات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-6 md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">المعلومات الشخصية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">الاسم الأول</h3>
                        {editField?.field === "first_name" ? (
                          <div className="flex items-center gap-2">
                            <Input 
                              value={editField.value} 
                              onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                              className="text-sm h-8"
                            />
                            <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="relative group">
                            <div>{lead.first_name || "غير محدد"}</div>
                            <Button 
                              className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => startEditingField('first_name', lead.first_name || '')}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">الاسم ال��خير</h3>
                        {editField?.field === "last_name" ? (
                          <div className="flex items-center gap-2">
                            <Input 
                              value={editField.value} 
                              onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                              className="text-sm h-8"
                            />
                            <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="relative group">
                            <div>{lead.last_name || "غير محدد"}</div>
                            <Button 
                              className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => startEditingField('last_name', lead.last_name || '')}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">البريد الإلكتروني</h3>
                        {editField?.field === "email" ? (
                          <div className="flex items-center gap-2">
                            <Input 
                              value={editField.value} 
                              onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                              className="text-sm h-8"
                              type="email"
                            />
                            <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="relative group">
                            <div>{lead.email || "غير محدد"}</div>
                            <Button 
                              className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => startEditingField('email', lead.email || '')}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">رقم الهاتف</h3>
                        {editField?.field === "phone" ? (
                          <div className="flex items-center gap-2">
                            <Input 
                              value={editField.value} 
                              onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                              className="text-sm h-8"
                              type="tel"
                            />
                            <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="relative group">
                            <div>{lead.phone || "غير محدد"}</div>
                            <Button 
                              className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => startEditingField('phone', lead.phone || '')}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">معلومات الشركة</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">الشركة</h3>
                          {editField?.field === "company" ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editField.value} 
                                onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                                className="text-sm h-8"
                              />
                              <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="relative group">
                              <div>{lead.company || "غير محدد"}</div>
                              <Button 
                                className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => startEditingField('company', lead.company || '')}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">المنصب</h3>
                          {editField?.field === "position" ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editField.value} 
                                onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                                className="text-sm h-8"
                              />
                              <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="relative group">
                              <div>{lead.position || "غير محدد"}</div>
                              <Button 
                                className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => startEditingField('position', lead.position || '')}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">آخر الأنشطة</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("timeline")}>
                      عرض الكل
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoadingActivities ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="mr-2">جاري تحميل الأنشطة...</span>
                      </div>
                    ) : activities.length > 0 ? (
                      <div className="space-y-4">
                        {activities.slice(0, 3).map(activity => (
                          <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                            <div className="rounded-full bg-primary/10 p-2">
                              {activity.type === 'note' && <FileText className="h-4 w-4" />}
                              {activity.type === 'call' && <Phone className="h-4 w-4" />}
                              {activity.type === 'email' && <Mail className="h-4 w-4" />}
                              {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                              {activity.type === 'whatsapp' && <MessageSquare className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm font-medium">
                                <span>
                                  {activity.type === 'note' ? 'ملاحظة' : 
                                   activity.type === 'call' ? 'مكالمة' : 
                                   activity.type === 'email' ? 'بريد إلكتروني' : 
                                   activity.type === 'meeting' ? 'اجتماع' : 
                                   activity.type === 'whatsapp' ? 'واتساب' : 'نشاط'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(activity.created_at), 'yyyy/MM/dd', { locale: ar })}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{activity.description}</p>
                              {activity.scheduled_at && (
                                <div className="flex items-center text-xs text-muted-foreground gap-1 mt-2">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {format(new Date(activity.scheduled_at), 'yyyy/MM/dd HH:mm', { locale: ar })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        لا توجد أنشطة مسجلة حتى الآن
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">الحالة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      {editField?.field === "status" ? (
                        <div className="flex flex-col gap-2">
                          <Select 
                            defaultValue={editField.value} 
                            onValueChange={(value) => setEditField({ ...editField, value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="جديد">جديد</SelectItem>
                              <SelectItem value="مؤهل">مؤهل</SelectItem>
                              <SelectItem value="عرض سعر">عرض سعر</SelectItem>
                              <SelectItem value="تفاوض">تفاوض</SelectItem>
                              <SelectItem value="مغلق - فائز">مغلق - فائز</SelectItem>
                              <SelectItem value="مغلق - خاسر">مغلق - خاسر</SelectItem>
                              <SelectItem value="غير مؤهل">غير مؤهل</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={cancelEditing}>
                              إلغاء
                            </Button>
                            <Button size="sm" onClick={saveField}>
                              حفظ
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <Badge className={`${getStageColorClass(lead.status || 'جديد')} text-base px-3 py-1.5`}>
                            {lead.status || "جديد"}
                          </Badge>
                          <Button 
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full" 
                            variant="secondary" 
                            size="sm"
                            onClick={() => startEditingField('status', lead.status || 'جديد')}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">روابط سريعة</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="grid gap-0.5">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="#">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          إنشاء فرصة
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setShowTaskForm(true)}>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        إضافة مهمة
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setShowAppointmentForm(true)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        جدولة موعد
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        إرسال نموذج
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        فتح الموقع الإلكتروني
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">السجلات ذات الصلة</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="grid gap-0.5">
                      <Button variant="ghost" className="w-full justify-start">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{lead.company || "إضافة شركة"}</span>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        جهات الاتصال
                        <Badge className="mr-auto" variant="outline">0</Badge>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <TicketIcon className="h-4 w-4 mr-2" />
                        التذاكر
                        <Badge className="mr-auto" variant="outline">0</Badge>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        المحادثات
                        <Badge className="mr-auto" variant="outline">0</Badge>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <MobileOptimizedContainer>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">الخط الزمني</h2>
                <Button onClick={handleAddActivity}>
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة نشاط
                </Button>
              </div>
              
              <LeadTimeline 
                activities={activities}
                tasks={tasks}
                appointments={appointments}
                isLoading={isLoadingActivities || isLoadingTasks || isLoadingAppointments}
                onEdit={(type, item) => handleItemEdit(type, item)}
                onDelete={(type, itemId) => handleDeleteItem(type, itemId)}
                onComplete={(type, itemId) => handleCompleteItem(type, itemId)}
              />
            </MobileOptimizedContainer>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">المهام</CardTitle>
                <Button onClick={() => setShowTaskForm(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة مهمة
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="mr-2">جاري تحميل المهام...</span>
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <Card key={task.id} className="overflow-hidden">
                        <div className={`${
                          task.priority === 'high' ? 'bg-red-500' : 
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        } h-1`} />
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className={`text-sm mt-1 ${task.status === 'completed' ? 'text-gray-400' : ''}`}>
                                  {task.description}
                                </p>
                              )}
                              {task.due_date && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>مستحق: {format(new Date(task.due_date), 'yyyy/MM/dd', { locale: ar })}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>تم الإنشاء: {format(new Date(task.created_at || ''), 'yyyy/MM/dd', { locale: ar })}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {task.status !== 'completed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCompleteItem('task', task.id || '')}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  إكمال
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleItemEdit('task', task)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteItem('task', task.id || '')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد مهام مسجلة حتى الآن</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowTaskForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      إضافة مهمة جديدة
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">المواعيد</CardTitle>
                <Button onClick={() => setShowAppointmentForm(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة موعد
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="mr-2">جاري تحميل المواعيد...</span>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map(appointment => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{appointment.title}</h3>
                              {appointment.description && (
                                <p className="text-sm mt-1">{appointment.description}</p>
                              )}
                              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>من: {format(new Date(appointment.start_time), 'yyyy/MM/dd HH:mm', { locale: ar })}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>إلى: {format(new Date(appointment.end_time), 'yyyy/MM/dd HH:mm', { locale: ar })}</span>
                              </div>
                              {appointment.location && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>المكان: {appointment.location}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleItemEdit('appointment', appointment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteItem('appointment', appointment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد مواعيد مسجلة حتى الآن</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowAppointmentForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      إضافة موعد جديد
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الملاحظات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border rounded-lg p-6">
                  <Textarea
                    placeholder="أضف ملاحظة جديدة..."
                    className="min-h-[100px]"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || addNoteMutation.isPending}
                    >
                      {addNoteMutation.isPending ? "جاري الحفظ..." : "حفظ الملاحظة"}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  {isLoadingActivities ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="mr-2">جاري تحميل الملاحظات...</span>
                    </div>
                  ) : (
                    activities
                      .filter(activity => activity.type === 'note')
                      .map((note) => (
                        <Card key={note.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">ملاحظة</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(note.created_at), 'yyyy/MM/dd HH:mm', { locale: ar })}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-line">{note.description}</p>
                            <div className="flex justify-end mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteItem('activity', note.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                  
                  {!isLoadingActivities && activities.filter(activity => activity.type === 'note').length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">لا توجد ملاحظات مسجلة حتى الآن</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </MobileOptimizedContainer>
      
      <Dialog open={showActivityForm} onOpenChange={setShowActivityForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة نشاط جديد</DialogTitle>
          </DialogHeader>
          <ActivityForm 
            leadId={id!} 
            onSuccess={handleActivitySuccess}
            onClose={() => setShowActivityForm(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">تحرير بيانات العميل المحتمل</DialogTitle>
          </DialogHeader>
          {lead && (
            <div className="mt-4">
              <LeadForm 
                lead={lead}
                onClose={() => setIsEditLeadOpen(false)}
                onSuccess={handleLeadUpdate}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{taskToEdit ? "تعديل المهمة" : "إضافة مهمة جديدة"}</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={taskToEdit}
            leadId={id}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setShowTaskForm(false);
              setTaskToEdit(null);
            }}
            isSubmitting={taskMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAppointmentForm} onOpenChange={setShowAppointmentForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{appointmentToEdit ? "تعديل الموعد" : "إضافة موعد جديد"}</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            appointment={appointmentToEdit}
            leadId={id}
            onSubmit={handleAppointmentSubmit}
            onCancel={() => {
              setShowAppointmentForm(false);
              setAppointmentToEdit(null);
            }}
            isSubmitting={appointmentMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا العنصر؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  deleteItemMutation.mutate(itemToDelete);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteItemMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                'حذف'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default LeadDetailsPage;
