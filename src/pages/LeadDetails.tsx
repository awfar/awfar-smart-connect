import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Check, Clock, List, Mail, Phone, User, 
  Building, MapPin, Briefcase, Edit, Trash2, Plus 
} from "lucide-react";
import { toast } from "sonner";
import { 
  getLead, 
  getLeadActivities, 
  addLeadActivity,
  updateLead,
  completeLeadActivity,
  Lead,
  deleteLead
} from "@/services/leads";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ActivityForm from "@/components/leads/ActivityForm";
import LeadForm from "@/components/leads/LeadForm";
import { LeadActivity } from "@/services/types/leadTypes";
import { getStageColorClass } from "@/services/leads/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("info");
  const [showActivityForm, setShowActivityForm] = useState<boolean>(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [editField, setEditField] = useState<{field: string, value: string} | null>(null);
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
  
  const completeMutation = useMutation({
    mutationFn: completeLeadActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadActivities', id] });
      toast.success("تم إكمال النشاط بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث النشاط");
    }
  });
  
  const updateFieldMutation = useMutation({
    mutationFn: (data: {id: string, updates: Partial<Lead>}) => 
      updateLead({ ...lead, ...data.updates, id: data.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      setEditField(null);
      toast.success("تم تحديث البيانات بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث البيانات");
    }
  });
  
  const deleteLeadMutation = useMutation({
    mutationFn: (leadId: string) => deleteLead(leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success("تم حذف العميل المحتمل بنجاح");
      navigate("/dashboard/leads");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف العميل المحتمل");
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
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إضافة الملاحظة");
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
  
  const handleDeleteLead = () => {
    setIsDeleteConfirmOpen(true);
  };
  
  const confirmDeleteLead = () => {
    if (id) {
      deleteLeadMutation.mutate(id);
    }
    setIsDeleteConfirmOpen(false);
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

  const getLeadName = () => {
    if (!lead) return "جاري التحميل...";
    return `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/dashboard/leads")}
            >
              <ArrowLeft className="h-4 w-4 ml-1" />
              العودة
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isLoadingLead ? "جاري التحميل..." : getLeadName()}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEditLead} className="gap-1">
              <Edit className="h-4 w-4" />
              تحرير
            </Button>
            <Button variant="outline" className="gap-1 border-red-200 hover:bg-red-50 text-red-600" onClick={handleDeleteLead}>
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
            <Button>إنشاء فرصة</Button>
          </div>
        </div>

        {isLoadingLead ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ) : isErrorLead ? (
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
                العودة إلى قائمة العملاء المحتملين
              </Button>
            </CardContent>
          </Card>
        ) : lead ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-3">
                <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>بيانات العميل المحتمل</CardTitle>
                        <CardDescription>المعلومات الأساسية والتاريخ</CardDescription>
                      </div>
                      <TabsList>
                        <TabsTrigger value="info">المعلومات</TabsTrigger>
                        <TabsTrigger value="activities">الأنشطة</TabsTrigger>
                        <TabsTrigger value="notes">الملاحظات</TabsTrigger>
                      </TabsList>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <TabsContent value="info" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-500">المعلومات الشخصية</h3>
                            
                            <div className="grid gap-4">
                              <div className="flex items-start gap-2">
                                <User className="h-4 w-4 text-gray-400 mt-1" />
                                <div className="flex-1">
                                  {editField?.field === "name" ? (
                                    <div className="flex items-center gap-2">
                                      <div className="grid grid-cols-2 gap-2 flex-1">
                                        <Input 
                                          value={editField.value.split(' ')[0] || ''} 
                                          onChange={(e) => setEditField({ 
                                            ...editField, 
                                            value: `${e.target.value} ${editField.value.split(' ').slice(1).join(' ')}` 
                                          })} 
                                          placeholder="الاسم الأول" 
                                          className="text-sm h-8"
                                        />
                                        <Input 
                                          value={editField.value.split(' ').slice(1).join(' ')} 
                                          onChange={(e) => setEditField({ 
                                            ...editField, 
                                            value: `${editField.value.split(' ')[0]} ${e.target.value}` 
                                          })} 
                                          placeholder="اسم العائلة" 
                                          className="text-sm h-8"
                                        />
                                      </div>
                                      <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="relative group">
                                      <div className="text-sm font-medium">{getLeadName()}</div>
                                      <Button 
                                        className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-0" 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => startEditingField('name', `${lead.first_name} ${lead.last_name}`)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                  
                                  {editField?.field === "position" ? (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Input 
                                        value={editField.value} 
                                        onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                                        placeholder="المنصب"
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
                                      <div className="text-xs text-gray-500">{lead.position || "غير محدد"}</div>
                                      <Button 
                                        className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-5 w-5 p-0.5" 
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
                              
                              <div className="flex items-start gap-2">
                                <Mail className="h-4 w-4 text-gray-400 mt-1" />
                                <div className="flex-1">
                                  {editField?.field === "email" ? (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Input 
                                        value={editField.value} 
                                        onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                                        placeholder="البريد الإلكتروني"
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
                                      <div className="text-sm">{lead.email || "غير محدد"}</div>
                                      <div className="text-xs text-gray-500">البريد الإلكتروني</div>
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
                              </div>
                              
                              <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 text-gray-400 mt-1" />
                                <div className="flex-1">
                                  {editField?.field === "phone" ? (
                                    <div className="flex items-center gap-2">
                                      <Input 
                                        value={editField.value} 
                                        onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                                        placeholder="رقم الهاتف"
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
                                      <div className="text-sm">{lead.phone || "غير محدد"}</div>
                                      <div className="text-xs text-gray-500">رقم الهاتف</div>
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
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t space-y-1">
                            <h3 className="text-sm font-medium text-gray-500">معلومات الشركة</h3>
                            
                            <div className="grid gap-4">
                              <div className="flex items-start gap-2">
                                <Building className="h-4 w-4 text-gray-400 mt-1" />
                                <div className="flex-1">
                                  {editField?.field === "company" ? (
                                    <div className="flex items-center gap-2">
                                      <Input 
                                        value={editField.value} 
                                        onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                                        placeholder="الشركة"
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
                                      <div className="text-sm font-medium">{lead.company || "غير محدد"}</div>
                                      <div className="text-xs text-gray-500">الشركة</div>
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
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-500">معلومات الفرصة</h3>
                            
                            <div className="grid gap-4">
                              <div>
                                {editField?.field === "status" ? (
                                  <div className="flex items-center gap-2">
                                    <select 
                                      value={editField.value} 
                                      onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                                      className="w-full rounded-md border border-input px-3 py-1 text-sm"
                                    >
                                      <option value="جديد">جديد</option>
                                      <option value="مؤهل">مؤهل</option>
                                      <option value="عرض سعر">عرض سعر</option>
                                      <option value="تفاوض">تفاوض</option>
                                      <option value="مغلق">مغلق</option>
                                    </select>
                                    <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="relative group">
                                    <Badge className={getStageColorClass(lead.status || lead.stage || 'جديد')}>
                                      {lead.status || lead.stage || "جديد"}
                                    </Badge>
                                    <div className="text-xs text-gray-500 mt-1">المرحلة</div>
                                    <Button 
                                      className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => startEditingField('status', lead.status || lead.stage || 'جديد')}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                {editField?.field === "source" ? (
                                  <div className="flex items-center gap-2">
                                    <select 
                                      value={editField.value} 
                                      onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                                      className="w-full rounded-md border border-input px-3 py-1 text-sm"
                                    >
                                      <option value="">-- اختر المصدر --</option>
                                      <option value="موقع إلكتروني">موقع إلكتروني</option>
                                      <option value="وسائل التواصل الاجتماعي">وسائل التواصل الاجتماعي</option>
                                      <option value="معرض تجاري">معرض تجاري</option>
                                      <option value="توصية">توصية</option>
                                      <option value="إعلان">إعلان</option>
                                      <option value="مكالمة هاتفية">مكالمة هاتفية</option>
                                      <option value="شريك أعمال">شريك أعمال</option>
                                      <option value="أخرى">أخرى</option>
                                    </select>
                                    <Button size="sm" variant="ghost" onClick={saveField} className="h-8 w-8 p-0">
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="relative group">
                                    <div className="text-sm">{lead.source || "غير محدد"}</div>
                                    <div className="text-xs text-gray-500">المصدر</div>
                                    <Button 
                                      className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => startEditingField('source', lead.source || '')}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <div className="text-sm">{lead.owner?.name || "غير مخصص"}</div>
                                <div className="text-xs text-gray-500">المسؤول</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t space-y-1">
                            <h3 className="text-sm font-medium text-gray-500">معلومات إضافية</h3>
                            
                            <div>
                              {editField?.field === "notes" ? (
                                <div className="flex flex-col gap-2">
                                  <Textarea 
                                    value={editField.value} 
                                    onChange={(e) => setEditField({ ...editField, value: e.target.value })} 
                                    placeholder="أضف ملاحظات"
                                    className="text-sm min-h-[80px]"
                                  />
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
                                <div className="relative group">
                                  <div className="text-sm whitespace-pre-line">
                                    {lead.notes || "لا توجد ملاحظات مضافة حتى الآن."}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">الملاحظات</div>
                                  <Button 
                                    className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 h-6 w-6 p-1" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => startEditingField('notes', lead.notes || '')}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="activities">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">الأنشطة والمهام</h3>
                          {!showActivityForm && (
                            <Button size="sm" onClick={handleAddActivity}>إضافة نشاط</Button>
                          )}
                        </div>
                        
                        {showActivityForm && (
                          <Card className="mb-6 p-4">
                            <h4 className="font-medium mb-3">إضافة نشاط جديد</h4>
                            <ActivityForm 
                              onClose={() => setShowActivityForm(false)} 
                              onSuccess={handleActivitySuccess} 
                              leadId={id || ""}
                            />
                          </Card>
                        )}
                        
                        <div className="space-y-3">
                          {isLoadingActivities ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            </div>
                          ) : activities.length > 0 ? (
                            activities.map((activity) => (
                              <div 
                                key={activity.id} 
                                className="border rounded-lg p-4 bg-white relative"
                              >
                                <div className="flex justify-between">
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-full ${
                                      activity.type === 'call' ? 'bg-blue-100' : 
                                      activity.type === 'meeting' ? 'bg-purple-100' : 
                                      activity.type === 'email' ? 'bg-yellow-100' : 
                                      activity.type === 'task' ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                      {activity.type === 'call' ? (
                                        <Phone className="h-4 w-4 text-blue-700" />
                                      ) : activity.type === 'meeting' ? (
                                        <User className="h-4 w-4 text-purple-700" />
                                      ) : activity.type === 'email' ? (
                                        <Mail className="h-4 w-4 text-yellow-700" />
                                      ) : activity.type === 'task' ? (
                                        <Check className="h-4 w-4 text-green-700" />
                                      ) : (
                                        <List className="h-4 w-4 text-gray-700" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">
                                          {activity.type === 'call' ? 'مكالمة' : 
                                           activity.type === 'meeting' ? 'اجتماع' : 
                                           activity.type === 'email' ? 'بريد إلكتروني' : 
                                           activity.type === 'task' ? 'مهمة' : 'ملاحظة'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {activity.created_at ? new Date(activity.created_at).toLocaleString('ar-SA') : ''}
                                        </span>
                                      </div>
                                      <p className="text-sm mt-1">{activity.description}</p>
                                      {activity.scheduled_at && (
                                        <div className="flex items-center gap-2 mt-2">
                                          <Clock className="h-3 w-3 text-gray-400" />
                                          <span className="text-xs text-gray-500">
                                            {new Date(activity.scheduled_at).toLocaleString('ar-SA')}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {!activity.completed_at && activity.type !== 'note' && (
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => handleCompleteActivity(activity.id)}
                                      disabled={completeMutation.isPending}
                                    >
                                      إكمال
                                    </Button>
                                  )}
                                </div>
                                {activity.completed_at && (
                                  <Badge variant="outline" className="absolute top-2 left-2 text-xs">
                                    تم إكماله
                                  </Badge>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              لا توجد أنشطة مسجلة حتى الآن
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">الملاحظات</h3>
                        </div>
                        
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
                        
                        <div className="space-y-3 mt-4">
                          {activities
                            .filter(activity => activity.type === 'note')
                            .map((note) => (
                              <div key={note.id} className="border rounded-lg p-4 bg-white">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {note.created_by ? note.created_by.substring(0, 2).toUpperCase() : '؟'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">ملاحظة</span>
                                      <span className="text-xs text-gray-500">
                                        {note.created_at ? new Date(note.created_at).toLocaleString('ar-SA') : ''}
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">{note.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          
                          {activities.filter(activity => activity.type === 'note').length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                              لا توجد ملاحظات مسجلة حتى الآن
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">المرحلة الحالية</div>
                      <Badge className={getStageColorClass(lead.status || lead.stage || 'جديد')}>
                        {lead.status || lead.stage || "جديد"}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">المسؤول</div>
                      {lead.owner ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            {lead.owner.initials}
                          </div>
                          <span className="text-sm">{lead.owner.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">غير مخصص</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">تاريخ الإضافة</div>
                      <div className="text-sm mt-1">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString('ar-SA') : "غير محدد"}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">آخر تحديث</div>
                      <div className="text-sm mt-1">
                        {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('ar-SA') : "غير محدد"}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="gap-1 justify-start" onClick={() => {
                          addLeadActivity({
                            lead_id: id!,
                            type: "call",
                            description: `تم الاتصال بـ ${getLeadName()}`,
                          }).then(() => refetchActivities());
                        }}>
                          <Phone className="h-4 w-4 ml-2" />
                          سجل اتصال
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 justify-start" onClick={() => {
                          addLeadActivity({
                            lead_id: id!,
                            type: "email",
                            description: `تم إرسال بريد إلكتروني إلى ${getLeadName()}`,
                          }).then(() => refetchActivities());
                        }}>
                          <Mail className="h-4 w-4 ml-2" />
                          سجل إرسال بريد
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 justify-start" onClick={() => {
                          setActiveTab("activities");
                          handleAddActivity();
                        }}>
                          <Check className="h-4 w-4 ml-2" />
                          إضافة مهمة
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">لم يتم العثور على العميل المحتمل</p>
              <Button 
                className="mt-4"
                onClick={() => navigate("/dashboard/leads")}
              >
                العودة إلى قائمة العملاء المحتملين
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Lead Dialog */}
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد حذف العميل المحتمل</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>هل أنت متأكد من رغبتك في حذف هذا العميل المحتمل؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.</p>
          </div>
          <DialogFooter className="flex space-x-2 justify-end rtl:space-x-reverse">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteLead}
              disabled={deleteLeadMutation.isPending}
            >
              {deleteLeadMutation.isPending ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LeadDetails;
