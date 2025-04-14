
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLead, updateLead, deleteLead, Lead } from '@/services/leads';
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
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';

const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  // Fetch lead details
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
  
  const handleDeleteLead = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard/leads')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <Badge className={getStageColorClass(lead.status || lead.stage || 'جديد')}>
              {lead.status || lead.stage || 'جديد'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsActivityDialogOpen(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              إضافة نشاط
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
        
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lead Details */}
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
                          {lead.created_at ? format(new Date(lead.created_at), 'yyyy/MM/dd HH:mm', { locale: ar }) : '-'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">آخر تحديث</p>
                        <p className="font-medium">
                          {lead.updated_at ? format(new Date(lead.updated_at), 'yyyy/MM/dd HH:mm', { locale: ar }) : '-'}
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
          </div>
          
          {/* Right Column - Timeline and Related */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>الأنشطة والمهام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setIsActivityDialogOpen(true)} 
                    className="w-full mb-4"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    إضافة نشاط جديد
                  </Button>
                </div>
                <div className="text-center text-muted-foreground py-8">
                  يتم عرض الأنشطة المرتبطة بهذا العميل هنا
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Edit Dialog */}
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
      
      {/* Activity Dialog */}
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
      
      {/* Delete Confirmation Dialog */}
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
